import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Input,
  Form,
  Modal,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  message,
  TreeSelect,
  Row,
  Col,
} from 'antd';
import PateoUploadImage from '../uploadImage/PateoUploadImage';
import PateoUploadFile from '../uploadFile/PateoUploadFile';
import { Field } from '../../Charts';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
@connect(state => ({
  base: state.base,
}))
@createForm({
  mapPropsToFields(props) {
    const formDataEdit = { ...props.formData };
    Object.keys(formDataEdit).map(
      i => (formDataEdit[i] = Form.createFormField({ value: formDataEdit[i] }))
    );
    return formDataEdit;
  },
  onValuesChange(e, values) {
    const item = e.formItems.find(d => d.key === Object.keys(values)[0]);
    if (item && item.onChange) {
      item.onChange(values);
    }
  },
})
class ModalForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dateFormatList = props.dateFormatList;
    this.formItems = props.formItems;
  }

  state = {
    comboboxOpetions: [],
  };

  handleOk = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      dateFormatList,
      confirmCom,
      selectArrList,
      formData,
      updateUrl,
      addUrl,
    } = this.props;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const newValus = {
        ...values,
      };
      if (dateFormatList) {
        dateFormatList.map(title => newValus[title].format('YYYY-MM-DD HH:mm:ss'));
      }
      if (selectArrList) {
        selectArrList.map(title => {
          newValus[title] = values[title].join(',');
          return newValus;
        });
      }
      const url = formData.id ? updateUrl : addUrl;
      const data = Object.assign(formData, newValus, { url });
      if (confirmCom) {
        confirm({
          ...confirmCom,
          ...{
            onOk() {
              this.handleSubmit(data);
            },
          },
        });
      } else {
        this.handleSubmit(data);
      }
    });
  };

  handleCombobox = value => {
    const { comboboxDispatchType, dispatch } = this.props;
    if (!value) {
      this.setState({ comboboxOpetions: [] });
    } else {
      dispatch({
        type: comboboxDispatchType,
        payload: { name: value },
        callback: comboboxOpetions => {
          this.setState({ comboboxOpetions });
        },
      });
    }
  };

  handleSubmit = data => {
    const { dispatch, callBackFetch } = this.props;
    dispatch({
      type: data.id ? 'base/edit' : 'base/add',
      payload: data,
      callback: response => {
        if (response.statusCode === '0') {
          message.success(data.id ? '操作成功' : '新增成功');
        } else {
          message.warning(response.statusMessage);
        }
        if (callBackFetch) {
          callBackFetch();
        }
      },
    });
    this.handleCancel();
  };

  handleCancel = () => {
    const { changeVisible, form } = this.props;
    form.resetFields();
    changeVisible();
  };

  renderFormItem = () => {
    const { comboboxOpetions } = this.state;
    const {
      form: { getFieldDecorator, setFieldsValue },
      formItems,
      modalId,
      formData,
      hideItem,
    } = this.props;
    const id = modalId || 'publicDiv';
    const loopFormItems = data =>
      data.map(item => {
        const {
          title,
          key,
          type,
          rules,
          require,
          editDisabled,
          initialValue,
          filterTreeNode,
        } = item;
        const placeholder = item.placeholder || `请填写${typeof title === 'string' ? title : ''}`;
        const options = {};
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        options.rules = [
          {
            required: require,
            message: typeof title === 'string' ? `${title}为必填项` : '不可为空',
          },
        ];
        if (rules && !(editDisabled && !!formData.id)) {
          options.rules = rules;
          options.validateFirst = true;
        }
        if (initialValue) {
          options.initialValue = initialValue;
        }
        const componentDecorator = getFieldDecorator(key, options);
        switch (type) {
          case 'input': {
            return (
              <FormItem key={key} {...formItemLayout} label={title} hasFeedback>
                {componentDecorator(
                  <Input placeholder={placeholder} disabled={editDisabled && !!formData.id} />
                )}
              </FormItem>
            );
          }
          case 'custom': {
            return (
              <FormItem key={key} {...formItemLayout} label={title}>
                <Row gutter={8}>
                  <Col span={12}>
                    {componentDecorator(<Input placeholder={placeholder} disabled />)}
                  </Col>
                  <Col span={12}>
                    <Button onClick={item.buttonOnClick}>{item.button}</Button>
                  </Col>
                </Row>
              </FormItem>
            );
          }
          case 'radio': {
            return (
              <FormItem {...formItemLayout} label={title} key={key}>
                {' '}
                {componentDecorator(<RadioGroup options={item.options} />)}
              </FormItem>
            );
          }
          case 'datePicker': {
            return (
              <FormItem {...formItemLayout} key={key} label={title}>
                {componentDecorator(<DatePicker showTime format={dateFormat} showToday />)}
              </FormItem>
            );
          }
          case 'numInput': {
            return (
              <FormItem {...formItemLayout} key={key} label={title}>
                {componentDecorator(<InputNumber min={item.min} max={item.max} />)}
              </FormItem>
            );
          }
          case 'textArea': {
            return (
              <FormItem {...formItemLayout} key={key} label={title} hasFeedback>
                {componentDecorator(<TextArea rows={4} />)}
              </FormItem>
            );
          }
          case 'img': {
            const onImageUploadSuccess = (formitem, url) => {
              setFieldsValue({ [key]: url });
            };
            return (
              <FormItem key={key} label={title} {...formItemLayout} hasFeedback>
                {componentDecorator(
                  <PateoUploadImage
                    text={item.text}
                    otherProps={item.otherProps ? item.otherProps : {}}
                    onUploadSuccess={onImageUploadSuccess}
                    formItem={key}
                  />
                )}
              </FormItem>
            );
          }
          case 'file': {
            return (
              <FormItem key={key} label={title} hasFeedback {...formItemLayout}>
                {componentDecorator(
                  <PateoUploadFile
                    onFileUploadSuccess={(formitem, url) => setFieldsValue({ [key]: url })}
                    maxCount={item.maxCount}
                    formItem={key}
                  />
                )}
              </FormItem>
            );
          }
          case 'select': {
            let optionsDiv;
            const { selectOptions, keyValue } = item;
            if (selectOptions !== undefined) {
              const loopOptions = o =>
                o.map(d => {
                  if (keyValue) {
                    return (
                      <Option key={d[keyValue[1]]} value={d[keyValue[1]]}>
                        {d[keyValue[0]]}
                      </Option>
                    );
                  }
                  return (
                    <Option key={d.value} value={d.value}>
                      {d.label}
                    </Option>
                  );
                });
              optionsDiv = loopOptions(selectOptions);
              return (
                <FormItem {...formItemLayout} key={key} label={title} hasFeedback>
                  {componentDecorator(
                    <Select
                      placeholder="请选择"
                      showSearch
                      allowClear
                      getPopupContainer={() => document.getElementById(id)}
                    >
                      {optionsDiv}
                    </Select>
                  )}
                </FormItem>
              );
            }
            const { mode } = item;
            return (
              <FormItem {...formItemLayout} key={key} label={title} hasFeedback>
                {componentDecorator(
                  <Select
                    mode={mode}
                    onChange={this.handleCombobox}
                    placeholder={placeholder}
                    getPopupContainer={() => document.getElementById(id)}
                  >
                    {comboboxOpetions.map(d => (
                      <Option value={d.name} key={d.sid}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            );
          }
          case 'multiSelect': {
            const { keyValue } = item;
            return (
              <FormItem {...formItemLayout} key={key} label={title} hasFeedback>
                {componentDecorator(
                  <Select
                    placeholder="请选择"
                    mode="multiple"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    getPopupContainer={() => document.getElementById(id)}
                  >
                    {keyValue
                      ? item.options.map(d => (
                          <Option key={d[keyValue[1]]} value={d[keyValue[1]]}>
                            {d[keyValue[0]]}
                          </Option>
                        ))
                      : item.options.map(d => (
                          <Option key={d.value} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                  </Select>
                )}
              </FormItem>
            );
          }
          case 'treeSelect': {
            return (
              <FormItem {...formItemLayout} key={key} label={title} hasFeedback>
                {componentDecorator(
                  <TreeSelect
                    showSearch={filterTreeNode !== undefined}
                    filterTreeNode={filterTreeNode}
                    placeholder={item.placeholder || '请选择'}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    getPopupContainer={() => document.getElementById(id)}
                    treeData={item.options}
                    treeDefaultExpandAll
                  />
                )}
              </FormItem>
            );
          }
          default: {
            return (
              <FormItem {...formItemLayout} label={title} key={key} hasFeedback>
                {componentDecorator(<Field label={item.label} value={item.value} />)}
              </FormItem>
            );
          }
        }
      });
    if (this.formItems !== undefined) {
      if (hideItem) {
        return loopFormItems(formItems.filter(d => !hideItem.includes(d.key)));
      }
      return loopFormItems(formItems);
    }
  };

  render() {
    const { formData, visible, title, modalId } = this.props;
    const divId = modalId || 'publicDiv';
    return (
      <div>
        <Modal
          wrapClassName="wrapModel"
          visible={visible}
          title={title || (formData.id || formData.sid ? '编辑' : '新增')}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>
              {' '}
              取 消{' '}
            </Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
              提 交
            </Button>,
          ]}
        >
          <div id={divId}>
            <Form>{this.renderFormItem()}</Form>
          </div>
        </Modal>
      </div>
    );
  }
}
export default ModalForm;
