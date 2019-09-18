import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Card, Form, Tree, Table, message, Skeleton, Icon } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import { ModalForm, AuthButtons, OmpIcon } from '@/components/Custom';
import { getResources } from '@/utils/utils';
import styles from './style.less';

const { DirectoryTree, TreeNode } = Tree;

@connect(({ role, dept, loading }) => ({
  role,
  dept,
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
    dispatch({ type: 'dept/fetch' });
  }

  onSelect = (selectedKeys, e) => {
    const { node: { props: { levelCode } } } = e;
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
        message.success('授权成功');
        dispatch({
          type: 'role/fetchTree',
        });
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
      payload: record.value,
      callback: data => {
        const { activeKeys, ...checkedKeys } = data;
        this.setState({
          checkedKeys: { ...checkedKeys },
          updateId: record.value,
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
      if (item.children.length > 0) {
        return (
          <TreeNode key={item.value} title={item.title} levelCode={item.levelCode}>
            {this.renderRoleTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.value} title={item.title} levelCode={item.levelCode} />;
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
      dept: { treeData },
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
    const dataList = getResources(root).filter(d => d.levelCode.startsWith(selectedLevelCode));
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
        type: 'treeSelect',
        title: '所属部门',
        key: 'dept.id',
        require: true,
        options: treeData,
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
        dataIndex: 'title',
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
        <div className={styles['evenly-distributed-children']}>
          <Card bordered={false}>
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
          <Card bordered={false}>
            <div className={styles['button-border']}>
              <button className={styles.button} onClick={() => this.setState({ modelVisible: true })}>
                <span>Create</span>
              </button>
            </div>
            {/* <Button */}
            {/* icon="plus" */}
            {/* type="primary" */}
            {/* htmlType="submit" */}
            {/* onClick={() => this.setState({ modelVisible: true })} */}
            {/* > */}
            {/* 新增 */}
            {/* </Button> */}
            <div className={styles.standardTable}>
              <Table
                scroll={{ y: window.screen.width > 1440 ? 560 : 400 }}
                loading={roleLoading}
                rowKey={record => record.value}
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
          </Card>
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
        </div>
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
