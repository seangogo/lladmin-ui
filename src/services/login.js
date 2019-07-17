import request from '@/utils/request';

export async function getCaptcha() {
  return request('/auth/vCode', {
    method: 'GET',
  });
}

export async function login(params) {
  const formData = new FormData();
  formData.append('username', params.username);
  formData.append('password', Buffer.from(params.password).toString('base64'));
  formData.append('code', params.code);
  formData.append('uuid', params.uuid);
  return request('/auth/login', {
    headers: { Authorization: 'Basic bGxhZG1pbjpsbGFkbWlu' },
    method: 'POST',
    body: formData,
  });
}

export function queryCurrent() {
  return request('/user/info');
}
