import {
  query,
  queryCurrent,
  add,
  edit,
  remove,
  searchUser,
  checkedUserName,
  active,
  lock,
  batchesRemove,
  searchOrg,
} from '@/services/user';

export default {
  namespace: 'user',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *fetchCurrent({ _ }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'currentSave',
        payload: { ...response.data },
      });
    },
    *checkedUserName({ payload, callback }, { call }) {
      const response = yield call(checkedUserName, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(remove, payload);
      yield put({
        type: 'save',
        payload: { data: response, loading: false },
      });
      if (callback) callback(response);
    },
    *batchesRemove({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      yield call(batchesRemove, payload);
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: { data: response, loading: false },
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(edit, payload);
      yield put({
        type: 'save',
        payload: { data: response, loading: false },
      });
      if (callback) callback(response);
    },
    *fetchUser({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(searchUser, payload);
      yield put({
        type: 'save',
        payload: { loading: false },
      });
      if (callback) callback(response);
    },
    *searchOrg({ payload, callback }, { call }) {
      const response = yield call(searchOrg, payload);
      if (callback) callback(response);
    },
    *active({ payload, callback }, { call }) {
      const response = yield call(active, payload);
      if (callback) callback(response);
    },
    *lock({ payload, callback }, { call }) {
      const response = yield call(lock, payload);
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
    currentSave(state, action) {
      const { currentUser } = state;
      const current = { ...currentUser, ...action.payload };
      return {
        ...state,
        ...{ currentUser: current },
      };
    },
  },
};
