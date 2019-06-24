import request from '../utils/request';

export async function labels() {
  return request('/brand/labels', {
    method: 'GET',
  });
}

export async function checkedCode(params) {
  return request(`/brand/isUse/${params}`, {
    method: 'GET',
  });
}

export async function tree() {
  return request('/brand/tree', {
    method: 'GET',
  });
}
