import request from '../utils/request';
import { stringify } from 'qs'

export async function getCargoById (id) {
	return request(`/api/cargos?id=${id}`);
}

export async function createCargo (params) {
	return request(`/api/cargos`, {
		method: 'POST',
		body: params,
	});
}

export async function updateCargo (params) {
	return request(`/api/cargos`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteCargo (id) {
	return request(`/api/cargos/${id}`, {
		method: 'DELETE',
	});
}

export async function listCargo (params) {
    return request(`/api/cargos/list?${stringify(params)}`);
}

export async function listCargoByPage (params) {
	return request(`/api/cargos/listByPage?${stringify(params)}`);
}

