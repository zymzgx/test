import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getPointsById (id) {
	return request(`${server}/api/points?id=${id}`);
}

export async function createPoints (params) {
	return request(`${server}/api/points`, {
		method: 'POST',
		body: params,
	});
}

export async function updatePoints (params) {
	return request(`${server}/api/points`, {
		method: 'PUT',
		body: params,
	});
}

export async function deletePoints (id) {
	return request(`${server}/api/points/${id}`, {
		method: 'DELETE',
	});
}

export async function listPoints (params) {
    return request(`${server}/api/points/list?${stringify(params)}`);
}

export async function listPointsByPage (params) {
	return request(`${server}/api/points/listByPage?${stringify(params)}`);
}

