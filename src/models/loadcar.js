import * as loadcarApi from '../services/loadcar';
import { listCargo } from '../services/cargo';

export default {
	namespace: 'loadcar',
	state: {
		items: [],
		pageNo: 0,
		pageCount: 0,
		firstPage: 0,
		lastPage: 0,
		total: 0,
		totalPage: 0,
		entity: {},

		listCargo: [],
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getLoadCarById({payload: {id}}, {call, put}) {
			const response = yield call (loadcarApi.getLoadCarById, id);
			yield put({type: 'getLoadCarByIdDone', payload: response});
		},
		*createLoadCar({payload}, {call, put}) {
			const response = yield call (loadcarApi.createLoadCar, payload);
			yield put({type: 'createLoadCarDone', payload: response});
		},
		*updateLoadCar({payload}, {call, put}) {
			const response = yield call (loadcarApi.updateLoadCar, payload);
			yield put({type: 'updateLoadCarDone', payload: response});
		},
		*deleteLoadCar({payload: {id}}, {call, put}) {
			yield call (loadcarApi.deleteLoadCar, id);
			yield put({type: 'deleteLoadCarDone', payload: {id}});
		},
		*listLoadCar({payload}, {call, put}) {
            const response = yield call (loadcarApi.listLoadCar, payload);
			yield put({type: 'listLoadCarDone', payload: response});
		},
		*listLoadCarByPage({payload}, {call, put}) {
			const response = yield call (loadcarApi.listLoadCarByPage, payload);
			yield put({type: 'listLoadCarByPageDone', payload: response});
		},

		*listCargo({payload}, {call, put}) {
            const response = yield call (listCargo, payload);
			yield put({type: 'listCargoDone', payload: response});
		},
		
	},
	reducers: {		
		getLoadCarByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createLoadCarDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateLoadCarDone(state,  {payload}) {
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
		deleteLoadCarDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listLoadCarDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listLoadCarByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
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