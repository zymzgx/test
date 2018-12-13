import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getUnloadPlanById (id) {
	return request(`${server}/api/unloadplans?id=${id}`);
}

export async function createUnloadPlan (params) {
	return request(`${server}/api/unloadplans`, {
		method: 'POST',
		body: params,
	});
}

export async function updateUnloadPlan (params) {
	return request(`${server}/api/unloadplans`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteUnloadPlan (id) {
	return request(`${server}/api/unloadplans/${id}`, {
		method: 'DELETE',
	});
}

export async function listUnloadPlan (params) {
    return request(`${server}/api/unloadplans/list?${stringify(params)}`);
}

export async function listUnloadPlanByPage (params) {
	return request(`${server}/api/unloadplans/listByPage?${stringify(params)}`);
}

