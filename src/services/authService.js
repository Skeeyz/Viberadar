import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
});

export const authService = {
    async signIn (email, password){
        const response = await api.get('/signin', {email, password});
        return response.data;
    },
    async getProfile(token) {
        const response = await api.get('/profile', {
          headers: { Authorization: `Bearer ${this.token}` }});
        return response.data;
    },
}
