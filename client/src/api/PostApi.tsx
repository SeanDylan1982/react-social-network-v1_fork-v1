/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommentsDataProps } from "../types/CommentInterfaces";
import { IPost } from "../types/PostInterfaces";
import { AxiosAPI } from "./base";

//  Post Requests for client-side

export async function fetchPosts() {
  try {
    console.log('Fetching posts...');
    const response = await AxiosAPI.get('/posts');
    console.log('Posts response:', response);
    if (!response) {
      return { data: [] };
    }
    return { data: response.data };
  } catch (err) {
    console.error('Error fetching posts:', err);
    return { data: [] };
  }
}

export async function addPost(data: FormData) {
  try {
    const response = await AxiosAPI.post('/posts', data);
    return response.data;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    const res = await AxiosAPI.delete(`/posts/${id}`);
    return res;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function likePost(id: string) {
  try {
    await AxiosAPI.patch(`/posts/like`, {
      id: id,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function unlikePost(id: string) {
  try {
    await AxiosAPI.patch(`/posts/unlike`, {
      id: id,
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function addComment(data: CommentsDataProps) {
  try {
    const response = await AxiosAPI.post(`/comment`, data);
    return response.data;
  } catch (err) {
    console.error('Error adding comment:', err);
    throw err;
  }
}

export async function fetchComments({
  queryKey,
}: {
  queryKey: Array<string | number>;
}) {
  try {
    const [_, id] = queryKey;
    const res = await AxiosAPI.get(`/comment/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching comments:', err);
    return [];
  }
}

export async function deleteComment(id: string) {
  try {
    const res = await AxiosAPI.delete(`/comment/${id}/delete`);
    return res.data;
  } catch (err) {
    console.error('Error deleting comment:', err);
    throw err;
  }
}
