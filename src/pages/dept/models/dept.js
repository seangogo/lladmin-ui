import { tree, checkCode, remove } from '@/services/dept';
import { generateList } from '@/utils/utils';

export default {
  namespace: 'dept',
  state: {
    dataList: [],
    treeData: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(tree, payload);
      yield put({
        type: 'save',
        payload: { treeData: [response.data] },
      });
    },
    *checkCode({ payload, callback }, { call, _ }) {
      const response = yield call(checkCode, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      yield put({
        type: 'fetchTree',
      });
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
