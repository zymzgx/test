import * as pointsApi from '../services/points';

export default {
	namespace: 'points',
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
		*getPointsById({payload: {id}}, {call, put}) {
			const response = yield call (pointsApi.getPointsById, id);
			yield put({type: 'getPointsByIdDone', payload: response});
		},
		*createPoints({payload}, {call, put}) {
			const response = yield call (pointsApi.createPoints, payload);
			yield put({type: 'createPointsDone', payload: response});
		},
		*updatePoints({payload}, {call, put}) {
			const response = yield call (pointsApi.updatePoints, payload);
			yield put({type: 'updatePointsDone', payload: response});
		},
		*deletePoints({payload: {id}}, {call, put}) {
			yield call (pointsApi.deletePoints, id);
			yield put({type: 'deletePointsDone', payload: {id}});
		},
		*listPoints({payload}, {call, put}) {
            const response = yield call (pointsApi.listPoints, payload);
			yield put({type: 'listPointsDone', payload: response});
		},
		*listPointsByPage({payload}, {call, put}) {
			const response = yield call (pointsApi.listPointsByPage, payload);
			yield put({type: 'listPointsByPageDone', payload: response});
		},
		
	},
	reducers: {		
		getPointsByIdDone(state, {payload}) {
			return {
				...state,
				entity: payload || {},
			};
		},
		createPointsDone(state, {payload}) {
			return {
				...state,
				items: state.items.concat(payload),
			};
		},
		updatePointsDone(state,  {payload}) {
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
		deletePointsDone(state, {payload: {id}}) {
			return {
				...state,
				items: state.items.filter(obj => obj.id !== id),
			};
		},
		listPointsDone(state, {payload}) {
			return {
				...state,
				items:payload,
			};
		},
		listPointsByPageDone(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
		
	},
}