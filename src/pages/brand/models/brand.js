import { labels, checkedCode, tree } from '../../../services/brand';

export default {
  namespace: 'brand',
  state: {
    select: [],
    loading: true,
    treeData: [],
  },

  effects: {
    *labels({ callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(labels);
      yield put({
        type: 'save',
        payload: { select: response, loading: false },
      });
      if (callback) callback(response);
    },
    *checkedCode({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(checkedCode, payload);
      yield put({
        type: 'save',
        payload: { loading: false },
      });
      if (callback) callback(response);
    },
    *tree({ _ }, { call, put }) {
      yield put({
        type: 'save',
        payload: { loading: true },
      });
      const response = yield call(tree);
      yield put({
        type: 'save',
        payload: { treeData: response, loading: false },
      });
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
