import { stringify } from 'qs';
import request from '../utils/request';

export function queryCurrent() {
  return request('/user/info');
}
export async function query(params) {
  return request(`/user/list?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function checkedUserName(params) {
  return request(`/user/isUse/${params}`, {
    method: 'GET',
  });
}
export async function add(params) {
  return request('/user/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function edit(params) {
  return request(`/user/edit/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function remove(params) {
  return request(`/user/delete/${params}`, {
    method: 'DELETE',
  });
}
export async function batchesRemove(params) {
  return request(`/user/batchesRemove/${params}`, {
    method: 'DELETE',
  });
}
export async function searchUser(params) {
  return request(`/user/${params.id}`, {
    method: 'GET',
  });
}
export async function searchOrg(params) {
  return request(`/org/like/${params.name}`, {
    method: 'GET',
  });
}
export async function active(params) {
  return request(`/user/active/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function lock(params) {
  return request(`/user/lock/${params}`, {
    method: 'PUT',
    body: {
      method: 'put',
    },
  });
}
