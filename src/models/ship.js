import * as shipApi from '../services/ship';

export default {
	namespace: 'ship',
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
		*getShipById({payload: {id}}, {call, put}) {
			const response = yield call (shipApi.getShipById, id);
			yield put({type: 'getShipByIdDone', payload: response});
		},
		*createShip({payload}, {call, put}) {
			const response = yield call (shipApi.createShip, payload);
			yield put({type: 'createShipDone', payload: response});
		},
		*updateShip({payload}, {call, put}) {
			const response = yield call (shipApi.updateShip, payload);
			yield put({type: 'updateShipDone', payload: response});
		},
		*deleteShip({payload: {id}}, {call, put}) {
			yield call (shipApi.deleteShip, id);
			yield put({type: 'deleteShipDone', payload: {id}});
		},
		*listShip({payload}, {call, put}) {
            const response = yield call (shipApi.listShip, payload);
			yield put({type: 'listShipDone', payload: response});
		},
		*listShipByPage({payload}, {call, put}) {
			const response = yield call (shipApi.listShipByPage, payload);
			yield put({type: 'listShipByPageDone', payload: response});
		},
		
	},
	reducers: {		
		getShipByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createShipDone(state, {payload}) {
			console.log('payload', payload);
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateShipDone(state,  {payload}) {
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
		deleteShipDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listShipDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listShipByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
		
	},
}