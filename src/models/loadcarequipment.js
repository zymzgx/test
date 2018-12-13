import * as loadcarequipmentApi from '../services/loadcar_equipment';
import { listEquipment } from '../services/equipment';

export default {
	namespace: 'loadcarequipment',
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
		*getLoadCarEquipmentById({payload: {id}}, {call, put}) {
			const response = yield call (loadcarequipmentApi.getLoadCarEquipmentById, id);
			yield put({type: 'getLoadCarEquipmentByIdDone', payload: response});
		},
		*createLoadCarEquipment({payload}, {call, put}) {
			const response = yield call (loadcarequipmentApi.createLoadCarEquipment, payload);
			yield put({type: 'createLoadCarEquipmentDone', payload: response});
		},
		*updateLoadCarEquipment({payload}, {call, put}) {
			const response = yield call (loadcarequipmentApi.updateLoadCarEquipment, payload);
			yield put({type: 'updateLoadCarEquipmentDone', payload: response});
		},
		*deleteLoadCarEquipment({payload: {id}}, {call, put}) {
			yield call (loadcarequipmentApi.deleteLoadCarEquipment, id);
			yield put({type: 'deleteLoadCarEquipmentDone', payload: {id}});
		},
		*listLoadCarEquipment({payload}, {call, put}) {
            const response = yield call (loadcarequipmentApi.listLoadCarEquipment, payload);
			yield put({type: 'listLoadCarEquipmentDone', payload: response});
		},

		*listEquipment({payload}, {call, put}) {
            const response = yield call (listEquipment, payload);
			yield put({type: 'listEquipmentDone', payload: response});
		},
		
	},
	reducers: {		
		getLoadCarEquipmentByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createLoadCarEquipmentDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateLoadCarEquipmentDone(state,  {payload}) {
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
		deleteLoadCarEquipmentDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listLoadCarEquipmentDone(state, {payload}) {
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