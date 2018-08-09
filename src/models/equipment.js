import { queryEquipment, deleteEquipment, updateEquipment, addEquipment, getCounterChart } from '../services/equipment';

export default {
  namespace: 'equipment',

  state: {
    dataSource: [],
    chartShow: [{}],
    chartMaster: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryEquipment,payload);

      yield put({
        type: 'show',
        payload: response,
      });
    },   
    
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteEquipment, payload);

      if(response){
        yield put({
            type:'deleteshow',
            payload:payload.id,
        })
      }
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateEquipment, payload);

      yield put({
        type: 'updateshow',
        payload: payload,
      });
      if (callback) callback();
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addEquipment, payload);

      yield put({
        type: 'addshow',
        payload: response,
      });
      if (callback) callback();
    },

    *getCounterChart({payload}, {call, put}) {
      const response = yield call (getCounterChart, payload);
      console.log(response);
			yield put({type: 'counterChartShow', payload: response});
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

     counterChartShow(state, { payload }) {    
       let master = [];
       let obj = {};
      for (let i = 0; i < payload.length; i ++){ 
        obj = {counterID: payload[i].counterID, yname1: payload[i].yname1};
        if (master.length === 0) {
          master.push(obj);
        } 
        else {
          if (JSON.stringify(master).indexOf(JSON.stringify(obj)) < 0) {
            master.push(obj);
          }
        }
      }
      console.log(master);
      return {
        ...state,
        chartShow:payload,
        chartMaster: master,
      };
    },

  },
};
