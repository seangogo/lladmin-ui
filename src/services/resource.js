import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/resource?${stringify(params)}`, {
    method: 'GET',
  });
}
export async function move(params) {
  return request('/resource/move', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
