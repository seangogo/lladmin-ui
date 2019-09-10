import React from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Tree, Tag, Icon, Menu, Dropdown, Popconfirm } from 'antd';
import { ModalForm } from '@/components/Custom';
import DescriptionList from '../../components/DescriptionList';
import styles from '@/components/Custom/Table/TableList.less';

const { Description } = DescriptionList;
const { TreeNode } = Tree;
const tagColors = [
  'volcano',
  'purple',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'red',
  'orange',
];
const getParentKey = (id, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.id === id) {
      parentKey = node;
    }
    if (node.children.length > 0) {
      if (node.children.find(item => item.id === id)) {
        parentKey = node.children.find(item => item.id === id);
      } else if (getParentKey(id, node.children)) {
        parentKey = getParentKey(id, node.children);
      }
    }
  }
  return parentKey;
};
@connect(({ dept, brand, project, loading }) => ({
  dept,
  brand,
  project,
  loading: loading.models.dept,
}))
class dept extends React.PureComponent {
  state = {
    visible: false,
    formData: {},
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 左边树形数据
    dispatch({ type: 'dept/fetch' });
  }

  onSelect = (selectedKeys, e) => {
    const { expandedKeys } = this.state;
    const {
      node: {
        props: { eventKey },
      },
    } = e;
    this.setState({
      expandedKeys: expandedKeys.includes(eventKey)
        ? expandedKeys.filter(d => eventKey !== d)
        : expandedKeys.concat(eventKey),
    });
  };

  // 验证组织编码是否存在
  checkCode = (rule, value, callback) => {
    if (this.state.formData.id) {
      callback();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'dept/checkCode',
      payload: value,
      callback: data => {
        return data ? callback() : callback('编码已存在');
      },
    });
  };

  render() {
    const { formData, autoExpandParent, expandedKeys } = this.state;
    const {
      loading,
      org: { treeData },
      brand: { select },
      dispatch,
    } = this.props;
    console.log(treeData);
    const formItems = [
      {
        type: 'treeSelect',
        title: '上级组织',
        key: 'parentId',
        require: true,
        options: treeData,
      },
      {
        type: 'multiSelect',
        title: '关联品牌',
        key: 'brandIds',
        require: true,
        options: select,
      },
      {
        type: 'input',
        title: '组织名称',
        key: 'name',
        rules: [{ required: true, message: '名称不可为空' }],
        require: true,
      },
      {
        type: 'input',
        title: '组织编码',
        key: 'code',
        require: true,
        editDisabled: true,
        rules: [
          {
            required: true,
            message: '由数字、26个英文字母或者下划线组成的2-10位字符!',
            pattern: /^[\w]{2,10}$/,
          },
          {
            validator: this.checkCode,
          },
        ],
      },
      {
        type: 'textArea',
        title: '组织简介',
        key: 'remark',
      },
    ];
    const nodeMenu = data => {
      return (
        <Dropdown
          overlay={
            <Menu
              style={{ marginLeft: 70 }}
              onClick={a => {
                if (a.key === 'delete') {
                  if (this.state.formData.id === data.id) {
                    this.setState({ formData: {} });
                  }
                  return;
                }
                this.setState({ formData: data });
                if (a.key === 'look') {
                  return;
                }
                this.setState({ visible: true });
              }}
            >
              <Menu.Item key="edit">
                <Icon type="edit" /> 编辑
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete">
                <Popconfirm
                  title="是否确认移除此组织？"
                  onConfirm={() =>
                    this.props.dispatch({
                      type: 'dept/remove',
                      payload: data.id,
                    })
                  }
                >
                  <Icon type="delete" /> 删除
                </Popconfirm>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="look">
                <Icon type="eye-o" /> 查看
              </Menu.Item>
            </Menu>
          }
          trigger={['contextMenu']}
          placement="bottomCenter"
        >
          <span style={{ fontSize: 16 }}>{data.name}</span>
        </Dropdown>
      );
    };
    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.id} title={nodeMenu(item)}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            icon={<Icon type="smile-o" />}
            key={item.levelCode}
            title={<span>{item.name}</span>}
          />
        );
      });
    return (
      <Card bordered={false} className={styles.card}>
        <div style={{ background: '#ECECEC', padding: '20px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="组织机构"
                loading={loading}
                bordered={false}
                extra={<a onClick={() => this.setState({ visible: true })}>新增</a>}
                type="inner"
                className={styles.card}
              >
                <div style={{ minHeight: 680, overflowY: 'auto', maxHeight: 380 }}>
                  {treeData.length ? (
                    <Tree
                      showLine
                      onSelect={this.onSelect}
                      onExpand={keys =>
                        this.setState({
                          expandedKeys: keys,
                          autoExpandParent: false,
                        })
                      }
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                    >
                      {treeData ? loop(treeData) : '暂无数据'}
                    </Tree>
                  ) : (
                    'loading tree'
                  )}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="组织信息"
                bordered={false}
                type="inner"
                style={{ height: 794, fontSize: 16 }}
              >
                {
                  <DescriptionList col={1} gutter={10} size="large">
                    <Description term="组织名称">
                      <Tag color="purple">{formData.name || '暂无'}</Tag>
                    </Description>
                    <Description term="组织类型">
                      <Tag color="geekblue">{orgType[formData.orgType] || '暂无'}</Tag>
                    </Description>
                    <Description term="组织编码">
                      <Tag color="blue">{formData.code || '暂无'}</Tag>
                    </Description>
                    <Description term="层级编码">
                      <Tag color="lime">{formData.levelCode || '暂无'}</Tag>
                    </Description>
                    <Description term="关联品牌">
                      {formData.brandIds &&
                        formData.brandIds.map((item, index) => (
                          <Tag
                            style={{ marginBottom: 10 }}
                            key={item}
                            color={tagColors[10 - index]}
                          >
                            {select.find(d => d.value === item).label}
                          </Tag>
                        ))}
                    </Description>
                    <Description term="组织简介">{formData.remark || '暂无'}</Description>
                  </DescriptionList>
                }
              </Card>
            </Col>
          </Row>
        </div>
        <ModalForm
          changeVisible={() => this.setState({ visible: false, formData: {} })}
          formItems={formItems}
          visible={this.state.visible}
          formData={this.state.formData}
          updateUrl="/org/edit"
          addUrl="/org/add"
          dispatch={dispatch}
          selectArrList={['brandIds']}
          callBackFetch={() => dispatch({ type: 'dept/fetchTree' })}
        />
      </Card>
    );
  }
}
export default dept;
