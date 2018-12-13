import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getLoadPlanById (id) {
	return request(`${server}/api/loadplans?id=${id}`);
}

export async function createLoadPlan (params) {
	return request(`${server}/api/loadplans`, {
		method: 'POST',
		body: params,
	});
}

export async function updateLoadPlan (params) {
	return request(`${server}/api/loadplans`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteLoadPlan (id) {
	return request(`${server}/api/loadplans/${id}`, {
		method: 'DELETE',
	});
}

export async function listLoadPlan (params) {
    return request(`${server}/api/loadplans/list?${stringify(params)}`);
}

export async function listLoadPlanByPage (params) {
	return request(`${server}/api/loadplans/listByPage?${stringify(params)}`);
}

