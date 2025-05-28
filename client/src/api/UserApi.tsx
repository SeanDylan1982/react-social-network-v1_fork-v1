/* eslint-disable @typescript-eslint/no-unused-vars */

import { store } from "../redux/store";
import { AxiosResponse } from "axios";
import { AuthProps, IUser } from "../types/UserInterfaces";
import { AxiosAPI, client } from "./base";
export const fetchUsers = async () => {
  try {
    const res: AxiosResponse = await AxiosAPI.get('/auth');
    return res.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

export const fetchFollowers = async ({
  queryKey,
}: {
  queryKey: Array<string>;
}) => {
  try {
    const [_, id] = queryKey;
    const res = await AxiosAPI.get(`/auth/${id}/followers`);
    return res.data;
  } catch (err) {
    console.error('Error fetching followers:', err);
    throw err;
  }
};

export const fetchSingleUser = async ({
  queryKey,
}: {
  queryKey: Array<string>;
}) => {
  const [_, id] = queryKey;
  try {
    const res: AxiosResponse = await client.get(`/auth/${id}`);
    return res.data;
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }
};

export const followUser = async ({ queryKey }: { queryKey: Array<string> }) => {
  const [_, id] = queryKey;
  try {
    const res = await AxiosAPI.get(`/auth/${id}/follow`);
    return res.data;
  } catch (err) {
    console.error('Error following user:', err);
    throw err;
  }
};

export const unfollowUser = async ({
  queryKey,
}: {
  queryKey: Array<string>;
}) => {
  const [_, id] = queryKey;
  try {
    const res = await AxiosAPI.get(
      `${import.meta.env.VITE_API_URL}auth/${id}/unfollow`
    );

    return res.data;
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
      alert(err);
    });
  }
};

export const registerUser = async (data: IUser | FormData) => {
  try {
    // Log the FormData contents
    if (data instanceof FormData) {
      console.log('Registering user with FormData:');
      for (let pair of data.entries()) {
        console.log(pair[0], ':', pair[1]);
      }
    } else {
      console.log('Registering user with data:', data);
    }

    const response = await AxiosAPI.post("/auth", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log('Server response:', response);

    if (response?.data) {
      return response.data;
    } else {
      console.error('No data in response:', response);
      throw new Error('Server returned empty response');
    }
  } catch (error: any) {
    console.error('Registration failed:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message
    });
    
    // Throw an error with a meaningful message
    const errorMessage = error?.response?.data?.message 
      || error?.message 
      || 'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

export const loginUser = async (data: AuthProps) => {
  try {
    const response = await AxiosAPI.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const searchUsers = async ({
  queryKey,
}: {
  queryKey: Array<string>;
}) => {
  const [_, query] = queryKey;

  try {
    const res: AxiosResponse = await client.get(`/auth/search/${query}`);
    return res;
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
      console.log(err);
    });
  }
};

export const editUser = async (data: IUser) => {
  const userID = store.getState().user.currentUser._id;
  try {
    const res = await AxiosAPI.put(
      `${import.meta.env.VITE_API_URL}auth/${userID}/edit`,
      data,
      {
        headers: {
          "Content-Type": "application/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }
};
