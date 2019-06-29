import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { stringify } from 'qs';
import { login, queryCurrent, logout } from '../services/login';
import { putToken, getRefreshToken, storageClear } from '../utils/helper';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentUser: {
      authLoading: false,
      realName: '',
      userName: '',
      imgUrl: '',
      buttons: [],
      firstLogin: false,
      authInfo: {
        children: [],
      },
      dic: {},
      projectCodes: [],
      brandCodes: [],
    },
  },

  effects: {
    // 登陆
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.token) {
        reloadAuthorized();
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
      yield put({
        type: 'save',
        payload: { currentUser: response.data },
      });
    },

    *logout(_, { call, put }) {
      const response = yield call(logout);
      storageClear(); // todo 完善
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
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
    // currentSave(state, action) {
    //   const { currentUser } = state;
    //   const current = { ...currentUser, ...action.payload };
    //   return {
    //     ...state,
    //     ...{ currentUser: current },
    //   };
    // }, // todo 测试通过删除
    // changeLoginStatus(state, { payload }) {
    //   setAuthority(payload.currentAuthority);
    //   return {
    //     ...state,
    //     status: payload.status,
    //     type: payload.type,
    //   };
    // },
  },
};
