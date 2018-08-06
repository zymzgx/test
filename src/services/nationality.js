import request from '../utils/request';
import { stringify } from 'qs'

export async function queryNationality(params) {
  return request(`/api/nationalities/list`);
}

export async function deleteNationality(params) {
  return request(`/api/nationalities/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateNationality(params) {
  return request(`/api/nationalities/${params.id}?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function addNationality(params) {
  return request(`/api/nationalities`, {
    method: 'POST',
    body: params,
  });
}