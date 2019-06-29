import {
  page,
  remove,
  getResources,
  getAllResource,
  bindResource,
  batchesRemove,
  select,
  fetchTree,
} from '@/services/role';

export default {
  namespace: 'role',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    root: {
      children: [],
    },
    loading: false,
    resources: [],
    select: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(page, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    }, // todo delete?
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(fetchTree, payload);
      yield put({
        type: 'save',
        payload: { root: response },
      });
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      yield call(remove, payload);
      const response = yield call(page, payload);
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      if (callback) callback(response);
    },
    *select({ payload }, { call, put }) {
      const response = yield call(select, payload);
      yield put({
        type: 'save',
        payload: { select: response },
      });
    },
    *batchesRemove({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      yield call(batchesRemove, payload);
      const response = yield call(page, payload);
      yield put({
        type: 'save',
        payload: { data: response, loading: false },
      });
    },
    *getResourcesIds({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(getResources, payload);
      yield put({
        type: 'save',
        payload: { loading: false },
      });
      if (callback) callback(response);
    },
    *getAllResource({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(getAllResource, payload);
      yield put({
        type: 'save',
        payload: { loading: false, resources: response.children },
      });
    },
    *bindResource({ payload, callback }, { call, put }) {
      const response = yield call(bindResource, payload);
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
