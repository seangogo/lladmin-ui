import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Row, Col } from 'antd';
import Login from '@/components/Login';
import { remember, isLogin, storageClear } from '../../utils/helper';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  /* 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state */
  componentWillMount() {
    if (isLogin()) {
      this.props.dispatch(routerRedux.push('/home'));
    } else {
      this.onGetCaptcha();
      storageClear();
    }
  }

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      const { dispatch } = this.props;
      dispatch({ type: 'login/getCaptcha' })
        .then(resolve)
        .catch(reject);
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
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
          type,
        },
      });
    }
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
    const { login, submitting } = this.props;
    const { captcha } = login;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')}
            <UserName name="username" placeholder="请输入账户名" />
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <Row gutter={16}>
            <Col span={14}>
              <UserName name="code" placeholder="请输入验证码" />
            </Col>
            <Col span={10}>
              {captcha.img && (
                <img src={`data:image/gif;base64,${captcha.img}`} onClick={this.onGetCaptcha} />
              )}
            </Col>
          </Row>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/User/Register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
