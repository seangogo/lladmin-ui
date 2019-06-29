import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  const { url, ...paramsOpt } = params;
  return request(`${url}?${stringify(paramsOpt)}`, {
    method: 'GET',
  });
}
export async function add(params) {
  const { url, ...paramsOpt } = params;
  return request(url, {
    method: 'POST',
    body: {
      ...paramsOpt,
      method: 'post',
      action: 'ADD',
    },
  });
}
export async function edit(params) {
  return request(`${params.url}/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
export async function remove(params) {
  return request(`${params.url}/${params.id}`, {
    method: 'DELETE',
  });
}
