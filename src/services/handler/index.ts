import {API_MAIN} from '@env';
import {AxiosRequestHeaders} from 'axios';
import {useAxios} from 'services/useAxios';
import {IInformation} from 'store/informationStore';

interface IPostReportBody {
  cat_id: number;
  reported_by: number;
  lat: number;
  long: number;
  description?: string;
  status?: number;
  photo?: string;
  location: string;
}

export const PostReport = async (
  body: IPostReportBody,
  headers?: AxiosRequestHeaders,
) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/reports`,
      method: 'post',
      data: body,
      headers,
    });
    console.log('res post response', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const UpdateReportByStatusID = async (
  reportID: number,
  userID: number,
  statusID: number,
) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/reports/status/${reportID}`,
      method: 'post',
      data: {
        taken_by: userID,
        status: statusID,
      },
    });
    console.log('res update stat response', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const UpdatePassword = async (
  password: string,
  password_confirmation: string,
) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/password`,
      method: 'post',
      data: {
        password,
        password_confirmation,
      },
    });
    console.log('res update pass response', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const PostInformation = async (data: IInformation) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/articles`,
      method: 'post',
      data,
    });
    console.log('res post info', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const UpdateInformation = async (data: IInformation, id: number) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/articles/${id}`,
      method: 'put',
      data,
    });
    console.log('res put info', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const DeleteInformation = async (id: number) => {
  try {
    const response = await useAxios({
      url: `${API_MAIN}/articles/${id}`,
      method: 'delete',
    });
    console.log('res del info', response);
    return Promise.resolve(response);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
