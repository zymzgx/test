import * as equipmentApi from '../services/equipment';

export default {
  namespace: 'equipment',

  state: {
    items: [],
		pageNo: 0,
		pageCount: 0,
		firstPage: 0,
		lastPage: 0,
		total: 0,
		totalPage: 0,
    entity: {},
    
    chartShow: [{}],
		chartMaster: [],
		
		////////////////////
		counterEquipment:[],
    counterChartShow: [{}],
    counterChartMaster: [],

    aiEquipment:[],
    aiEquipmentPoint:[],
    aiChart:[],
    aiChartMaster: [],
  },

  effects: {
    *getEquipmentById({payload: {id}}, {call, put}) {
			const response = yield call (equipmentApi.getEquipmentById, id);
			yield put({type: 'getEquipmentByIdDone', payload: response});
		},
		*createEquipment({payload}, {call, put}) {
			const response = yield call (equipmentApi.createEquipment, payload);
			yield put({type: 'createEquipmentDone', payload: response});
		},
		*updateEquipment({payload}, {call, put}) {
			const response = yield call (equipmentApi.updateEquipment, payload);
			yield put({type: 'updateEquipmentDone', payload: response});
		},
		*deleteEquipment({payload: {id}}, {call, put}) {
			yield call (equipmentApi.deleteEquipment, id);
			yield put({type: 'deleteEquipmentDone', payload: {id}});
		},
		*listEquipment({payload}, {call, put}) {
            const response = yield call (equipmentApi.listEquipment, payload);
			yield put({type: 'listEquipmentDone', payload: response});
		},
		*listEquipmentByPage({payload}, {call, put}) {
			const response = yield call (equipmentApi.listEquipmentByPage, payload);
			yield put({type: 'listEquipmentByPageDone', payload: response});
		},

    //*getCounterChart({payload}, {call, put}) {
    //  const response = yield call (equipmentApi.getCounterChart, payload);
    //  console.log(response);
		//	yield put({type: 'counterChartShow', payload: response});
		//},

		/////////////////
		*getCounterChart({payload}, {call, put}) {
      const response = yield call (equipmentApi.getCounterChart, payload);
      console.log(response);
			yield put({type: 'counterChartShow', payload: response});
		},

    *getAiEquipment({payload}, {call, put}) {
      const response = yield call (equipmentApi.getAiEquipment);
			yield put({type: 'aiEquipmentShow', payload: response});
		},

    *getAiChart({payload}, {call, put}) {
      const response = yield call (equipmentApi.getAiChart, payload);
			yield put({type: 'aiChartShow', payload: response});
		},

    *getCounterEquipment({payload}, {call, put}) {
      const response = yield call (equipmentApi.getCounterEquipment);
			yield put({type: 'counterEquipmentShow', payload: response});
		},

  },

  reducers: {
    getEquipmentByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createEquipmentDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateEquipmentDone(state,  {payload}) {
			return {
				...state,
				items: state.items.map(obj => {
					if (obj.id === payload.id) {
						return {...obj, ...payload}
					} else {
						return obj;
					}
				}),
			};
		},
		deleteEquipmentDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listEquipmentDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listEquipmentByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},

     /*counterChartShow(state, { payload }) {    
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
		},*/

		///////////////////////////
		counterChartShow(state, { payload }) {    
			let master = [];
			let obj = {};
		 for (let i = 0; i < payload.length; i ++){ 
			 //obj = {counterID: payload[i].counterID, yname1: payload[i].yname1};
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
		// console.log(master);
		 return {
			 ...state,
			 counterChartShow:payload,
			 counterChartMaster: master,
		 };
	 },

	 aiChartShow(state, { payload }) {   
		 let master = [];
		 let obj = {};
		for (let i = 0; i < payload.length; i ++){ 
			obj = {aiid: payload[i].aiid, yname1: payload[i].yname1,typename: payload[i].typename};
			if (master.length === 0) {
				master.push(obj);
			} 
			else {
				if (JSON.stringify(master).indexOf(JSON.stringify(obj)) < 0) {
					master.push(obj);
				}
			}
		}

		 return {
			 ...state,
			 aiChart:payload,
			 aiChartMaster: master,
		 };
	 },
	 
	 aiEquipmentShow(state, { payload }) {   
		 let aiEquipment = [];
		 let obj = {};
		for (let i = 0; i < payload.length; i ++){ 
			//obj = {counterID: payload[i].counterID, yname1: payload[i].yname1};
			obj = {id: payload[i].id, code: payload[i].code,cname: payload[i].cname,type: payload[i].type};
			if (aiEquipment.length === 0) {
			 aiEquipment.push(obj);
			} 
			else {
				if (JSON.stringify(aiEquipment).indexOf(JSON.stringify(obj)) < 0) {
				 aiEquipment.push(obj);
				}
			}
		}
		return {
		 ...state,
		 aiEquipment: aiEquipment,
		 aiEquipmentPoint: payload,
		};        
	 },

	 counterEquipmentShow(state, { payload }) {   
		return {
		 ...state,
		 counterEquipment: payload,
		};        
	 },

  },
};
