import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function listEquipment (params) {
  return request(`${server}/api/loadunloadequipments/list?${stringify(params)}`);
}

export async function listEquipmentByPage (params) {
return request(`${server}/api/loadunloadequipments/listByPage?${stringify(params)}`);
}

export async function getEquipmentById (id) {
	return request(`${server}/api/loadunloadequipments?id=${id}`);
}

export async function createEquipment (params) {
	return request(`${server}/api/loadunloadequipments`, {
		method: 'POST',
		body: params,
	});
}

export async function updateEquipment (params) {
	return request(`${server}/api/loadunloadequipments`, {
		method: 'PUT',
		body: params,
	});
}

export async function deleteEquipment (id) {
	return request(`${server}/api/loadunloadequipments/${id}`, {
		method: 'DELETE',
	});
}

//export async function getCounterChart (params) {
//  return request(`${server}/api/counterchart/list?${stringify(params)}`);
//}


/////////////////////////////
export async function getCounterEquipment (params) {
	return request(`${server}/api/counterequipment/list?${stringify(params)}`);
  }
  export async function getCounterChart (params) {
	return request(`${server}/api/counterchart/list?${stringify(params)}`);
  }
  
  export async function getAiChart (params) {
	return request(`${server}/api/aichart/list1?${stringify(params)}`);
  }
  
  export async function getAiEquipment (params) {
	return request(`${server}/api/aiequipment/list?${stringify(params)}`);
  }
  