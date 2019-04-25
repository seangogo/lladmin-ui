import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Tree, Icon, Menu, Dropdown, Popconfirm } from 'antd';
import PateoModalForm from '@/components/Custom/ModalForm';
import DescriptionList from '@/components/DescriptionList';
import styles from '../../components/Custom/Table/TableList.less';

const { Description } = DescriptionList;
const { TreeNode } = Tree;
@connect(state => ({
  dict: state.dict,
  project: state.project,
}))
class dict extends PureComponent {
  state = {
    visible: false,
    formData: {},
    detailData: {},
    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // // 左边树形数据
    // dispatch({ type: 'dict/fetchTree' });
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

  // 根据名称自动获取编码
  getCode = (rule, value, callback) => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'dict/getCode',
      payload: value,
      callback: data => {
        callback();
        this.setState({ formData: { ...formData, ...{ code: data.data, name: value } } });
      },
    });
  };

  // 验证组织编码是否存在
  checkCode = (rule, value, callback) => {
    if (this.state.formData.id) {
      callback();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'dict/checkCode',
      payload: value,
      callback: data => (data ? callback() : callback('编码已存在')),
    });
  };

  render() {
    const { autoExpandParent, expandedKeys, detailData, visible, formData } = this.state;
    const { dispatch } = this.props;
    // dict: { loading, treeData },
    const formItems = [
      {
        type: 'treeSelect',
        title: '上级字典',
        key: 'parentId',
        require: true,
        keyValue: ['name', 'id'],
        options: [],
      },
      {
        type: 'input',
        title: '字典名称',
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
        title: '字典编码',
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
        type: 'input',
        title: '入库值',
        key: 'dbValue',
      },
      {
        type: 'textArea',
        title: '字典简介',
        key: 'remark',
      },
    ];
    const nodeMenu = data => (
      <Dropdown
        overlay={
          <Menu
            style={{ marginLeft: 70 }}
            onClick={a => {
              if (a.key === 'delete') {
                if (this.state.formData.id === data.id) {
                  this.setState({ formData: {} });
                }
              }
              if (a.key === 'edit') {
                this.setState({ formData: data, visible: true });
              }
              if (a.key === 'look') {
                this.setState({ detailData: data });
              }
            }}
          >
            <Menu.Item key="edit">
              <Icon type="edit" /> 编辑
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete">
              <Popconfirm
                title="是否确认移除此字典？"
                onConfirm={() =>
                  this.props.dispatch({
                    type: 'dict/remove',
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
        <span style={{ fontSize: 16 }}>{data.title}</span>
      </Dropdown>
    );
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
            title={<span>{item.title}</span>}
          />
        );
      });
    return (
      <Fragment>
        <Card bordered={false} className={styles.card}>
          <div style={{ background: '#ECECEC', padding: '20px' }}>
            <Row gutter={16}>
              <Col span={12} style={{ height: 680 }}>
                <Card
                  title=""
                  // loading={loading}
                  bordered={false}
                  style={{ height: '100%' }}
                  extra={<a onClick={() => this.setState({ visible: true })}>新增</a>}
                  type="inner"
                >
                  {/* treeData.length */
                  false ? (
                    <Tree
                      showLine
                      onSelect={this.onSelect}
                      onExpand={keys =>
                        this.setState({
                          expandedKeys: keys,
                          autoExpandParent: false,
                        })
                      }
                      treeDefaultExpandAll
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                    >
                      {/* treeData ? loop(treeData) : */}
                      {'暂无数据'}
                    </Tree>
                  ) : (
                    'loading tree'
                  )}
                </Card>
              </Col>
              <Col span={12} style={{ height: 680 }}>
                <Card
                  title="字典信息"
                  bordered={false}
                  style={{ height: '100%', fontSize: 16 }}
                  type="inner"
                >
                  {
                    <DescriptionList col={1} gutter={10} size="large">
                      <Description term="字典名称">{detailData.name}</Description>
                      <Description term="组织编码">{detailData.code}</Description>
                      <Description term="层级编码">{detailData.levelCode}</Description>
                      <Description term="入库值">{detailData.dbValue}</Description>
                      <Description term="组织简介">{detailData.remark}</Description>
                    </DescriptionList>
                  }
                </Card>
              </Col>
            </Row>
          </div>
          <PateoModalForm
            changeVisible={() => this.setState({ visible: false, formData: {} })}
            formItems={formItems}
            visible={visible}
            formData={formData}
            updateUrl="/dict/edit"
            addUrl="/dict/add"
            dispatch={dispatch}
            callBackFetch={() => dispatch({ type: 'dict/fetchTree' })}
          />
        </Card>
      </Fragment>
    );
  }
}
export default dict;
