import { queryNationality, deleteNationality, updateNationality, addNationality } from '../services/nationality';

export default {
  namespace: 'nationality',

  state: {
    dataSource: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryNationality,payload);

      yield put({
        type: 'show',
        payload: response,
      });
    },   
    
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteNationality, payload);

      if(response){
        yield put({
            type:'deleteshow',
            payload:payload.id,
        })
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateNationality, payload);

      yield put({
        type: 'updateshow',
        payload: payload,
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addNationality, payload);

      yield put({
        type: 'addshow',
        payload: response,
      });
      if (callback) callback();
    },

  },

  reducers: {
    show(state, { payload }) {    
      return {
        ...state,
        dataSource:payload,
      };
    },

    deleteshow(state, { payload }) {    
      return {
        ...state,
        dataSource:state.dataSource.filter(item=>item.id!==payload),       
      };
    },

    updateshow(state, { payload }) {   
      const newData=[...state.dataSource];
      const index = newData.findIndex(item => item.id === payload.id);
      if (index > -1) {
        const item = newData[index];       
        newData.splice(index, 1, {
          ...item,
          ...payload,
        });
      };
      return {
        ...state,
        dataSource:newData,
      };
    },

    addshow(state, { payload }) {    
       return {
        ...state,
        dataSource:state.dataSource.concat([payload]),
       };
     },

  },
};
