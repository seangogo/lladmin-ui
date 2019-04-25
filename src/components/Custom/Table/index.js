import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
export default class PateoTable extends PureComponent {
  // 查询调用
  handleStandardTableChange = (pagination, filtersArg, sort) => {
    const { dispatch, fetchUrl, formValues, filterChange, parameterUrl } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const current = pagination.current - 1;
    const params = {
      page: current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sort.field) {
      params.sort = `${sort.field},${sort.order === 'descend' ? 'desc' : 'asc'}`;
    }
    if (filterChange) {
      filterChange({ ...formValues, ...filters });
    }
    if (parameterUrl) {
      dispatch({
        type: fetchUrl,
        payload: { url: parameterUrl, ...params },
      });
    } else {
      dispatch({
        type: fetchUrl,
        payload: params,
      });
    }
  };

  handleTableChange = (pagination, filters, sort) => {
    this.props.onChange(pagination, filters, sort);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    return (
      <div className={styles.standardTable}>
        <Table onChange={this.handleStandardTableChange} size="middle" {...this.props.tableProps} />
      </div>
    );
  }
}
