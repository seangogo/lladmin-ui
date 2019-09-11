import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
@Form.create()
class SearchForm extends PureComponent {
  state = {
    expandForm: false,
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, fetchUrl, payloadUrl, saveFormValues, searchItems } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.rangeTime) {
        fieldsValue.rangeTime = `${moment(fieldsValue.rangeTime[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )},${moment(fieldsValue.rangeTime[1]).format('YYYY-MM-DD HH:mm:ss')}`;
      }
      if (saveFormValues) saveFormValues(fieldsValue);
      const dateRange = searchItems.find(d => d.type === 'dateRange');
      const dateValues = {};
      if (dateRange && fieldsValue[dateRange.key]) {
        dateValues[dateRange.key] = fieldsValue[dateRange.key].map(d =>
          d.format('YYYY-MM-DD HH:mm:ss')
        );
      }
      dispatch({
        type: fetchUrl,
        payload: payloadUrl ? Object.assign(payloadUrl, fieldsValue, dateValues) : fieldsValue,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch, fetchUrl, payloadUrl, handleFormReset } = this.props;
    form.resetFields();
    if (handleFormReset) {
      handleFormReset();
    }
    dispatch({
      type: fetchUrl,
      payload: payloadUrl || {},
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      searchItems,
    } = this.props;
    const loopFormItems = data =>
      data.map((item, i) => {
        if (!this.state.expandForm && i > 1) {
          return null;
        }
        const { title, key, type } = item;
        switch (type) {
          case 'input': {
            return (
              <Col md={8} sm={24} key={key}>
                <FormItem key={key} label={title}>
                  {getFieldDecorator(key)(<Input placeholder="关键字" />)}
                </FormItem>
              </Col>
            );
          }
          case 'rangePicker': {
            return (
              <Col md={8} sm={24} key={key}>
                <FormItem key={key} label={title}>
                  {getFieldDecorator(key)(<RangePicker />)}
                </FormItem>
              </Col>
            );
          }
          case 'select': {
            let optionsDiv;
            const { selectOptions } = item;
            if (selectOptions !== undefined) {
              const loopOptions = options =>
                options.map(ite => {
                  const optionvalue = `${ite.value}`;
                  const optionname = ite.label;
                  return (
                    <Option key={optionvalue} value={optionvalue}>
                      {optionname}
                    </Option>
                  );
                });
              optionsDiv = loopOptions(selectOptions);
            }
            return (
              <Col md={8} sm={24} key={key}>
                <FormItem key={key} label={title}>
                  {getFieldDecorator(key)(
                    <Select placeholder="请选择" showSearch allowClear>
                      {optionsDiv}
                    </Select>
                  )}
                </FormItem>
              </Col>
            );
          }
          case 'dateRange': {
            return (
              <Col md={8} sm={24} key={key}>
                <FormItem key={key} label={title}>
                  {getFieldDecorator(key)(<RangePicker />)}
                </FormItem>
              </Col>
            );
          }
          default: {
          }
        }
      });
    let nodeformItems;
    if (this.props.searchItems !== undefined) {
      nodeformItems = loopFormItems(searchItems);
    }
    return nodeformItems;
  }

  render() {
    const { searchItems, propsStyle } = this.props;
    return (
      <div className={styles.tableListForm} style={propsStyle}>
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            {this.renderForm()}
            <div style={{ overflow: 'hidden' }}>
              <span className={this.state.expandForm ? styles.expendButtons : styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                {searchItems.length > 2 ? (
                  <a
                    style={{ marginLeft: 8 }}
                    onClick={() => this.setState({ expandForm: !this.state.expandForm })}
                  >
                    {!this.state.expandForm ? (
                      <span>
                        展开 <Icon type="down" />
                      </span>
                    ) : (
                      <span>
                        收起 <Icon type="up" />
                      </span>
                    )}
                  </a>
                ) : null}
              </span>
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SearchForm;
