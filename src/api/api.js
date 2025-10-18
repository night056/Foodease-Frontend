import API from './AxiosConfig';

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const fetchUserRoles = (username) => API.get(`auth/user/${username}/roles`);