document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    const params = getQueryParams();

    if (params.name) {
        document.getElementById('profile-picture').src = params.picture || 'https://via.placeholder.com/250x300';
        document.getElementById('profile-name').textContent = params.name;
        document.getElementById('profile-userId').textContent = params.userId;
        document.getElementById('profile-team').textContent = params.team;
        document.getElementById('profile-position').textContent = params.position;
        document.getElementById('profile-email').textContent = params.email;
    }

    const modal = document.getElementById("modal");
    const editBtn = document.getElementById("edit-btn");
    const span = document.getElementsByClassName("close")[0];
    const fileInput = document.getElementById("modal-image");
    const modalPreview = document.getElementById("modal-profile-picture");
    const deleteImageButton = document.getElementById("delete-image");

    editBtn.onclick = function() {
        document.getElementById('modal-name').value = document.getElementById('profile-name').textContent;
        document.getElementById('modal-userId').value = document.getElementById('profile-userId').textContent;
        document.getElementById('modal-team').value = document.getElementById('profile-team').textContent;
        document.getElementById('modal-position').value = document.getElementById('profile-position').textContent;
        document.getElementById('modal-email').value = document.getElementById('profile-email').textContent;
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // 이미지 업로드 시 미리보기 업데이트
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                modalPreview.src = e.target.result;
            }
            reader.readAsDataURL(fileInput.files[0]);
        }
    });

    // 이미지 삭제 기능 추가
    deleteImageButton.addEventListener('click', function() {
        modalPreview.src = 'https://via.placeholder.com/100';
        fileInput.value = ''; // 파일 입력 초기화
    });

    document.getElementById("modal-save").onclick = function() {
        document.getElementById('profile-name').textContent = document.getElementById('modal-name').value;
        document.getElementById('profile-userId').textContent = document.getElementById('modal-userId').value;
        document.getElementById('profile-team').textContent = document.getElementById('modal-team').value;
        document.getElementById('profile-position').textContent = document.getElementById('modal-position').value;
        document.getElementById('profile-email').textContent = document.getElementById('modal-email').value;

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 250;
                    canvas.height = 300;
                    ctx.drawImage(img, 0, 0, 250, 300);
                    const resizedImageUrl = canvas.toDataURL('image/jpeg');
                    document.getElementById('profile-picture').src = resizedImageUrl;

                    // 업데이트된 이미지 URL을 URLSearchParams에 추가하여 다시 설정
                    params.picture = resizedImageUrl;
                    const newParams = new URLSearchParams(params).toString();
                    window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
                }
            }
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // 이미지가 업로드되지 않았고, 삭제된 상태일 때
            document.getElementById('profile-picture').src = 'https://via.placeholder.com/250x300';
            params.picture = 'https://via.placeholder.com/250x300';
            const newParams = new URLSearchParams(params).toString();
            window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
        }

        modal.style.display = "none";
    }

    // 윈도우 크기에 따라 스케일 조정 함수
    function adjustScale() {
        const profileContainer = document.querySelector('.profile-container');
        const scale = Math.min(window.innerWidth / profileContainer.offsetWidth, 1);
        profileContainer.style.transform = `scale(${scale})`;
        profileContainer.style.transformOrigin = 'top left';
    }

    // 윈도우 크기 변경 시 스케일 조정
    window.addEventListener('resize', adjustScale);

    // 초기 로드 시 스케일 조정
    adjustScale();
});
