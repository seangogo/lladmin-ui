import request from '../utils/request';

export async function tree() {
  return request('/dept/tree', {
    method: 'GET',
  });
}
export async function checkCode(params) {
  return request(`/dept/isUse/${params}`, {
    method: 'GET',
  });
}
export async function remove(params) {
  return request(`/dept/delete/${params}`, {
    method: 'DELETE',
  });
}
