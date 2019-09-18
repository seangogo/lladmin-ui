import fetch from 'dva/fetch';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getToken, removeToken } from '@/utils/auth';

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
  'localhost:8000': 'http://localhost:8080',
  'fota-ui.paas.pateo.com.cn': 'http://bxuigw.paas.pateo.com.cn/fota-auth',
  'fota-ui.perf.pateo.com.cn': 'http://bxuigw-bdperf.pateo.com.cn/fota-auth/auth',
  'fota-ui.uat.pateo.com.cn': 'https://optgw-uat.pateo.com.cn/fota-auth/auth',
  'fota-ui-pro.pateo.com.cn': 'https://optgw-pro.pateo.com.cn/fota-auth/auth',
};
const urls = {
  url: config[window.location.host],
};

function checkStatus(response) {
  console.log('checkStatus')
  console.log(response)
  if (response.status === 401) {
    response.json().then(() => {
      message.warning('登陆已失效，请重新登陆');
    });
    removeToken();
    routerRedux.push('/guest/login');
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
  if (getToken() && url.indexOf('http') !== 0) {
    newOptions.headers = { Authorization: `Bearer ${getToken()}` };
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
    newOptions,
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
        json.then(e => {
          message.warning(e.message);
        });
      }

      return json;
    })
    .then(json => {
      console.log(json)
      console.log('json')
      const { statusCode, statusMessage, data } = json;
      if (statusCode && statusMessage) {
        if (statusCode === '0') {
          return data;
        } else{
          message.warning(json.statusMessage);
          return false;
        }
      } else {
        return json;
      }
    }).catch(e => {
      const { name: status } = e;
      if (status === 400) {
        routerRedux.push('/403');
        return;
      }
      if (status === 401) {
        routerRedux.push('/guest/login');
        return;
      }
      if (status === 403) {
        routerRedux.push('/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        routerRedux.push('/500');
        return;
      }
      if (status >= 404 && status < 422) {
        routerRedux.push('/404');
        return;
      }
      if (status === 'SyntaxError') {
        message.error(`SyntaxError:${e.message}`);
        setTimeout(() => {
          routerRedux.push('/guest/login');
        }, 1500);
      }
    });
}
