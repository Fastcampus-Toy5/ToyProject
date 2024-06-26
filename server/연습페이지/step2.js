import axios from "/node_modules/axios/dist/esm/axios.min.js";

const HOST = "http://localhost:8080"; // 서버 주소

` step 2 : 서버에서 데이터 가져오기

  ※ 사전 준비 ※
    index.html에서 <script src="./step1.js" type="module"></script>를 step1 => step2로 바꿉시다.

  1. 서버에서 데이터를 가져오기 위해서는 axios를 사용합니다.
  2. axios(주소) 형태로 사용하며, 이번에는 주소 = "http://localhost:8080/api/users/kimpra2989"에 요청을 보내는 연습을 해봅시다.
    ※ npm run server를 통해 서버를 켜야 요청이 됩니다.
    ex. axios("http://localhost:8080/api/users/kimpra2989")
  3. 앞에 await를 붙여 axios가 데이터를 가져오는 걸 기다린 후 데이터를 저장합니다.
    ex. const 데이터 = await axios("http://localhost:8080/api/users/kimpra2989");
  4. 가져온 데이터를 console에 찍어 데이터 구조를 확인해봅시다.
  5. 우리가 쓰려고 하는 데이터는 데이터의 data 내부 data에 있습니다. 
     즉, 데이터 = {
                  data : {
                          data : 
                                {원하는 데이터}
                  }
      같은 형식입니다.
      어떻게 데이터를 가져오면 될까요? step1을 보며 생각해봅시다. 예시에 정답 있습니다. 고민해보시고 확인해보세요. 

  6. 데이터를 저장하는 것에 성공했다면 step1에서 했던 것처럼 html에 꽂아보는 연습을 해봅시다. 
  html 미리보기에서 팀, 직급, 이메일, 사번, (+이미지)가 보이면 성공입니다!
`;

const 데이터 = await axios("http://localhost:8080/api/users/kimpra2989");

console.log("데이터", 데이터);

const name = 데이터.data.data.name

document.getElementById("name").textContent = name;


