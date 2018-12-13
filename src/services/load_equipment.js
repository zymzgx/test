import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getLoadEquipmentById (id) {
	return request(`${server}/api/loadequipments?id=${id}`);
}

export async function createLoadEquipment (params) {
	return request(`${server}/api/loadequipments`, {
		method: 'POST',
		body: params,
	});
}

export async function updateLoadEquipment (params) {
	return request(`${server}/api/loadequipments`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteLoadEquipment (id) {
	return request(`${server}/api/loadequipments/${id}`, {
		method: 'DELETE',
	});
}

export async function listLoadEquipment (params) {
    return request(`${server}/api/loadequipments/list?${stringify(params)}`);
}
