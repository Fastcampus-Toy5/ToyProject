document.addEventListener('DOMContentLoaded', function() {
    const profilesPerPage = 11; // 페이지당 프로필 수
    let currentPage = 1;
    const pagesToShow = 5; // 한 번에 표시할 페이지 수
    let profileCards = Array.from(document.querySelectorAll('.profile-card')).filter(card => !card.classList.contains('plus-box'));

    function renderProfiles(filteredProfiles = null) {
        const displayProfiles = filteredProfiles || profileCards;
        const totalProfiles = displayProfiles.length;
        const totalPages = Math.ceil(totalProfiles / profilesPerPage);

        profileCards.forEach((card, index) => {
            card.style.display = 'none';
        });

        displayProfiles.forEach((card, index) => {
            if (index >= (currentPage - 1) * profilesPerPage && index < currentPage * profilesPerPage) {
                card.style.display = 'flex';
            }
        });

        // Always show the + card
        document.getElementById('add-profile-card').style.display = 'flex';

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.id = 'prevPage';
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        paginationContainer.appendChild(prevButton);

        const startPage = Math.floor((currentPage - 1) / pagesToShow) * pagesToShow + 1;
        const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'page-button';
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.id = 'nextPage';
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        paginationContainer.appendChild(nextButton);
    }

    // 모달 창 열기
    function openModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
    }

    // 모달 창 닫기
    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    // 새로운 프로필 카드 추가
    function addProfileCard() {
        // 새로운 프로필 정보를 모달에서 가져오기
        const name = document.getElementById('modal-name').value;
        const id = document.getElementById('modal-id').value;
        const type = document.getElementById('modal-type').value;
        const phone = document.getElementById('modal-phone').value;
        const email = document.getElementById('modal-email').value;
        const imageInput = document.getElementById('modal-image');
        let imageUrl = 'https://via.placeholder.com/100'; // 기본 이미지

        // 이미지 파일 읽기
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageUrl = e.target.result;
                createProfileCard(name, id, type, phone, email, imageUrl);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            createProfileCard(name, id, type, phone, email, imageUrl);
        }

        // 모달 창 닫기
        closeModal();
    }

    // 새로운 프로필 카드 생성
    function createProfileCard(name, id, type, phone, email, imageUrl) {
        const newProfileCard = document.createElement('div');
        newProfileCard.className = 'profile-card';
        newProfileCard.innerHTML = `
            <button class="close-button" title="Remove">×</button>
            <img src="${imageUrl}" alt="Profile Picture">
            <div class="info">
                <div class="info-item">
                    <span class="label">Name :</span>
                    <span class="value">${name}</span>
                </div>
                <div class="info-item">
                    <span class="label">ID :</span>
                    <span class="value">${id}</span>
                </div>
                <div class="info-item">
                    <span class="label">Type :</span>
                    <span class="value">${type}</span>
                </div>
                <div class="info-item">
                    <span class="label">Phone :</span>
                    <span class="value">${phone}</span>
                </div>
                <div class="info-item">
                    <span class="label">Email :</span>
                    <span class="value">${email}</span>
                </div>
            </div>
        `;
        document.querySelector('.container').insertBefore(newProfileCard, document.getElementById('add-profile-card'));

        // 새 프로필 카드에 이벤트 리스너 추가
        newProfileCard.querySelector('.close-button').addEventListener('click', function(event) {
            event.stopPropagation();
            newProfileCard.remove();
            profileCards = Array.from(document.querySelectorAll('.profile-card')).filter(card => !card.classList.contains('plus-box'));
            renderProfiles();
        });

        newProfileCard.addEventListener('click', function() {
            const profileInfo = {
                name: newProfileCard.querySelector('.info-item:nth-child(1) .value').textContent,
                id: newProfileCard.querySelector('.info-item:nth-child(2) .value').textContent,
                type: newProfileCard.querySelector('.info-item:nth-child(3) .value').textContent,
                phone: newProfileCard.querySelector('.info-item:nth-child(4) .value').textContent,
                email: newProfileCard.querySelector('.info-item:nth-child(5) .value').textContent
            };
            const profileQueryString = new URLSearchParams(profileInfo).toString();
            window.location.href = `/src/admin/user/list/profile/index.html?${profileQueryString}`;
        });

        profileCards = Array.from(document.querySelectorAll('.profile-card')).filter(card => !card.classList.contains('plus-box'));

        const totalPages = Math.ceil(profileCards.length / profilesPerPage);
        currentPage = totalPages;
        renderProfiles();
    }

    // 초기화 코드
    document.getElementById('add-profile-card').addEventListener('click', openModal);
    document.getElementById('modal-save').addEventListener('click', addProfileCard);

    // 모달 닫기 버튼 클릭 시
    document.querySelector('.modal .close').addEventListener('click', closeModal);

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            button.parentElement.remove();
            profileCards = Array.from(document.querySelectorAll('.profile-card')).filter(card => !card.classList.contains('plus-box'));
            renderProfiles();
        });
    });

    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', function(event) {
            if (!event.target.classList.contains('close-button')) {
                const profileInfo = {
                    name: card.querySelector('.info-item:nth-child(1) .value').textContent,
                    id: card.querySelector('.info-item:nth-child(2) .value').textContent,
                    type: card.querySelector('.info-item:nth-child(3) .value').textContent,
                    phone: card.querySelector('.info-item:nth-child(4) .value').textContent,
                    email: card.querySelector('.info-item:nth-child(5) .value').textContent
                };
                const profileQueryString = new URLSearchParams(profileInfo).toString();
                window.location.href = `/src/admin/user/profile/index.html?${profileQueryString}`;
            }
        });
    });

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search');

    function highlightSearchTerm() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredProfiles = profileCards.filter(card => {
            let matchFound = false;
            const infoItems = card.querySelectorAll('.info-item .value');
            infoItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    matchFound = true;
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    item.innerHTML = item.textContent.replace(regex, '<span class="highlight">$1</span>');
                } else {
                    item.innerHTML = item.textContent; // 검색어가 없으면 원래 텍스트로 되돌림
                }
            });
            return matchFound;
        });

        currentPage = 1;
        renderProfiles(filteredProfiles);
    }

    searchButton.addEventListener('click', highlightSearchTerm);

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            highlightSearchTerm();
        }
    });

    document.querySelector('.pagination').addEventListener('click', function(event) {
        if (event.target.id === 'prevPage' && currentPage > 1) {
            currentPage--;
            renderProfiles();
        } else if (event.target.id === 'nextPage') {
            const totalPages = Math.ceil(profileCards.length / profilesPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProfiles();
            }
        } else if (event.target.className === 'page-button') {
            currentPage = parseInt(event.target.textContent, 10);
            renderProfiles();
        }
    });

    renderProfiles(); // Initialize the rendering
});
