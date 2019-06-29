import fetch from 'dva/fetch';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { isLogin, getToken, getExpires } from './helper';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
const config = {
  'localhost:8000': 'http://localhost:8080/auth',
  'fota-ui.paas.pateo.com.cn': 'http://bxuigw.paas.pateo.com.cn/fota-auth',
  'fota-ui.perf.pateo.com.cn': 'http://bxuigw-bdperf.pateo.com.cn/fota-auth/auth',
  'fota-ui.uat.pateo.com.cn': 'https://optgw-uat.pateo.com.cn/fota-auth/auth',
  'fota-ui-pro.pateo.com.cn': 'https://optgw-pro.pateo.com.cn/fota-auth/auth',
};

const resource = {
  application: {
    'localhost:8000': 'http://fota-application.paas.pateo.com.cn/fota-application',
    'fota-ui.paas.pateo.com.cn': 'http://bxuigw.paas.pateo.com.cn/fota-application',
    'fota-ui.perf.pateo.com.cn': 'http://bxuigw-bdperf.pateo.com.cn/fota-application',
    'fota-ui.uat.pateo.com.cn': 'https://optgw-uat.pateo.com.cn/optetl',
    'fota-ui.pro.pateo.com.cn': 'https://optgw-pro.pateo.com.cn/optetl',
  },
  nemp: {
    'localhost:8000': 'http://nemp-application.paas.pateo.com.cn/nemp-application',
    'fota-ui.paas.pateo.com.cn': 'http://bxuigw.paas.pateo.com.cn/nemp-application',
    'fota-ui.perf.pateo.com.cn': 'http://bxuigw-bdperf.pateo.com.cn/nemp-application',
    'fota-ui.uat.pateo.com.cn': 'https://optgw-uat.pateo.com.cn/optetl',
    'fota-ui.pro.pateo.com.cn': 'https://optgw-pro.pateo.com.cn/optetl',
  },
  webSocket: {
    '127.0.0.1:8000': 'http://127.0.0.1:8082/etl',
    'localhost:8000': 'optetl.paas.pateo.com.cn',
    'optui.paas.pateo.com.cn': 'optetl.paas.pateo.com.cn',
    'optui.perf.pateo.com.cn': 'optetl.perf.pateo.com.cn',
    'optui.uat.pateo.com.cn': 'optetl.uat.pateo.com.cn',
    'tas.wind-link.com.cn:8382': 'optetl-pro.pateo.com.cn',
    'optui-pro.pateo.com.cn': 'optetl-pro.pateo.com.cn',
  },
};
const urls = {
  url: config[window.location.host],
  application: resource.application[window.location.host],
  nemp: resource.nemp[window.location.host],
  webSocket: resource.webSocket[window.location.host],
};

function checkStatus(response) {
  // 小于10分钟或者
  if (response.status === 401) {
    // const { dispatch } = store;
    // if (isLogin() && getExpires() < 1800 && getExpires() > 0) {
    //   dispatch({ type: 'login/refresh' });
    // }
    localStorage.clear();
    sessionStorage.clear();
    // dispatch({ type: 'login/changeLogin' });
    // dispatch(routerRedux.push('/login'));
    response.json().then(() => {
      message.warning('登陆已失效，请重新登陆');
    });
    return;
  }
  if (response.status >= 200 && response.status <= 300) {
    return response;
  }
  const error = new Error(codeMessage[response.status] || response.statusText);
  error.name = response.status;
  error.response = response;
  throw error;
}

export default function request(url, options) {
  const newOptions = { ...options };
  if (isLogin() && url.indexOf('http') !== 0) {
    newOptions.headers = { Authorization: `bearer ${getToken()}` };
  }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }
  const ip = url.indexOf('r:') === 0 ? urls[url.substring(2, url.indexOf('/'))] : urls.url;
  return fetch(
    `${ip}${url.indexOf('r:') === 0 ? url.substring(url.indexOf('/')) : url}`,
    newOptions
  )
    .then(checkStatus)
    .then(response => {
      if (response.status !== 300) {
        if (newOptions.method === 'DELETE') {
          message.success('删除成功');
        }
      }
      const json = response.json();
      if (response.status === 300) {
        json.then(warningResponse => {
          message.warning(warningResponse.message);
        });
      }
      return json;
    });
}
