const toggleBtn = document.querySelector('.toggle-btn');
const menu = document.querySelector('.menu');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});