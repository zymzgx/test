import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function getUnloadEquipmentById (id) {
	return request(`${server}/api/unloadequipments?id=${id}`);
}

export async function createUnloadEquipment (params) {
	return request(`${server}/api/unloadequipments`, {
		method: 'POST',
		body: params,
	});
}

export async function updateUnloadEquipment (params) {
	return request(`${server}/api/unloadequipments`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteUnloadEquipment (id) {
	return request(`${server}/api/unloadequipments/${id}`, {
		method: 'DELETE',
	});
}

export async function listUnloadEquipment (params) {
    return request(`${server}/api/unloadequipments/list?${stringify(params)}`);
}
