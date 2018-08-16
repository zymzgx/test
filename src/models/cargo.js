import * as cargoApi from '../services/cargo';

export default {
	namespace: 'cargo',
	state: {
		items: [],
		pageNo: 0,
		pageCount: 0,
		firstPage: 0,
		lastPage: 0,
		total: 0,
		totalPage: 0,
		entity: {},
	},
	subscriptions: {
		setup({dispatch, history}) {
		},
	},
	effects: {		
		*getCargoById({payload: {id}}, {call, put}) {
			const response = yield call (cargoApi.getCargoById, id);
			yield put({type: 'getCargoByIdDone', payload: response});
		},
		*createCargo({payload}, {call, put}) {
			const response = yield call (cargoApi.createCargo, payload);
			yield put({type: 'createCargoDone', payload: response});
		},
		*updateCargo({payload}, {call, put}) {
			const response = yield call (cargoApi.updateCargo, payload);
			yield put({type: 'updateCargoDone', payload: response});
		},
		*deleteCargo({payload: {id}}, {call, put}) {
			yield call (cargoApi.deleteCargo, id);
			yield put({type: 'deleteCargoDone', payload: {id}});
		},
		*listCargo({payload}, {call, put}) {
            const response = yield call (cargoApi.listCargo, payload);
			yield put({type: 'listCargoDone', payload: response});
		},
		*listCargoByPage({payload}, {call, put}) {
			const response = yield call (cargoApi.listCargoByPage, payload);
			yield put({type: 'listCargoByPageDone', payload: response});
		},
		
	},
	reducers: {		
		getCargoByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createCargoDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateCargoDone(state,  {payload}) {
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
		deleteCargoDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listCargoDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listCargoByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
		
	},
}