import axios from 'axios';
import {
    LOGIN_USER
} from './types';

export function loginUser(dataToSubmit){
    
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    
    // dispatch 후 reducer로 보냄 (previous, action) => next
    return {
        type: LOGIN_USER,
        payload: request
    }
}