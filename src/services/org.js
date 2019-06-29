import request from '../utils/request';

export async function tree() {
  return request('/org/tree', {
    method: 'GET',
  });
}
export async function checkCode(params) {
  return request(`/org/isUse/${params}`, {
    method: 'GET',
  });
}
export async function remove(params) {
  return request(`/org/delete/${params}`, {
    method: 'DELETE',
  });
}
