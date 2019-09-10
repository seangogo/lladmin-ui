import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchDataBase() {
  return request('/generator/tree', {
    method: 'GET',
  });
}

export async function tablePage(params) {
  return request(`/generator/table/page?${stringify(params)}`, {
    method: 'GET',
  });
}
