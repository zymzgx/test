import request from '../utils/request';
import { stringify } from 'qs'

export async function queryEquipment(params) {
  return request(`/api/loadunloadequipments/list`);
}

export async function deleteEquipment(params) {
  return request(`/api/loadunloadequipments/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateEquipment(params) {
  return request(`/api/loadunloadequipments/${params.id}?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function addEquipment(params) {
  return request(`/api/loadunloadequipments`, {
    method: 'POST',
    body: params,
  });
}

export async function getCounterChart (params) {
  return request(`api/counterchart/list?${stringify(params)}`);
}