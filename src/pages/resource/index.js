import React, { Fragment, PureComponent } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Icon,
  Input,
  List,
  Menu,
  Radio,
  Modal,
  Row,
  Skeleton,
  Tree,
  Tag,
} from 'antd';
import { connect } from 'dva';
import { ModalForm, OmpIcon } from '@/components/Custom';
import DrawerIcon from './DrawerIcon';
import { loopTreeNode, getParentKey, getResources } from '../../utils/utils';
import styles from './style.less';

const { DirectoryTree, TreeNode } = Tree;
const { Search } = Input;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect(({ resource, loading }) => ({
  resource,
  loading: loading.models.resource,
}))
class resource extends PureComponent {
  state = {
    modalVisible: false,
    drawerVisible: false,
    formData: {},
    expandedKeys: [],
    selectedLevelCode: '',
    selectedType: '',
    searchValue: '',
    autoExpandParent: true,
    hideItem: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/fetch',
    });
  }

  searchChange = e => {
    const {
      resource: { root },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = root.children
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.key, root.children);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onSelect = (selectedKeys, e) => {
    const {
      node: {
        props: { levelCode },
      },
    } = e;
    this.setState({ selectedLevelCode: levelCode });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/remove',
      payload: { url: '/resource', id },
    }).then(() => {
      dispatch({
        type: 'resource/fetch',
      });
    });
  };

  showEditModal = item => {
    this.setState({
      formData: item,
      modalVisible: true,
      hideItem: item.type === 'MENU' ? [] : ['icon'],
    });
  };

  handleMove = (id, up) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/move',
      payload: { id, up },
    }).then(() => {
      dispatch({
        type: 'resource/fetch',
      });
    });
  };

  handleSetState = data => {
    this.setState(data);
  };

  handleCheckIcon = data => {
    const { formData } = this.state;
    this.setState({
      drawerVisible: false,
      formData: { ...formData, icon: data },
    });
  };

  render() {
    const {
      modalVisible,
      formData,
      searchValue,
      drawerVisible,
      expandedKeys,
      autoExpandParent,
      selectedLevelCode,
      selectedType,
      hideItem,
    } = this.state;
    const {
      resource: { root },
      loading,
      dispatch,
    } = this.props;
    const list = getResources(root).filter(d => d.levelCode.indexOf(selectedLevelCode) === 0);
    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span className={styles[item.type]}>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span className={styles[item.type]}>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={title} levelCode={item.levelCode}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={title} levelCode={item.levelCode} />;
      });
    loopTreeNode([root], ['name', 'id']);
    const formItems = [
      {
        type: 'treeSelect',
        title: '父资源',
        key: 'parentId',
        require: true,
        options: [root],
      },
      {
        type: 'radio',
        title: '资源类型',
        key: 'type',
        initialValue: 'MENU',
        options: [
          { label: '菜单', value: 'MENU' },
          { label: '按钮', value: 'BUTTON' },
          { label: '路由', value: 'ROUTE' },
        ],
        onChange: value => {
          if (value.type === 'MENU') {
            this.setState({ hideItem: [], formData: { ...formData, ...value } });
          } else {
            this.setState({ hideItem: ['icon'], formData: { ...formData, ...value } });
          }
        },
      },
      {
        type: 'custom',
        title: '菜单图标',
        key: 'icon',
        button: 'Choose',
        buttonOnClick: () => this.handleSetState({ drawerVisible: true }),
      },
      {
        type: 'input',
        title: '资源名称',
        key: 'name',
        rules: [
          { required: true, message: '名称不可为空' },
          {
            validator: this.getCode,
          },
        ],
        require: true,
      },
      {
        type: 'input',
        title: '资源编码',
        key: 'code',
        require: true,
        editDisabled: true,
        rules: [
          {
            required: true,
            message: '由数字、26个英文字母或者下划线组成的1-10位字符!',
            pattern: /^[\w]{1,10}$/,
          },
          {
            validator: this.checkCode,
          },
        ],
      },
      {
        type: 'textArea',
        title: '资源简介',
        key: 'remark',
        rules: [{ message: '最多15位字符!', max: 15 }],
      },
    ];
    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该资源吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      } else {
        this.handleMove(currentItem.id, key === 'up');
      }
    };
    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="up">上移</Menu.Item>
            <Menu.Item key="down">下移</Menu.Item>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const ListContent = ({ data: { createdDate, createdBy, code } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <Tag>{code}</Tag>
        </div>
        <div className={styles.listContentItem}>
          <span>创建者</span>
          <p>{createdBy}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{createdDate}</p>
        </div>
      </div>
    );
    const extraContent = (
      <RadioGroup
        defaultValue=""
        buttonStyle="solid"
        onChange={e => this.handleSetState({ selectedType: e.target.value })}
      >
        <RadioButton value="">全部</RadioButton>
        <RadioButton value="MENU">菜单</RadioButton>
        <RadioButton value="BUTTON">按钮</RadioButton>
        <RadioButton value="ROUTE">路由</RadioButton>
      </RadioGroup>
    );
    return (
      <Fragment>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }} className={styles.row}>
          <Col xl={6} lg={10} md={12} sm={24} xs={24}>
            <Card bordered={false} className={styles.leftCard}>
              <Search placeholder="Search" onChange={this.searchChange} />
              {
                <Skeleton loading={loading} active>
                  <DirectoryTree
                    showIcon
                    expandedKeys={expandedKeys}
                    expandAction="doubleClick"
                    onSelect={this.onSelect}
                    autoExpandParent={autoExpandParent}
                    onExpand={keys =>
                      this.setState({
                        expandedKeys: keys,
                        autoExpandParent: false,
                      })
                    }
                  >
                    {loop(root.children)}
                  </DirectoryTree>
                </Skeleton>
              }
            </Card>
          </Col>
          <Col xl={18} lg={10} md={12} sm={24} xs={24} className={styles.centerCards}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="资源列表"
              extra={extraContent}
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={() =>
                  this.handleSetState({
                    modalVisible: true,
                    formData: { parentId: root.id },
                  })
                }
              >
                添加
              </Button>
              <List
                size="large"
                rowKey="id"
                loading={loading}
                dataSource={selectedType === '' ? list : list.filter(d => d.type === selectedType)}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <a
                        onClick={e => {
                          e.preventDefault();
                          this.handleSetState({
                            modalVisible: true,
                            formData: { parentId: item.id },
                          });
                        }}
                      >
                        添加
                      </a>,
                      <MoreBtn current={item} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar shape="square" size="large" className={styles[item.type]}>
                          <OmpIcon type={item.icon} />
                        </Avatar>
                      }
                      title={<a href={item.href}>{item.title}</a>}
                      description={item.remark}
                    />
                    <ListContent data={item} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <ModalForm
            changeVisible={() => this.setState({ modalVisible: false, formData: {} })}
            formItems={formItems}
            visible={modalVisible}
            formData={formData}
            hideItem={hideItem}
            updateUrl="/resource"
            addUrl="/resource"
            callBackFetch={() => dispatch({ type: 'resource/fetch' })}
          />
          <DrawerIcon
            drawerVisible={drawerVisible}
            formData={formData}
            checkIcon={this.handleCheckIcon}
            setPropsState={this.handleSetState}
          />
        </Row>
      </Fragment>
    );
  }
}

export default resource;
