import React from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Icon, Modal, message, Switch } from 'antd';
import { Buffer } from 'buffer';

@connect(state => ({
  account: state.account,
}))
export default class active extends React.Component {
  state = {
    password: '',
    isPassword: false,
  };
  onChangeUserName = e => {
    this.setState({ password: e.target.value });
  };
  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ password: '' });
  };
  handleOk = () => {
    const {
      account: {
        rdata: { regular, descr },
      },
      dispatch,
      id,
    } = this.props;
    const { password } = this.state;
    const regex = new RegExp(regular);
    if (!password) {
      message.warning('密码不可为空');
      return;
    } else if (!regex.test(password)) {
      message.warning(descr);
      return;
    }
    dispatch({
      type: 'user/active',
      payload: { id, password: Buffer.from(this.state.password).toString('base64') },
      callback: response => {
        if (response.statusCode === '0') {
          message.success('激活成功');
          dispatch({
            type: 'user/fetch',
            payload: id,
          });
        }
      },
    });
    this.handleCancel();
  };
  handleCancel = () => {
    this.setState({
      password: '',
    });
    this.props.changeVisible();
  };
  render() {
    const { visible } = this.props;
    const { password } = this.state;
    const suffix = password ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <span>
        <Modal
          title="激活"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
        >
          <Row gutter={16}>
            <Col className="gutter-row" span={10}>
              <Input
                placeholder="请输入密码"
                type={this.state.isPassword ? 'password' : 'text'}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                suffix={suffix}
                value={password}
                onChange={this.onChangeUserName}
                onPressEnter={this.handleOk}
                ref={node => (this.userNameInput = node)}
              />
            </Col>
            <Col className="gutter-row" span={6}>
              <Switch
                checkedChildren={<Icon type="eye-o" />}
                unCheckedChildren={<Icon type="eye" />}
                defaultChecked
                onClick={() => this.setState({ isPassword: !this.state.isPassword })}
              />
            </Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
