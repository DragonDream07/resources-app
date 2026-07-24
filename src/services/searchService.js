import api from './api';

export const search = (params) =>
  api.get('/search', { params }).then((res) => res.data);

export const suggest = (params) =>
  api.get('/search/suggest', { params }).then((res) => res.data);

export default {
  search,
  suggest,
};
