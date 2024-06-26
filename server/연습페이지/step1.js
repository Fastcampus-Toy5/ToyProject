const 서버에서가져온데이터 = {
  userId: "kimpra2989",
  email: "kimpra2989@example.com",
  name: "Kim Pra",
  team: "Marketing",
  position: "Manager",
  isAdmin: 0, 
  imgUrl: "https://avatars.githubusercontent.com/u/106394183?v=4",
};

` step 1. 위 객체의 데이터를 html에 꽂아보는 연습을 해봅시다.

  1. 위 객체의 값을 쓰기 위해서는 '서버에서가져온데이터.userId'와 같이 '객체이름.속성명'을 써야합니다. 
  2. 서버에서가져온데티어.userId == "kimpra2989"이고 서버에서가져온데티어.name == "kim pra" 입니다.
  3. document.getElementById() 등을 이용해서 HTML요소를 선택합니다.
  4. innerHTML 함수(메소드)를 이용해서 그 요소의 내부 컨텐츠를 수정합니다. 
    ex. document.getElementById("name").innerHTML = 바꿀 내용 => name이라는 id를 갖는 요소의 내부 컨텐츠를 '바꿀 내용'으로 하겠다는 뜻
  5. 실제로 바꿀 내용을 써봅시다. 
    ex. document.getElementById("name").innerHTML = 서버에서가져온데이터.name 
      => name이라는 id를 갖는 요소의 내부 컨텐츠를 'Kim pra'로 하겠다는 뜻
  6. 나머지 데이터들을 html에서 볼 수 있게 해봅시다!

  심화
  7, 이미지에 경우 imgUrl에 있는 경로를 img테그의 내부 컨텐츠로 바꾸는 것이 아닌 src에 설정해야합니다. 
     이 경우에는 innerHTML이 아닌 setAttribute로 속성값을 수정해줘야합니다.
      ex. document.getElementById("profile-image").setAttribute("src", imgUrl);
        => 선택된 html요소(img테그)의 src속성에 imgUrl을 할당

  html 미리보기에서 팀, 직급, 이메일, 사번, (+이미지)가 보이면 성공입니다!
`

document.getElementById('name').innerHTML = 서버에서가져온데이터.name