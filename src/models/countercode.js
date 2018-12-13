import * as countercodeApi from '../services/counter_code';

export default {
	namespace: 'countercode',
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
		*getCounterCodeById({payload: {id}}, {call, put}) {
			const response = yield call (countercodeApi.getCounterCodeById, id);
			yield put({type: 'getCounterCodeByIdDone', payload: response});
		},
		*createCounterCode({payload}, {call, put}) {
			const response = yield call (countercodeApi.createCounterCode, payload);
			yield put({type: 'createCounterCodeDone', payload: response});
		},
		*updateCounterCode({payload}, {call, put}) {
			const response = yield call (countercodeApi.updateCounterCode, payload);
			yield put({type: 'updateCounterCodeDone', payload: response});
		},
		*deleteCounterCode({payload: {id}}, {call, put}) {
			yield call (countercodeApi.deleteCounterCode, id);
			yield put({type: 'deleteCounterCodeDone', payload: {id}});
		},
		*listCounterCode({payload}, {call, put}) {
            const response = yield call (countercodeApi.listCounterCode, payload);
			yield put({type: 'listCounterCodeDone', payload: response});
		},
		*listCounterCodeByPage({payload}, {call, put}) {
			const response = yield call (countercodeApi.listCounterCodeByPage, payload);
			yield put({type: 'listCounterCodeByPageDone', payload: response});
		},
		
	},
	reducers: {		
		getCounterCodeByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createCounterCodeDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updateCounterCodeDone(state,  {payload}) {
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
		deleteCounterCodeDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listCounterCodeDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listCounterCodeByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
		
	},
}