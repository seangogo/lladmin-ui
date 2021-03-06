import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Link from 'umi/link';
import { Form, Checkbox, Alert, Icon, Row, Col, Input, Button } from 'antd';
import { getToken, removeToken } from '@/utils/auth';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  componentWillMount() {
    if (getToken()) {
      this.props.dispatch(routerRedux.replace('/home'));
    } else {
      this.onGetCaptcha();
      removeToken();
    }
  }

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const { dispatch } = this.props;
      dispatch({ type: 'login/getCaptcha' })
        .then(resolve)
        .catch(reject);
    });

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const {
          dispatch,
          login: { captcha },
        } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...{ uuid: captcha.uuid },
            ...values,
          },
          callback: () => this.onGetCaptcha(),
        });
      }
    });
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login } = this.props;
    const { captcha } = login;
    const { form } = this.props;
    const { passwordIcon } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3 className={styles.title} style={{ fontSize: 14 }}>
          ll-admin 后台管理员平台
        </h3>
        <Form className={styles.form}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入账户名！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="请输入帐户名"
                maxLength={30}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="key" className={styles.prefixIcon} />}
                suffix={
                  passwordIcon ? (
                    <EyeOIcon className={styles.prefixIcon} onClick={this.handleLook} />
                  ) : (
                    <Icon type="eye" className={styles.prefixIcon} onClick={this.handleLook} />
                  )
                }
                type={passwordIcon ? 'text' : 'password'}
                theme="twoTone"
                maxLength={30}
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="key" className={styles.prefixIcon} />}
                theme="twoTone"
                maxLength={30}
                className={styles.code}
                placeholder="请输入验证码"
              />
            )}
            {captcha.img && (
              <img
                className={styles.captcha}
                src={`data:image/gif;base64,${captcha.img}`}
                alt=""
                onClick={this.onGetCaptcha}
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            <div>
              {getFieldDecorator('remember', {
                valuePropName: localStorage.getItem('REMEMBER') ? 'checked' : 'none',
                initialValue: true,
              })(
                <Checkbox onChange={this.handleRemember} style={{ font: '#8190B0' }}>
                  <span className={styles.automatic}>记住我</span>
                </Checkbox>
              )}
            </div>
            <Button
              size="large"
              loading={login.submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default LoginPage;
