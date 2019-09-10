import { routerRedux } from 'dva/router';
import { getCaptcha, login, queryCurrent } from '../services/login';
import { getPageQuery } from '@/utils/utils';
import { setToken } from '@/utils/auth';

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
      console.log('login/login');
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
