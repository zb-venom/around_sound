import axios from 'axios';

export const http = axios.create({
    baseURL: 'http://192.168.100.10:8081/api/'
})