import request from '@/utils/request';

export async function login(params) {
  const formData = new FormData();
  formData.append('username', params.username);
  formData.append('password', Buffer.from(params.password).toString('base64'));
  return request('/authentication/form', {
    headers: { Authorization: 'Basic dGVzdDp0ZXN0' },
    method: 'POST',
    body: formData,
  });
}

export function queryCurrent() {
  return request('/user/info');
}

export async function logout() {
  return request('/user/logout', {
    method: 'GET',
  });
}
