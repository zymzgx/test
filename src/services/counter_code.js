import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getCounterCodeById (id) {
	return request(`${server}/api/countercodes?id=${id}`);
}

export async function createCounterCode (params) {
	return request(`${server}/api/countercodes`, {
		method: 'POST',
		body: params,
	});
}

export async function updateCounterCode (params) {
	return request(`${server}/api/countercodes`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteCounterCode (id) {
	return request(`${server}/api/countercodes/${id}`, {
		method: 'DELETE',
	});
}

export async function listCounterCode (params) {
    return request(`${server}/api/countercodes/list?${stringify(params)}`);
}

export async function listCounterCodeByPage (params) {
	return request(`${server}/api/countercodes/listByPage?${stringify(params)}`);
}

