import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Card, Button, message, Badge } from 'antd';
import Ellipsis from '../../components/Ellipsis';
import { Table, ModalForm, AuthButtons, SearchForm } from '@/components/Custom';
import styles from '../../components/Custom/Table/TableList.less';

@connect(({ base, project, brand, loading }) => ({
  base,
  brand,
  project,
  loading: loading.models.project,
}))
class project extends PureComponent {
  static contextTypes = {
    authButton: PropTypes.array,
  };

  state = {
    selectedRows: [],
    formData: {},
    visible: false,
    searchValues: {},
    seriesProjectId: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'base/list', payload: { url: '/project/list' } });
    dispatch({ type: 'brand/labels' });
  }

  onInputChange = e => {
    const obj = {};
    obj[e.target.id] = e.target.value;
    this.setState({ searchValues: Object.assign(this.state.searchValues, obj) });
  };

  handleDeleteDate = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/remove',
      payload: { url: '/project/delete', id },
    }).then(() => {
      dispatch({ type: 'base/list', payload: { url: '/project/list' } });
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { seriesProjectId } = this.state;
    dispatch({
      type: 'base/edit',
      payload: {
        url: '/project/series',
        id: seriesProjectId,
      },
      callback: response => {
        if (response.statusCode === '0') {
          message.success('关联成功');
        }
      },
    }).then(() => {
      dispatch({ type: 'base/list', payload: { url: '/project/list' } });
    });
  };

  checkCode = (rule, value, callback) => {
    if (this.state.formData.id) {
      callback();
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'project/checkedCode',
      payload: value,
      callback: data => (data ? callback() : callback('编码已存在')),
    });
  };

  render() {
    const {
      base: { listData, loading },
      brand: { select },
      dispatch,
    } = this.props;
    const { selectedRows, visible, formData } = this.state;
    const formItems = [
      {
        type: 'input',
        title: '项目名称',
        key: 'name',
        rules: [{ required: true, message: '2-30位字符!', whitespace: true, max: 30, min: 2 }],
        require: true,
      },
      {
        type: 'input',
        title: '项目编码',
        key: 'code',
        editDisabled: true,
        rules: [
          { required: true, message: '2-30位字符!', whitespace: true, max: 30, min: 2 },
          {
            validator: this.checkCode,
          },
        ],
      },
      {
        type: 'select',
        title: '所属品牌',
        key: 'brand.id',
        selectOptions: select,
      },
      {
        type: 'radio',
        title: '车型',
        key: 'carType',
        initialValue: 'FUEL',
        options: [{ label: '燃油车', value: 'FUEL' }, { label: '新能源车', value: 'NEWENERGY' }],
      },
      {
        type: 'textArea',
        title: '项目简介',
        key: 'remark',
      },
    ];
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        render: text => (
          <Ellipsis length={20} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '项目编码',
        dataIndex: 'code',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '所属品牌',
        dataIndex: 'brand.name',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '车辆类型',
        dataIndex: 'carType',
        render: text => (
          <Badge
            status={text === 'FUEL' ? 'error' : 'success'}
            text={text === 'FUEL' ? '燃油车' : '新能源车'}
          />
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
              onConfirm: () =>
                this.setState({
                  formData: { ...record, ...{ 'brand.id': record.brand.id } },
                  visible: true,
                }),
            },
            {
              title: '删除',
              key: 'delete',
              message: '确认删除该项目？',
              Popconfirm: true,
              onConfirm: () => this.handleDeleteDate.bind(this)(record),
            },
          ];
          return <AuthButtons authStr="project-opt" btns={btns} />;
        },
      },
    ];
    const searchItems = [
      {
        type: 'input',
        title: <span>项目名称</span>,
        key: 'name',
      },
      {
        type: 'select',
        title: <span>品牌</span>,
        selectOptions: select,
        key: 'brandId',
      },
    ];
    const tableProps = {
      loading,
      rowKey: record => record.id,
      columns,
      dataSource: listData,
      pagination: false,
      selectedRows,
    };
    return (
      <Fragment>
        <Card bordered={false} className={styles.card}>
          <SearchForm
            searchItems={searchItems}
            fetchUrl="base/list"
            payloadUrl={{ url: '/project/list' }}
            dispatch={dispatch}
          />
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button
                size="default"
                icon="plus"
                type="primary"
                htmlType="submit"
                onClick={() => this.setState({ visible: true })}
              >
                新增
              </Button>
            </div>
            <Table tableProps={tableProps} />
            <ModalForm
              changeVisible={() => this.setState({ visible: false, formData: {} })}
              formItems={formItems}
              dispatch={dispatch}
              formData={formData}
              visible={visible}
              updateUrl="/project/edit"
              addUrl="/project/add"
              callBackFetch={() =>
                dispatch({
                  type: 'base/list',
                  payload: { url: '/project/list', ...this.state.formValues },
                })
              }
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
export default project;
