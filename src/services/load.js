import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getLoadById (id) {
	return request(`${server}/api/loads?id=${id}`);
}

export async function createLoad (params) {
	return request(`${server}/api/loads`, {
		method: 'POST',
		body: params,
	});
}

export async function updateLoad (params) {
	return request(`${server}/api/loads`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteLoad (id) {
	return request(`${server}/api/loads/${id}`, {
		method: 'DELETE',
	});
}

export async function listLoad (params) {
    return request(`${server}/api/loads/list?${stringify(params)}`);
}
