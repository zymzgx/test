import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getLoadCarEquipmentById (id) {
	return request(`${server}/api/loadcarequipments?id=${id}`);
}

export async function createLoadCarEquipment (params) {
	return request(`${server}/api/loadcarequipments`, {
		method: 'POST',
		body: params,
	});
}

export async function updateLoadCarEquipment (params) {
	return request(`${server}/api/loadcarequipments`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteLoadCarEquipment (id) {
	return request(`${server}/api/loadcarequipments/${id}`, {
		method: 'DELETE',
	});
}

export async function listLoadCarEquipment (params) {
    return request(`${server}/api/loadcarequipments/list?${stringify(params)}`);
}
