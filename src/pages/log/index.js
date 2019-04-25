import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Icon, Badge } from 'antd';
import Ellipsis from '../../components/Ellipsis';
import { Table, SearchForm } from '../../components/Custom';

@connect(({ base, loading }) => ({
  base,
  loading: loading.models.base,
}))
export default class log extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    filterNameVisible: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'base/fetch', payload: { url: '/log/list' } });
  }
  onInputChange = e => {
    const obj = {};
    obj[e.target.id] = e.target.value;
    this.setState({ formValues: Object.assign(this.state.formValues, obj) });
  };
  onSearch = () => {
    const { formValues } = this.state;
    const { dispatch } = this.props;
    this.setState({
      filterNameVisible: false,
      filtered: !!formValues,
    });
    dispatch({ type: 'base/fetch', payload: { url: '/log/list', ...formValues } });
  };
  handleDeleteDate = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/remove',
      payload: { url: '/accountLog/delete', id },
    }).then(() => {
      dispatch({ type: 'base/fetch', payload: { url: '/log/list' } });
    });
  };
  render() {
    const {
      loading,
      base: {
        data: { list, pagination },
      },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    const { searchInput } = this;
    // noinspection RequiredAttributes
    const columns = [
      {
        title: '日志类型',
        dataIndex: 'type',
        render: text => {
          return text ? (
            <Badge status="success" text="成功" />
          ) : (
            <Badge status="error" text="失败" />
          );
        },
      },
      {
        title: '操作帐户',
        dataIndex: 'username',
        filterDropdown: (
          <div>
            <Input
              ref={ele => searchInput === ele}
              placeholder="账户关键字"
              id="username"
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              搜 索
            </Button>
          </div>
        ),
        filterIcon: (
          <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />
        ),
        filterDropdownVisible: this.state.filterNameVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterNameVisible: visible,
            },
            () => searchInput && searchInput.focus()
          );
        },
        render: text => {
          return (
            <Ellipsis length={20} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '日志描述',
        dataIndex: 'title',
      },
      {
        title: '请求地址',
        dataIndex: 'remoteAddr',
      },
      {
        title: '操作时间',
        dataIndex: 'operateDate',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.operateDate - b.operateDate,
      },
      {
        title: '整体用时',
        dataIndex: 'timeout',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.timeout - b.timeout,
        render: text => {
          return `${text}毫秒`;
        },
      },
      {
        title: '异常信息',
        dataIndex: 'exception',
        render: text => {
          return (
            <Ellipsis length={8} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
      {
        title: '方法',
        dataIndex: 'method',
      },
      {
        title: 'URL',
        dataIndex: 'requestUri',
      },
      {
        title: '提交参数',
        dataIndex: 'params',
        render: text => {
          return (
            <Ellipsis length={30} tooltip>
              {text}
            </Ellipsis>
          );
        },
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const tableProps = {
      loading,
      rowKey: record => record.id,
      columns,
      dataSource: list,
      selectedRows,
      pagination: paginationProps,
    };
    const searchItems = [
      {
        type: 'input',
        title: <span>操作账号</span>,
        key: 'username',
      },
      {
        type: 'input',
        title: <span>日志描述</span>,
        key: 'title',
      },
      {
        type: 'input',
        title: <span>请求地址</span>,
        key: 'remoteAddr',
      },
      {
        type: 'select',
        title: <span>日志类型</span>,
        selectOptions: [{ value: '1', label: '失败' }, { value: '0', label: '成功' }],
        key: 'type',
      },
    ];
    return (
      <Card bordered={false}>
        <SearchForm
          searchItems={searchItems}
          fetchUrl="base/fetch"
          payloadUrl={{ url: '/log/list' }}
          dispatch={dispatch}
          saveFormValues={val =>
            this.setState({
              formValues: Object.assign(this.state.formValues, val),
            })
          }
        />
        <Table
          tableProps={tableProps}
          dispatch={dispatch}
          loading={loading}
          formValues={this.state.formValues}
          filterChange={formValues => this.setState({ formValues })}
          fetchUrl="base/fetch"
          parameterUrl="/log/list"
        />
      </Card>
    );
  }
}
