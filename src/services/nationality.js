import request from '../utils/request';
import { stringify } from 'qs'

const server = 'http://localhost:8000';

export async function queryNationality(params) {
  return request(`${server}/api/nationalities/list`);
}

export async function deleteNationality(params) {
  return request(`${server}/api/nationalities/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateNationality(params) {
  return request(`${server}/api/nationalities/${params.id}?${stringify(params)}`, {
    method: 'PUT',
  });
}

export async function addNationality(params) {
  return request(`${server}/api/nationalities`, {
    method: 'POST',
    body: params,
  });
}