import axios, { Axios } from 'axios';

const baseURL = 'http://localhost:8080';
const attendURL = baseURL + '/api/attends';


export class AttendComp {
  constructor(dataList) {
    this.title = "근태관리 (관리자)";
    this.select_options = [{
      value: "all",
      text: "모두보기"
    }, 
    {
      value: "leave",
      text: "연차"
    },
    {
      value: "halfday",
      text: "반차"
    },
    {
      value: "absent",
      text: "조퇴"
    }];
    this.list_headers = ["구분", "일시", "사원명", "제목", "수정/삭제"];
    this.dataList = dataList;
  }
}

export class AttendData {
  constructor(data) {
    this.no = data.no;
    this.userId = data.userId;
    this.name = data.name;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.subject = data.subject;
    this.content = data.content;
    this.type = data.type;
  }
}

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

export const findOne = async (userId) => {
  try {
    const {data} = await axios.get(attendURL+`/${userId}`);

    return data;
  } catch(err) {
    console.error(err, res);
    return res;
  }
}

export const create = async (props) => {

}