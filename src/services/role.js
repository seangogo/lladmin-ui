import { stringify } from 'qs';
import request from '../utils/request';

export async function page(params) {
  return request(`/role/list?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function fetchTree() {
  return request(`/role`, {
    method: 'GET',
  });
}

export async function remove(params) {
  return request(`/role/delete/${params}`, {
    method: 'DELETE',
  });
}

export async function getResources(params) {
  return request(`/role/resourceIds/${params}`, {
    method: 'GET',
  });
}

export async function getAllResource() {
  return request('/resource', {
    method: 'GET',
  });
}

export async function bindResource(params) {
  return request('/role/bindResource', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function select() {
  return request('/role/select', {
    method: 'GET',
  });
}
