import * as loadequipmentApi from '../services/load_equipment';
import { listEquipment } from '../services/equipment';

export default {
	namespace: 'loadequipment',
	state: {
		items: [],
		entity: {},

		listEquipment: [],
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getLoadEquipmentById({payload: {id}}, {call, put}) {
			const response = yield call (loadequipmentApi.getLoadEquipmentById, id);
			yield put({type: 'getLoadEquipmentByIdDone', payload: response});
		},
		*createLoadEquipment({payload}, {call, put}) {
			const response = yield call (loadequipmentApi.createLoadEquipment, payload);
			yield put({type: 'createLoadEquipmentDone', payload: response});
		},
		*updateLoadEquipment({payload}, {call, put}) {
			const response = yield call (loadequipmentApi.updateLoadEquipment, payload);
			yield put({type: 'updateLoadEquipmentDone', payload: response});
		},
		*deleteLoadEquipment({payload: {id}}, {call, put}) {
			yield call (loadequipmentApi.deleteLoadEquipment, id);
			yield put({type: 'deleteLoadEquipmentDone', payload: {id}});
		},
		*listLoadEquipment({payload}, {call, put}) {
            const response = yield call (loadequipmentApi.listLoadEquipment, payload);
			yield put({type: 'listLoadEquipmentDone', payload: response});
		},

		*listEquipment({payload}, {call, put}) {
            const response = yield call (listEquipment, payload);
			yield put({type: 'listEquipmentDone', payload: response});
		},
		
	},
	reducers: {		
		getLoadEquipmentByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createLoadEquipmentDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateLoadEquipmentDone(state,  {payload}) {
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
		deleteLoadEquipmentDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listLoadEquipmentDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},

		listEquipmentDone(state, {payload}) {
			return {
				...state,
				listEquipment:payload,
			};
		},
		
	},
}