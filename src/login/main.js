// 아이디와 비밀번호 입력 필드를 선택합니다.
const idInput = document.getElementById('id');
const pwInput = document.getElementById('pw');

// 로그인 버튼을 선택합니다.
const loginButton = document.querySelector('.btn-area button');

// 아이디와 비밀번호 입력 필드의 값이 변경될 때마다 실행되는 함수를 설정합니다.
idInput.addEventListener('input', updateButtonState);
pwInput.addEventListener('input', updateButtonState);

// 아이디와 비밀번호 입력 필드의 값에 따라 로그인 버튼의 상태를 업데이트하는 함수입니다.
function updateButtonState() {
    if (idInput.value && pwInput.value) {
        // 아이디와 비밀번호 입력 필드가 모두 채워져 있으면, 로그인 버튼을 활성화하고 색상을 변경합니다.
        loginButton.disabled = false;
        loginButton.style.backgroundColor = '#6d40c8';
        loginButton.style.cursor = 'pointer';
    } else {
        // 아이디와 비밀번호 입력 필드 중 하나라도 비어있으면, 로그인 버튼을 비활성화하고 색상을 변경합니다.
        loginButton.disabled = true;
        loginButton.style.backgroundColor = '#999';
        loginButton.style.cursor = 'default';
    }
}

// 페이지가 로드될 때 로그인 버튼의 초기 상태를 설정합니다.
updateButtonState();