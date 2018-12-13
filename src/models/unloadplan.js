import * as unloadplanApi from '../services/unloadplan';
import { listShip } from '../services/ship';
import { listCargo } from '../services/cargo';

export default {
	namespace: 'unloadplan',
	state: {
		items: [],
		pageNo: 0,
		pageCount: 0,
		firstPage: 0,
		lastPage: 0,
		total: 0,
		totalPage: 0,
		entity: {},

		listShip: [],
		listCargo: [],
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getUnloadPlanById({payload: {id}}, {call, put}) {
			const response = yield call (unloadplanApi.getUnloadPlanById, id);
			yield put({type: 'getUnloadPlanByIdDone', payload: response});
		},
		*createUnloadPlan({payload}, {call, put}) {
			const response = yield call (unloadplanApi.createUnloadPlan, payload);
			yield put({type: 'createUnloadPlanDone', payload: response});
		},
		*updateUnloadPlan({payload}, {call, put}) {
			const response = yield call (unloadplanApi.updateUnloadPlan, payload);
			yield put({type: 'updateUnloadPlanDone', payload: response});
		},
		*deleteUnloadPlan({payload: {id}}, {call, put}) {
			yield call (unloadplanApi.deleteUnloadPlan, id);
			yield put({type: 'deleteUnloadPlanDone', payload: {id}});
		},
		*listUnloadPlan({payload}, {call, put}) {
            const response = yield call (unloadplanApi.listUnloadPlan, payload);
			yield put({type: 'listUnloadPlanDone', payload: response});
		},
		*listUnloadPlanByPage({payload}, {call, put}) {
			const response = yield call (unloadplanApi.listUnloadPlanByPage, payload);
			yield put({type: 'listUnloadPlanByPageDone', payload: response});
		},

		*listShip({payload}, {call, put}) {
            const response = yield call (listShip, payload);
			yield put({type: 'listShipDone', payload: response});
		},
		*listCargo({payload}, {call, put}) {
            const response = yield call (listCargo, payload);
			yield put({type: 'listCargoDone', payload: response});
		},
		
	},
	reducers: {		
		getUnloadPlanByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createUnloadPlanDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateUnloadPlanDone(state,  {payload}) {
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
		deleteUnloadPlanDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listUnloadPlanDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listUnloadPlanByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},

		listShipDone(state, {payload}) {
			return {
				...state,
				listShip:payload,
			};
		},
		listCargoDone(state, {payload}) {
			return {
				...state,
				listCargo:payload,
			};
		},
		
	},
}