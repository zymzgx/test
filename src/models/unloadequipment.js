import * as unloadequipmentApi from '../services/unload_equipment';
import { listEquipment } from '../services/equipment';

export default {
	namespace: 'unloadequipment',
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
		*getUnloadEquipmentById({payload: {id}}, {call, put}) {
			const response = yield call (unloadequipmentApi.getUnloadEquipmentById, id);
			yield put({type: 'getUnloadEquipmentByIdDone', payload: response});
		},
		*createUnloadEquipment({payload}, {call, put}) {
			const response = yield call (unloadequipmentApi.createUnloadEquipment, payload);
			yield put({type: 'createUnloadEquipmentDone', payload: response});
		},
		*updateUnloadEquipment({payload}, {call, put}) {
			const response = yield call (unloadequipmentApi.updateUnloadEquipment, payload);
			yield put({type: 'updateUnloadEquipmentDone', payload: response});
		},
		*deleteUnloadEquipment({payload: {id}}, {call, put}) {
			yield call (unloadequipmentApi.deleteUnloadEquipment, id);
			yield put({type: 'deleteUnloadEquipmentDone', payload: {id}});
		},
		*listUnloadEquipment({payload}, {call, put}) {
            const response = yield call (unloadequipmentApi.listUnloadEquipment, payload);
			yield put({type: 'listUnloadEquipmentDone', payload: response});
		},

		*listEquipment({payload}, {call, put}) {
            const response = yield call (listEquipment, payload);
			yield put({type: 'listEquipmentDone', payload: response});
		},
		
	},
	reducers: {		
		getUnloadEquipmentByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createUnloadEquipmentDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateUnloadEquipmentDone(state,  {payload}) {
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
		deleteUnloadEquipmentDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listUnloadEquipmentDone(state, {payload}) {
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