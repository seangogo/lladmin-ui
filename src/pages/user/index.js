import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Badge,
  message,
  Select,
  Popconfirm,
} from 'antd';
import Ellipsis from '../../components/Ellipsis';
import UserDetailModal from './userDetailModal';
import { Table, SearchForm, AuthButtons, ModalForm } from '@/components/Custom';
import Active from './active';
import styles from '@/components/Custom/Table/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ base, user, role, org, account, loading }) => ({
  base,
  user,
  role,
  org,
  account,
  loading: loading.models.user,
}))
@Form.create()
class user extends PureComponent {
  static contextTypes = {
    authButton: PropTypes.array,
  };

  state = {
    visible: false,
    detailVisible: false,
    activeVisible: false,
    activeId: '',
    detailModelData: {},
    orgSelectOpetions: [],
    formData: {},
    expandForm: false,
    selectedRowKeys: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetch' });
    dispatch({ type: 'org/fetchTree' });
    dispatch({ type: 'role/select' });
  }

  handleFormReset = () => {
    const {
      form: { resetFields },
      dispatch,
    } = this.props;
    resetFields();
    this.setState({ formValues: {} });
    dispatch({ type: 'user/fetch' });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleEdit = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bestForm/fetchEdit',
      payload: { url: '/user/edit', id: key },
      callback: data => {
        if (!data.code) {
          this.setState({ formData: data, visible: true });
        }
      },
    });
  };

  handleDeleteDate = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/remove',
      payload: key,
      callback: data => {
        if (data.code === '200') {
          dispatch({
            type: 'user/fetch',
            payload: this.state.formValues,
          });
        }
      },
    });
  };

  handleBatchesDelete = key => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/batchesRemove',
      payload: key.join(','),
      callback: () => {
        this.setState({ selectedRowKeys: [] });
      },
    });
  };

  checkUsername = (rule, value, callback) => {
    if (this.state.formData.id) {
      callback();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'user/checkedUserName',
      payload: value,
      callback: data => {
        return data ? callback() : callback('账户名已存在');
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { orgSelectOpetions } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: Object.assign(this.state.formValues, fieldsValue),
      });
      if (fieldsValue.orgCode) {
        const org = orgSelectOpetions.find(d => d.label === fieldsValue.orgCode);
        if (!org) {
          message.error(`${fieldsValue.orgCode}组织不存在`);
          return;
        }
        this.setState({ formValues: Object.assign(this.state.formValues, { orgCode: org.value }) });
      }
      dispatch({
        type: 'user/fetch',
        payload: this.state.formValues,
      });
    });
  };

  handleDetail = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUser',
      payload: { id },
      callback: data => {
        this.setState({ detailModelData: data, detailVisible: true });
      },
    });
  };

  handleLock = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/lock',
      payload: id,
      callback: response => {
        if (response.statusCode === '0') {
          message.success('操作成功');
          dispatch({
            type: 'user/fetch',
            payload: this.state.formValues,
          });
        }
      },
    });
  };

  handleDyOrg = value => {
    if (!value) {
      this.setState({ orgSelectOpetions: [] });
    } else {
      this.props.dispatch({
        type: 'user/searchOrg',
        payload: { name: value },
        callback: orgSelectOpetions => {
          this.setState({ orgSelectOpetions });
        },
      });
    }
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登陆帐户">
              {getFieldDecorator('username')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登陆帐户">
              {getFieldDecorator('username')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话号码">
              {getFieldDecorator('phone')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属组织">
              {getFieldDecorator('orgCode')(
                <Select mode="combobox" onChange={this.handleDyOrg} placeholder="请输入关键字">
                  {this.state.orgSelectOpetions.map(d => (
                    <Option value={d.label} key={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属角色">
              {getFieldDecorator('roleId')(
                <Select placeholder="请选择" showSearch>
                  {this.props.role.select.map(d => (
                    <Option key={d.value} value={d.value}>
                      {d.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="注册邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const {
      loading,
      user: {
        data: { list, pagination },
      },
      role: { select },
      org: { treeData },
      dispatch,
    } = this.props;
    const { activeVisible } = this.state;
    const formItems = [
      {
        type: 'input',
        title: <span>登陆账户</span>,
        key: 'username',
        require: true,
        editDisabled: true,
        rules: [
          {
            required: true,
            message: '由数字、26个英文字母,中文或者下划线组成的2-12位字符!',
            pattern: /^[\w|^\u4E00-\u9FA5]{2,12}$/,
          },
          {
            validator: this.checkUsername,
          },
        ],
      },
      {
        type: 'input',
        title: '电话号码',
        key: 'phone',
        rules: [
          {
            required: true,
            message: '电话号码有误!',
            whitespace: true,
            pattern: /^1[3|5|7|8][0-9]\d{8}$/,
          },
        ],
        require: true,
      },
      {
        type: 'multiSelect',
        title: '所属角色',
        key: 'roleId',
        require: true,
        options: select,
      },
      {
        type: 'treeSelect',
        title: '所属组织',
        key: 'orgId',
        require: true,
        options: treeData,
      },
      {
        type: 'input',
        title: '真实姓名',
        key: 'realName',
        require: true,
        rules: [
          {
            required: true,
            message: '2-8位中文或小写字母!',
            whitespace: true,
            pattern: /^[a-z|^\u4E00-\u9FA5]{2,20}$/,
          },
        ],
      },
      {
        type: 'radio',
        title: '用户性别',
        key: 'sex',
        initialValue: 'MALE',
        options: [{ label: '男', value: 'MALE' }, { label: '女', value: 'FEMALE' }],
      },
      {
        type: 'input',
        title: '电子邮箱',
        key: 'email',
        rules: [{ type: 'email', message: '邮箱格式不正确' }],
      },
      {
        type: 'img',
        title: '用户头像',
        key: 'imgUrl',
      },
    ];
    const columns = [
      {
        title: '登陆账号',
        dataIndex: 'username',
        render: text => {
          return (
            <Ellipsis length={12} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        render: text => {
          return (
            <Ellipsis length={12} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '账户状态',
        dataIndex: 'active',
        render: (text, record) => {
          const { credentialsNonExpired, accountNonExpired, accountNonLocked } = record;
          if (!accountNonExpired) {
            return <Badge status="error" text="未激活" />;
          }
          if (!credentialsNonExpired) {
            return <Badge status="error" text="已过期" />;
          }
          if (!accountNonLocked) {
            return <Badge status="processing" text="锁定" />;
          }
          return <Badge status="success" text="可用" />;
        },
      },
      {
        title: '所属组织',
        dataIndex: 'org.name',
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
      },
      {
        title: '操作',
        dataIndex: '操作',
        render: (text, record) => {
          const btns = [
            {
              title: '编辑',
              key: 'edit',
              onConfirm: () => this.handleEdit.bind(this)(record.id),
            },
            {
              title: '删除',
              key: 'delete',
              message: '删除该用户下所有账户？',
              Popconfirm: true,
              onConfirm: () => this.handleDeleteDate.bind(this)(record.id),
            },
            {
              title: '详情',
              key: 'detail',
              onConfirm: () => this.handleDetail.bind(this)(record),
            },
          ];
          if (record.account.active) {
            btns.push({
              title: record.account.active ? (record.account.locked ? '解锁' : '锁定') : '',
              key: 'locked',
              message: `是否确定${record.account.locked ? '解锁' : '锁定'}该用户？`,
              Popconfirm: true,
              onConfirm: () => this.handleLock.bind(this)(record.id),
            });
          } else {
            btns.push({
              title: '激活',
              key: 'active',
              onConfirm: () => this.setState({ activeVisible: true, activeId: record.id }),
            });
          }
          return <AuthButtons authStr="user-opt" btns={btns} />;
        },
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      showTotal: () => (
        <span>
          共&nbsp;
          {pagination === undefined ? 0 : pagination.total}
          &nbsp;条
        </span>
      ),
    };
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: selectedRowKeys => {
        this.setState({ selectedRowKeys });
      },
    };
    const tableProps = {
      columns,
      rowKey: record => record.id,
      loading,
      dataSource: list,
      pagination: paginationProps,
      rowSelection,
      selectedRows: this.state.selectedRowKeys,
    };
    return (
      <Card bordered={false} className={styles.card}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button
              icon="plus"
              type="primary"
              htmlType="submit"
              className="ant-btn ant-btn-primary"
              onClick={() => this.setState({ visible: true })}
            >
              新增
            </Button>

            {this.state.selectedRowKeys.length > 0 ? (
              <Popconfirm
                title="是否确认删除所选用户？"
                onConfirm={() => this.handleBatchesDelete(this.state.selectedRowKeys)}
              >
                <Button type="danger" htmlType="submit">
                  批量删除
                </Button>
              </Popconfirm>
            ) : null}
          </div>
          <Table
            tableProps={tableProps}
            dispatch={dispatch}
            fetchUrl="user/fetch"
            formValues={this.state.formValues}
            filterChange={formValues => this.setState({ formValues })}
          />
          <ModalForm
            modalId="user_new"
            changeVisible={() => this.setState({ visible: false, formData: {} })}
            formItems={formItems}
            visible={this.state.visible}
            formData={this.state.formData}
            updateUrl="/user/edit"
            addUrl="/user/add"
            dispatch={dispatch}
            selectArrList={['roleId']}
            callBackFetch={() => dispatch({ type: 'user/fetch', payload: this.state.formValues })}
          />
          <Active
            dispatch={dispatch}
            visible={activeVisible}
            id={this.state.activeId}
            changeVisible={() => this.setState({ activeVisible: false })}
          />
          <UserDetailModal
            changeVisible={() => this.setState({ detailVisible: false })}
            visible={this.state.detailVisible}
            detailModelData={this.state.detailModelData}
            dispatch={dispatch}
          />
        </div>
      </Card>
    );
  }
}
export default user;
