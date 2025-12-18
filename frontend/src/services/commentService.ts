
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL;

export interface CommentRequest {
    content: string;
    parentCommentId?: number;
}

export const createComment = async (eventId: string, comment: CommentRequest) => {
    const response = await axios.post(`${API_URL}/events/${eventId}/comments`, comment);
    return response.data;
};

export const getComments = async (eventId: string) => {
    const response = await axios.get(`${API_URL}/events/${eventId}/comments`);
    return response.data;
};

export const updateComment = async (commentId: number, comment: CommentRequest) => {
    const response = await axios.put(`${API_URL}/comments/${commentId}`, comment);
    return response.data;
};

export const deleteComment = async (commentId: number) => {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`);
    return response.data;
};
