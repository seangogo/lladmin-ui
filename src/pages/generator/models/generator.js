import { fetchDataBase, tablePage, generatorCode } from '@/services/generator';

export default {
  namespace: 'generator',
  state: {
    treeData: {
      children: [],
    },
    page: {
      list: [],
      pagination: {},
    }
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchDataBase, payload);
      yield put({
        type: 'save',
        payload: { treeData: response },
      });
    },
    *fetchTable({ payload }, { call, put }) {
      const response = yield call(tablePage, payload);
      yield put({
        type: 'save',
        payload: { page: response },
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
