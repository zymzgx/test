import * as loadplanApi from '../services/loadplan';
import { listShip } from '../services/ship';
import { listCargo } from '../services/cargo';

export default {
	namespace: 'loadplan',
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
		*getLoadPlanById({payload: {id}}, {call, put}) {
			const response = yield call (loadplanApi.getLoadPlanById, id);
			yield put({type: 'getLoadPlanByIdDone', payload: response});
		},
		*createLoadPlan({payload}, {call, put}) {
			const response = yield call (loadplanApi.createLoadPlan, payload);
			yield put({type: 'createLoadPlanDone', payload: response});
		},
		*updateLoadPlan({payload}, {call, put}) {
			const response = yield call (loadplanApi.updateLoadPlan, payload);
			yield put({type: 'updateLoadPlanDone', payload: response});
		},
		*deleteLoadPlan({payload: {id}}, {call, put}) {
			yield call (loadplanApi.deleteLoadPlan, id);
			yield put({type: 'deleteLoadPlanDone', payload: {id}});
		},
		*listLoadPlan({payload}, {call, put}) {
            const response = yield call (loadplanApi.listLoadPlan, payload);
			yield put({type: 'listLoadPlanDone', payload: response});
		},
		*listLoadPlanByPage({payload}, {call, put}) {
			const response = yield call (loadplanApi.listLoadPlanByPage, payload);
			yield put({type: 'listLoadPlanByPageDone', payload: response});
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
		getLoadPlanByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createLoadPlanDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateLoadPlanDone(state,  {payload}) {
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
		deleteLoadPlanDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listLoadPlanDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listLoadPlanByPageDone(state, {payload}) {
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