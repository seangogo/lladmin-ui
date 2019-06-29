import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { OmpIcon } from '@/components/Custom';
import { Card, Form, Tree, Table, message, Button, Skeleton, Row, Col } from 'antd';
import Ellipsis from '../../components/Ellipsis';
import { ModalForm, AuthButtons } from '../../components/Custom';
import { loopTreeNode } from '@/utils/utils';
import { getResources } from '../../utils/utils';
import styles from './style.less';

const { DirectoryTree, TreeNode } = Tree;
@connect(({ role, loading }) => ({
  role,
  roleLoading: loading.effects['role/fetchTree'],
  resourceLoading: loading.effects['role/getAllResource'],
}))
@Form.create()
class role extends PureComponent {
  static contextTypes = {
    authButton: PropTypes.array,
  };

  state = {
    modelVisible: false,
    roleFormData: {},
    selectedRows: [],
    updateId: '',
    checkedKeys: {
      checked: [],
      halfChecked: [],
    },
    activeKeys: [],
    selectedLevelCode: '',
    selectedKeys: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getAllResource',
    });
    dispatch({
      type: 'role/fetchTree',
    });
  }

  onSelect = (selectedKeys, e) => {
    const {
      node: {
        props: { levelCode },
      },
    } = e;
    this.setState({ selectedLevelCode: levelCode });
  };

  onOk = () => {
    const {
      checkedKeys: { checked, halfChecked },
    } = this.state;
    const payLoads = checked.concat(halfChecked).join(',');
    const { dispatch } = this.props;
    const { updateId } = this.state;
    dispatch({
      type: 'role/bindResource',
      payload: { roleId: updateId, resourceIds: payLoads },
      callback: response => {
        if (response.statusCode === '0') {
          message.success('授权成功');
          dispatch({
            type: 'role/fetchTree',
          });
        }
      },
    });
  };

  onCheck = (checkedKeys, e) => {
    const checkedObj = { checked: checkedKeys, halfChecked: e.halfCheckedKeys };
    this.setState({ checkedKeys: { ...checkedObj } });
  };

  handleAuthorization = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getResourcesIds',
      payload: record.id,
      callback: data => {
        const { activeKeys, ...checkedKeys } = data;
        this.setState({
          checkedKeys: { ...checkedKeys },
          updateId: record.id,
          activeKeys,
        });
      },
    });
  };

  handleRemove = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/remove',
      payload: { url: '/role', id },
    }).then(() => {
      dispatch({
        type: 'role/fetchTree',
      });
    });
  };

  renderRoleTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name} levelCode={item.levelCode}>
            {this.renderRoleTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} levelCode={item.levelCode} />;
    });

  renderResourceTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        const { activeKeys } = this.state;
        return (
          <TreeNode
            disabled={!activeKeys.includes(item.id)}
            title={item.name}
            key={item.id}
            icon={<OmpIcon type={item.icon} />}
            parentId={item.parentId}
            dataRef={item}
          >
            {this.renderResourceTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const {
      roleLoading,
      resourceLoading,
      role: { resources, root },
      dispatch,
    } = this.props;
    const {
      updateId,
      selectedRows,
      checkedKeys,
      selectedKeys,
      modelVisible,
      roleFormData,
      selectedLevelCode,
    } = this.state;
    loopTreeNode([root], ['name', 'id']);
    const dataList = getResources(root).filter(d => d.levelCode.indexOf(selectedLevelCode) === 0);
    const roleFormItems = [
      {
        type: 'treeSelect',
        title: '父级角色',
        key: 'parentId',
        require: true,
        options: [root],
      },
      {
        type: 'input',
        title: <span>角色名称&nbsp;</span>,
        key: 'name',
        require: true,
        rules: [{ required: true, message: '2-20位字符!', whitespace: true, max: 20, min: 2 }],
      },
      {
        type: 'textArea',
        title: '角色简介',
        key: 'remark',
      },
    ];
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        render: text => (
          <Ellipsis length={8} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '角色简介',
        dataIndex: 'remark',
        key: 'remark',
        render: text => (
          <Ellipsis length={15} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '操作',
        dataIndex: '操作',
        render: (text, record) => {
          const btns = [
            {
              title: '编辑',
              key: 'edit',
              onConfirm: () => this.setState({ roleFormData: record, modelVisible: true }),
            },
            {
              title: '删除',
              key: 'delete',
              message: '是否确认删除该角色？',
              Popconfirm: true,
              onConfirm: () => this.handleRemove.bind(this)(record.id),
            },
          ];
          return <AuthButtons authStr="role-opt" btns={btns} />;
        },
      },
    ];
    return (
      <Fragment>
        <Row gutter={{ md: 2, lg: 6, xl: 12 }} className={styles.row}>
          <Col xl={6} lg={10} md={12} sm={24} xs={24}>
            <Card bordered={false} className={styles.leftCard}>
              {
                <Skeleton loading={roleLoading} active>
                  <DirectoryTree
                    defaultExpandAll
                    expandAction="doubleClick"
                    onSelect={this.onSelect}
                  >
                    {this.renderRoleTreeNodes(root.children)}
                  </DirectoryTree>
                </Skeleton>
              }
            </Card>
          </Col>
          <Col xl={12} lg={10} md={12} sm={24} xs={24} className={styles.centerCards}>
            <Card bordered={false} className={styles.card}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    htmlType="submit"
                    // disabled={!this.context.authButton.includes('role-opt')}
                    onClick={() => this.setState({ modelVisible: true })}
                  >
                    新增
                  </Button>
                </div>
                <div className={styles.standardTable}>
                  <Table
                    loading={roleLoading}
                    rowKey={record => record.id}
                    dataSource={dataList}
                    childrenColumnName="child"
                    columns={columns}
                    pagination={false}
                    onSelectRow={this.handleSelectRows}
                    selectedRows={selectedRows}
                    onRow={record => ({
                      onClick: () => this.handleAuthorization(record),
                    })}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={10} md={12} sm={24} xs={24} className={styles.rightCards}>
            <Card
              title="资源信息"
              loading={resourceLoading}
              extra={
                updateId && (
                  <a href="#" onClick={() => this.onOk()}>
                    保存
                  </a>
                )
              }
              bordered={false}
              className={styles.card}
            >
              <Tree
                defaultExpandAll
                checkable
                checkedKeys={checkedKeys}
                showIcon
                onCheck={this.onCheck}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              >
                {this.renderResourceTreeNodes(resources)}
              </Tree>
            </Card>
          </Col>
        </Row>
        <ModalForm
          changeVisible={() => this.setState({ modelVisible: false, roleFormData: {} })}
          formItems={roleFormItems}
          visible={modelVisible}
          formData={roleFormData}
          addUrl="/role/add"
          updateUrl="/role/edit"
          dispatch={dispatch}
          callBackFetch={() => dispatch({ type: 'role/fetchTree' })}
        />
      </Fragment>
    );
  }
}
export default role;
