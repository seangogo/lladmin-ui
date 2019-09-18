import { query, remove, add, edit } from '../services/base';

export default {
  namespace: 'base',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    listData: [],
    editData: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
      if (callback) callback(response);
    },
    *list({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
      });
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: { listData: response },
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
      });
      yield call(add, payload);
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
      });
      const response = yield call(edit, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
