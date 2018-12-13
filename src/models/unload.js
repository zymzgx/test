import * as unloadApi from '../services/unload';
import { getUnloadPlanById } from '../services/unloadplan';

export default {
	namespace: 'unload',
	state: {
		items: [],
		entity: {},

		unloadPlan: {},
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getUnloadById({payload: {id}}, {call, put}) {
			const response = yield call (unloadApi.getUnloadById, id);
			yield put({type: 'getUnloadByIdDone', payload: response});
		},
		*createUnload({payload}, {call, put}) {
			const response = yield call (unloadApi.createUnload, payload);
			yield put({type: 'createUnloadDone', payload: response});
		},
		*updateUnload({payload}, {call, put}) {
			const response = yield call (unloadApi.updateUnload, payload);
			yield put({type: 'updateUnloadDone', payload: response});
		},
		*deleteUnload({payload: {id}}, {call, put}) {
			yield call (unloadApi.deleteUnload, id);
			yield put({type: 'deleteUnloadDone', payload: {id}});
		},
		*listUnload({payload}, {call, put}) {
            const response = yield call (unloadApi.listUnload, payload);
			yield put({type: 'listUnloadDone', payload: response});
		},

		*getUnloadPlanById({payload: {id}}, {call, put}) {
			const response = yield call (getUnloadPlanById, id);
			yield put({type: 'getUnloadPlanByIdDone', payload: response});
		},
		
	},
	reducers: {		
		getUnloadByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createUnloadDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateUnloadDone(state,  {payload}) {
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
		deleteUnloadDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listUnloadDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},

		getUnloadPlanByIdDone(state, {payload}) {
			return {
				...state,
				unloadPlan: payload || {},
			};
		},
		
	},
}