import { findAll } from "../api";
import ListItem from "./ListItem";

const addElement = (prop, type) => {
  const elementHTML = [];

  type == 'option' && prop.map(option => {elementHTML.push(`<option value="${option.value}">${option.text}</option>`)});
  type == 'header' && prop.map(header => {elementHTML.push(`<div>${header}</div>`)});

  return elementHTML.join('');
}

const createList = (props) => {
  const menuHtml = [];

  // before
  menuHtml.push(`
    <header class="main-content-header">
      <div class="header-title">
        <h1>${props.title}</h1>
        <div class="search">
          <input type="text" placeholder="사원명" />
          <svg
            id="Layer_1"
            style="enable-background: new 0 0 512 512"
            version="1.1"
            viewBox="0 0 512 512"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M344.5,298c15-23.6,23.8-51.6,23.8-81.7c0-84.1-68.1-152.3-152.1-152.3C132.1,64,64,132.2,64,216.3  c0,84.1,68.1,152.3,152.1,152.3c30.5,0,58.9-9,82.7-24.4l6.9-4.8L414.3,448l33.7-34.3L339.5,305.1L344.5,298z M301.4,131.2  c22.7,22.7,35.2,52.9,35.2,85c0,32.1-12.5,62.3-35.2,85c-22.7,22.7-52.9,35.2-85,35.2c-32.1,0-62.3-12.5-85-35.2  c-22.7-22.7-35.2-52.9-35.2-85c0-32.1,12.5-62.3,35.2-85c22.7-22.7,52.9-35.2,85-35.2C248.5,96,278.7,108.5,301.4,131.2z"
            />
          </svg>
        </div>
      </div>
      
      <select>
        ${addElement(props.select_options, 'option')}
      </select>
    </header>

    <div class="requests">
      <div class="grid request-header">
        ${addElement(props.list_headers, 'header')}
      </div>

    <div class="grid request-item">
    `);

  props.list.map((item) => {
    menuHtml.push(ListItem(item));
  });

  // after
  menuHtml.push(`</div>
        </div>`);

  return menuHtml;
};

/**
 * const props = {
    title: "근태관리 (관리자)",
    select_options: [
      {
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
      }
    ],
    list_headers: [
      "구분",
      "일시",
      "사원명",
      "사유",
      "수정/삭제"
    ],
    list: [
      {
        type: "연차",
        startDate: "2024.06.25",
        endDate: "2024.06.25",
        name: "홍길동",
        content: "개인사유"
      }, 
      {
        type: "연차",
        startDate: "2024.06.25",
        endDate: "2024.06.25",
        name: "홍길동",
        content: "개인사유"
      }, 
      {
        type: "연차",
        startDate: "2024.06.25",
        endDate: "2024.06.25",
        name: "홍길동",
        content: "개인사유"
      }, 
      {
        type: "연차",
        startDate: "2024.06.25",
        endDate: "2024.06.25",
        name: "홍길동",
        content: "개인사유"
      }
    ]
  };
 */

export default async function AttendList () {

  const apiResult = await findAll();
  const props = {
    title: "근태관리 (관리자)",
    select_options: [
      {
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
      }
    ],
    list_headers: [
      "구분",
      "일시",
      "사원명",
      "사유",
      "수정/삭제"
    ],
    list: apiResult?.data
  };

  // const props2 = {
  //   title: "근태관리 (관리자)",
  //   select_options: [
  //     {
  //       value: "all",
  //       text: "모두보기"
  //     }, 
  //     {
  //       value: "leave",
  //       text: "연차"
  //     },
  //     {
  //       value: "halfday",
  //       text: "반차"
  //     },
  //     {
  //       value: "absent",
  //       text: "조퇴"
  //     }
  //   ],
  //   list_headers: [
  //     "구분",
  //     "일시",
  //     "사원명",
  //     "사유",
  //     "수정/삭제"
  //   ],
  //   list: [
  //     {
  //       type: "연차",
  //       startDate: "2024.06.25",
  //       endDate: "2024.06.25",
  //       name: "홍길동",
  //       content: "개인사유"
  //     }, 
  //     {
  //       type: "연차",
  //       startDate: "2024.06.25",
  //       endDate: "2024.06.25",
  //       name: "홍길동",
  //       content: "개인사유"
  //     }, 
  //     {
  //       type: "연차",
  //       startDate: "2024.06.25",
  //       endDate: "2024.06.25",
  //       name: "홍길동",
  //       content: "개인사유"
  //     }, 
  //     {
  //       type: "연차",
  //       startDate: "2024.06.25",
  //       endDate: "2024.06.25",
  //       name: "홍길동",
  //       content: "개인사유"
  //     }
  //   ]
  // };

  const before = ``;
  const listHtml = createList(props).join('');

  return listHtml;
}