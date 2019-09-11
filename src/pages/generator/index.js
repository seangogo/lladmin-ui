import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Card, Row, Col, Input, Skeleton, Tree, Button, Popconfirm, Table, Icon } from 'antd';
import Ellipsis from '../../components/Ellipsis';
import fetch from 'dva/fetch';
import styles from './index.less';
import { ModalForm, AuthButtons } from '../../components/Custom';
import { getParentKey, getPagination } from '../../utils/utils';
import ModalField from './ModalField';
import { getToken, removeToken } from '@/utils/auth';

const { DirectoryTree, TreeNode } = Tree;
const { Search } = Input;

@connect(({ base,generator, loading }) => ({
  base,
  generator,
  loading: loading.effects['generator/fetch'],
  tableLoading: loading.effects['generator/fetchTable'],
}))
class generator extends PureComponent {
  state = {
    expandedKeys: [],
    selectedKey: null,
    autoExpandParent: true,
    searchValue: {},
    generatorVisible: false,
    tableFormData: {},
    formData: {},
    dbVisible: false,
    fields: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'generator/fetch',
    });
    dispatch({
      type: 'generator/fetchTable',
    })
  }

  searchChange = e => {
    const { generator: { treeData } } = this.props;
    const { value } = e.target;
    const expandedKeys = treeData.children
      .map(item => {
        if (item.label.indexOf(value) > -1) {
          return getParentKey(item.key, treeData.children);
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

  handleFieldInfoOnChange = (fields) => {
    this.setState({fields: [...fields]})
  };

  handleGeneratorCode = () => {
    const { fields, tableFormData } =this.state;
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify([...fields]),
    };
    const { tableName } = tableFormData;
    fetch(`http://localhost:8080/generator/code?tableName=${tableName}`, options)
      .then(res => res.blob().then(blob => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
      a.href = url;
      a.download = "lladmin-generate.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    }));
  };

  onSelect = (selectedKeys, e) => {
    const { node: { props: { eventKey, title: { props } } } } = e;
    const { searchValue } = this.state;
    const { dispatch } = this.props;
    console.log(eventKey);
    if (eventKey.startsWith('f')) {
      return false;
    }
    const search = {};
    if (eventKey.startsWith('d')) {
      search.dataBaseId = parseInt(eventKey.substring(1), 10);
    } else {
      search.tableName = props.children;
    }
    const params = {
      ...searchValue,
      ...search,
    };
    dispatch({
      type: 'generator/fetchTable',
      payload: params,
    }).then(() => {
      this.setState({ searchValue: params, selectedKey: eventKey });
    });
  };

  handleSetState = data => {
    this.setState(data);
  };

  handleStandardTableChange = (pagination, filters, sort) => {
    const { dispatch } = this.props;
    const { searchValue } = this.state;
    const params = {
      ...searchValue,
      page: pagination.current - 1,
      size: pagination.pageSize,
    };
    if (sort.field) {
      params.sort = `${sort.field},${sort.order === 'descend' ? 'desc' : 'asc'}`;
    }
    dispatch({
      type: 'generator/fetchTable',
      payload: params,
    }).then(() => {
      this.setState({ searchValue: params, });
    });
  };

  handleRemove = () => {
    const { dispatch } = this.props;
    const { selectedKey } = this.state;
    dispatch({
      type: 'base/remove',
      payload: { url: '/generator/database', id: selectedKey.substring(1)},
      callback: () => {
        dispatch({
          type: 'generator/fetch',
        });
      }
    })
  };

  render() {
    const { expandedKeys, selectedKey, autoExpandParent, searchValue, generatorVisible, tableFormData, fields, dbVisible, formData } = this.state;
    const { loading, tableLoading, generator: { treeData, page: { list, pagination } }, dispatch } = this.props;
    const loop = data =>
      data.map(item => {
        const index = item.label.indexOf(searchValue);
        const beforeStr = item.label.substr(0, index);
        const afterStr = item.label.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span className={styles[item.type]}>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span className={styles[item.type]}>{item.label}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={title} />;
      });

    const formItems = [
      {
        type: 'input',
        title: '连接地址',
        key: 'jdbcUrl',
        placeholder: 'jdbc:mysql://xxx.xx.x.xx:xxxx/xxxx?useUnicode=true&characterEncoding=UTF-8&useSSL=true&serverTimezone=Asia/Shanghai',
        rules: [
          { required: true, message: '名称不可为空' },
        ],
        require: true,
      },
      {
        type: 'input',
        title: '账户名',
        key: 'username',
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
        title: '密码',
        key: 'password',
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
        title: '数据库别名',
        key: 'alias',
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
    ];

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '表名',
        dataIndex: 'tableName',
      },
      {
        title: '数据库引擎',
        dataIndex: 'engine',
      },
      {
        title: '字符编码集',
        dataIndex: 'coding',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        render: text => (
          <Ellipsis length={12} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '建表日期',
        dataIndex: 'createTime',
      },
      {
        title: '操作',
        dataIndex: '操作',
        render: (text, record) => {
          const btns = [
            {
              title: '生成代码',
              key: 'edit',
              onConfirm: ()=>this.setState({ generatorVisible: true, tableFormData: record, fields: record.fields }),
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
              <Search placeholder="Search" onChange={this.searchChange} />
              {
                <Skeleton loading={loading} active>
                  <DirectoryTree
                    showIcon
                    draggable
                    expandedKeys={expandedKeys}
                    onSelect={this.onSelect}
                    autoExpandParent={autoExpandParent}
                    onExpand={keys =>
                      this.setState({
                        expandedKeys: keys,
                        autoExpandParent: false,
                      })
                    }
                  >
                    {loop(treeData.children)}
                  </DirectoryTree>
                </Skeleton>
              }
            </Card>
          </Col>
          <Col xl={18} lg={10} md={12} sm={24} xs={24} className={styles.centerCards}>
            <Card
              className={styles.listCard}
              bordered={false}
              title="表数据列表"
              extra={selectedKey  && selectedKey.startsWith("d") &&
              <Popconfirm
                title="Are you sure delete this database?"
                onConfirm={this.handleRemove}
                onCancel={()=>console.log("onCancel")}
                okText="Yes"
                cancelText="No"
              >
                <Icon type="delete" />
              </Popconfirm>
              }
            >
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={() =>
                  this.handleSetState({
                    dbVisible: true,
                    formData: { parentId: null },
                  })
                }
              >
                添加
              </Button>
              <Table
                size="small"
                loading={tableLoading}
                rowKey={record => record.id}
                dataSource={list}
                columns={columns}
                pagination={getPagination(pagination)}
                onChange={this.handleStandardTableChange}
              />
            </Card>
          </Col>
          <ModalField
            visible={generatorVisible}
            title={tableFormData.tableName}
            fields={fields}
            changeVisible={(v) => this.setState({ generatorVisible: v })}
            handleFieldInfo={this.handleFieldInfoOnChange}
            generatorCode={this.handleGeneratorCode}
          />
          <ModalForm
            changeVisible={() => this.setState({ dbVisible: false, formData: {} })}
            formItems={formItems}
            visible={dbVisible}
            formData={formData}
            addUrl="/generator/create/database"
            callBackFetch={() => dispatch({ type: 'resource/fetch' })}
          />
        </Row>
      </Fragment>
    );
  }
}
export default generator;
