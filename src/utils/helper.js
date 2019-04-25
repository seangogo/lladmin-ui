import React from 'react';
import { Select, Radio } from 'antd';

const { Option } = Select;

export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  }
  return null;
}
export function delCookie({ name, domain, path }) {
  if (getCookie(name)) {
    document.cookie = `${name}=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=${path}; domain=${domain}`;
  }
}
export function setLocalStorage(key, vaule) {
  return localStorage.setItem(key, JSON.stringify(vaule));
}
export function getLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  return value;
}
export function storageClear() {
  sessionStorage.clear();
  localStorage.clear();
}
export function remember(b) {
  localStorage.setItem('REMEMBER', b);
}
export function isRemember() {
  return localStorage.getItem('REMEMBER');
}

export function isLogin() {
  return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
}
export function putToken({ access_token, refresh_token, expires_in }) {
  if (localStorage.getItem('REMEMBER')) {
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires', Date.parse(new Date()) / 1000 + expires_in);
  } else {
    sessionStorage.setItem('token', access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
    sessionStorage.setItem('expires', Date.parse(new Date()) / 1000 + expires_in);
  }
}
export function getToken() {
  return localStorage.getItem('REMEMBER')
    ? localStorage.getItem('token')
    : sessionStorage.getItem('token');
}
export function getExpires() {
  const ex = localStorage.getItem('REMEMBER')
    ? localStorage.getItem('expires')
    : sessionStorage.getItem('expires');
  const date = Date.parse(new Date()) / 1000;
  return ex - date;
}
export function getRefreshToken() {
  return localStorage.getItem('REMEMBER')
    ? localStorage.getItem('refresh_token')
    : sessionStorage.getItem('refresh_token');
}
export function getDicByCode(data, code) {
  return data[code];
}
export function getDicByKey(data, code, key) {
  return data[code]
    ? data[code].find(d => d.key === key)
      ? data[code].find(d => d.key === key).value
      : key
    : key;
}

export function getDicByCodeSort(data, code) {
  if (data[code]) {
    if (data[code].length !== 0) {
      data[code].sort((a, b) => a.sort - b.sort);
      return data[code].map(d => <Option key={d.key}>{d.value}</Option>);
    }
    return [];
  }
  return [];
}

export function getDicByCodeSortRadio(data, code) {
  if (data[code]) {
    if (data[code].length !== 0) {
      data[code].sort((a, b) => a.sort - b.sort);
      return data[code].map(d => (
        <Radio key={d.key} value={d.key}>
          {d.value}
        </Radio>
      ));
    }
    return [];
  }
  return [];
}
