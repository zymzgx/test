import * as loadApi from '../services/load';
import { getLoadPlanById } from '../services/loadplan';

export default {
	namespace: 'load',
	state: {
		items: [],
		entity: {},

		loadPlan: {},
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getLoadById({payload: {id}}, {call, put}) {
			const response = yield call (loadApi.getLoadById, id);
			yield put({type: 'getLoadByIdDone', payload: response});
		},
		*createLoad({payload}, {call, put}) {
			const response = yield call (loadApi.createLoad, payload);
			yield put({type: 'createLoadDone', payload: response});
		},
		*updateLoad({payload}, {call, put}) {
			const response = yield call (loadApi.updateLoad, payload);
			yield put({type: 'updateLoadDone', payload: response});
		},
		*deleteLoad({payload: {id}}, {call, put}) {
			yield call (loadApi.deleteLoad, id);
			yield put({type: 'deleteLoadDone', payload: {id}});
		},
		*listLoad({payload}, {call, put}) {
            const response = yield call (loadApi.listLoad, payload);
			yield put({type: 'listLoadDone', payload: response});
		},

		*getLoadPlanById({payload: {id}}, {call, put}) {
			const response = yield call (getLoadPlanById, id);
			yield put({type: 'getLoadPlanByIdDone', payload: response});
		},
		
	},
	reducers: {		
		getLoadByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createLoadDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateLoadDone(state,  {payload}) {
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
		deleteLoadDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listLoadDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},

		getLoadPlanByIdDone(state, {payload}) {
			return {
				...state,
				loadPlan: payload || {},
			};
		},
		
	},
}