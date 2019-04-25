import { stringify } from 'qs';
import request from '../utils/request';

export async function generatorBySQL(params) {
  return request(`/generator/genCode/?${stringify(params)}`, {
    method: 'GET',
  });
}
