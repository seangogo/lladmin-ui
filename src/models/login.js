import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { stringify } from 'qs';
import { getCaptcha, login, queryCurrent, logout } from '../services/login';
import { putToken, getRefreshToken, storageClear } from '../utils/helper';
import { getPageQuery } from '@/utils/utils';
import { setToken, removeToken } from '@/utils/auth';

export default {
  namespace: 'login',
  state: {
    captcha: {},
    status: undefined,
    user: {
      userName: '',
      avatar: '',
      menuInfo: {
        children: [],
      },
      buttons: [],
    },
  },

  effects: {
    // 获取验证码
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(getCaptcha, payload);
      yield put({
        type: 'save',
        payload: { captcha: response },
      });
    },
    // 登陆
    *login({ payload }, { call, put }) {
      const { token } = yield call(login, payload);
      // Login successfully
      if (token) {
        setToken(token, false); // todo 记住密码后期完善
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/home'));
      }
    },
    // 获取登陆用户信息
    *fetchCurrent({ _ }, { call, put }) {
      const response = yield call(queryCurrent);
      console.log(response);
      yield put({
        type: 'save',
        payload: { user: response },
      });
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      removeToken();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/guest/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      const { token, msg } = payload;
      const msgArr = {
        UsernameNotFoundException: '账户不存在',
        CredentialsExpiredException: '账户已过期，请重新找回密码',
        AccountExpiredException: '账户未激活,请先激活',
        LockedException: '账户已锁定,请联系管理员',
      };
      if (token) {
        putToken(token);
      }
      if (msg) {
        message.warning(msgArr[msg] || msg);
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
