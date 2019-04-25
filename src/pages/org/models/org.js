import { tree, checkCode, remove } from '@/services/org';
import { generateList } from '@/utils/utils';

export default {
  namespace: 'org',
  state: {
    dataList: [],
    treeData: [],
  },
  effects: {
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(tree, payload);
      // const dataList = [];
      // generateList([response], dataList);
      yield put({
        type: 'save',
        payload: { treeData: [response] },
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
