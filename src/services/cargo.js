import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getCargoById (id) {
	return request(`${server}/api/cargos?id=${id}`);
}

export async function createCargo (params) {
	return request(`${server}/api/cargos`, {
		method: 'POST',
		body: params,
	});
}

export async function updateCargo (params) {
	return request(`${server}/api/cargos`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteCargo (id) {
	return request(`${server}/api/cargos/${id}`, {
		method: 'DELETE',
	});
}

export async function listCargo (params) {
    return request(`${server}/api/cargos/list?${stringify(params)}`);
}

export async function listCargoByPage (params) {
	return request(`${server}/api/cargos/listByPage?${stringify(params)}`);
}

