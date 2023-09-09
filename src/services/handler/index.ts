import {API_MAIN} from '@env';
import {AxiosRequestHeaders} from 'axios';
import {useAxios} from 'services/useAxios';

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
