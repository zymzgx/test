import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getShipById (id) {
	return request(`${server}/api/ships?id=${id}`);
}

export async function createShip (params) {
	return request(`${server}/api/ships`, {
		method: 'POST',
		body: params,
	});
}

export async function updateShip (params) {
	return request(`${server}/api/ships`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteShip (id) {
	return request(`${server}/api/ships/${id}`, {
		method: 'DELETE',
	});
}

export async function listShip (params) {
    return request(`${server}/api/ships/list?${stringify(params)}`);
}

export async function listShipByPage (params) {
	return request(`${server}/api/ships/listByPage?${stringify(params)}`);
}

