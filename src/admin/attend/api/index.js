import axios, { Axios } from 'axios';

const baseURL = 'http://localhost:8080';
const attendURL = baseURL + '/api/attends';

// 전체조회
export const findAll = async () => {
  try {
    const {data} = await axios.get(attendURL);

    return data;
  } catch(err) {
    console.error(err, res);
    return res;
  }
};