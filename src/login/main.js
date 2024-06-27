document.addEventListener('DOMContentLoaded', (event) => {
    const idInput = document.getElementById('id');
    const pwInput = document.getElementById('pw');
    const loginButton = document.querySelector('.btn-area button');
    const loginForm = document.getElementById('loginForm');

    idInput.addEventListener('input', updateButtonState);
    pwInput.addEventListener('input', updateButtonState);

    function updateButtonState() {
        if (idInput.value && pwInput.value) {
            loginButton.disabled = false;
            loginButton.style.backgroundColor = '#6d40c8';
            loginButton.style.cursor = 'pointer';
        } else {
            loginButton.disabled = true;
            loginButton.style.backgroundColor = '#999';
            loginButton.style.cursor = 'default';
        }
    }

    updateButtonState();

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // 기본 form 제출 동작을 막습니다.

        const userId = idInput.value;
        const password = pwInput.value;

        console.log('Attempting to log in with:', {userId, password}); // 디버깅용 로그

        fetch(`localhost:8080/api/users/login`, { // URL 수정
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, password}) // 데이터를 JSON 문자열로 변환
        })
            .then(response => {
                console.log('Server response:', response); // 디버깅용 로그
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response data:', data); // 디버깅용 로그
                if (data.status === "OK") {
                    if (data.data[0].isAdmin) {
                        window.location.href = '/admin.html';
                    } else {
                        window.location.href = '/user.html';
                    }
                } else {
                    alert('Login failed');
                }
            })
            .catch(error => {
                console.error('Error during login:', error); // 오류 로그
                alert('An error occurred while logging in');
            });
    });
});
