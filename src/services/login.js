import { stringify } from 'qs';
import request from '@/utils/request';

export async function login(params) {
  return request('/login', {
    method: 'POST',
    body: params,
  });
}

export function queryCurrent() {
  return request('/user/info');
}

export async function logout() {
  return request('/user/logout', {
    method: 'GET',
  });
}
