import { list, move } from '@/services/resource';

export default {
  namespace: 'resource',

  state: {
    root: {
      id: '',
      children: [],
    },
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(list, payload);
      yield put({
        type: 'save',
        payload: { root: response, loading: false },
      });
    },
    *move({ payload, callback }, { call, put }) {
      yield call(move, payload);
      const response = yield call(list);
      yield put({
        type: 'save',
        payload: { loading: false },
      });
      yield put({
        type: 'save',
        payload: { root: response },
      });
      if (callback) callback();
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
