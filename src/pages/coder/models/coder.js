import { generatorBySQL } from '@/services/coder';

export default {
  namespace: 'coder',
  state: {
    SQLResult: {},
  },

  effects: {
    *generatorBySQL({ payload }, { call, put }) {
      const response = yield call(generatorBySQL, payload);
      yield put({
        type: 'save',
        payload: { SQLResult: response },
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
