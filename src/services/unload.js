import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getUnloadById (id) {
	return request(`${server}/api/unloads?id=${id}`);
}

export async function createUnload (params) {
	return request(`${server}/api/unloads`, {
		method: 'POST',
		body: params,
	});
}

export async function updateUnload (params) {
	return request(`${server}/api/unloads`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteUnload (id) {
	return request(`${server}/api/unloads/${id}`, {
		method: 'DELETE',
	});
}

export async function listUnload (params) {
    return request(`${server}/api/unloads/list?${stringify(params)}`);
}
