import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getLoadCarById (id) {
	return request(`${server}/api/loadcars?id=${id}`);
}

export async function createLoadCar (params) {
	return request(`${server}/api/loadcars`, {
		method: 'POST',
		body: params,
	});
}

export async function updateLoadCar (params) {
	return request(`${server}/api/loadcars`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteLoadCar (id) {
	return request(`${server}/api/loadcars/${id}`, {
		method: 'DELETE',
	});
}

export async function listLoadCar (params) {
    return request(`${server}/api/loadcars/list?${stringify(params)}`);
}

export async function listLoadCarByPage (params) {
	return request(`${server}/api/loadcars/listByPage?${stringify(params)}`);
}

