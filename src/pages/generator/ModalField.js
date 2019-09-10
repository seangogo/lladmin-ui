import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Input, Select, Switch } from 'antd';
import { getPagination } from '../../utils/utils';

const { Option } = Select;

class ModalField extends PureComponent {

  state = {
    generatorConfig: [],
  };

  showModal = () => {
    const { changeVisible } =this.props;

    changeVisible(true);
  };

  handleOk = e => {
    const { changeVisible, generatorCode } =this.props;
    generatorCode();
    changeVisible(false);
  };

  handleCancel = e => {
    this.props.changeVisible(false);
  };

  handleSwitchOnChange =(checked, id)=> {
    const { fields,handleFieldInfo } = this.props;
    fields.find(f=>f.id===id).columnShow=checked;
    handleFieldInfo(fields);
  };

  handleSelectOnChange =(value, id)=> {
    const { fields,handleFieldInfo } = this.props;
    fields.find(f=>f.id===id).columnQuery=value;
    handleFieldInfo(fields);
  };
  handleInputOnChange =(value, id)=> {
    const { fields,handleFieldInfo } = this.props;
    fields.find(f=>f.id===id).extra=value;
    handleFieldInfo(fields);
  };

  render() {
    const { visible, fields, title } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '字段备注',
        dataIndex: 'columnComment',
      },
      {
        title: '字段名称',
        dataIndex: 'columnName',
      },
      {
        title: '字段类型',
        dataIndex: 'fieldType',
      },
      {
        title: '字段标题',
        dataIndex: 'extra',
        render: (text,record) => (<Input value={text} onChange={(e)=>this.handleInputOnChange(e.target.value,record.id)} />),
      },
      {
        title: '查询方式',
        dataIndex: 'columnQuery',
        render: (text,record) => {
          return (
            <Select
              showSearch
              style={{ width: 200 }}
              onChange={(val)=>this.handleSelectOnChange(val,record.id)}
              value={text}
            >
              <Option value="0">模糊</Option>
              <Option value="1">精确</Option>
            </Select>
          );
        },
      },
      {
        title: '列表显示',
        dataIndex: 'columnShow',
        render: (text,record) => (<Switch checked={text} onChange={(checked)=>this.handleSwitchOnChange(checked,record.id)} />),
      },
    ];
    return (
      <Modal
        title={title}
        width="65%"
        visible={visible}
        onOk={this.handleOk}
        okText="生成"
        onCancel={this.handleCancel}
      >
        <Table
          size="small"
          rowKey={record => record.id}
          dataSource={fields}
          columns={columns}
          pagination={false}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}

export default ModalField;
