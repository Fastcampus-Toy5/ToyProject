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
        document.getElementById('profile-id').textContent = params.id;
        document.getElementById('profile-type').textContent = params.type;
        document.getElementById('profile-phone').textContent = params.phone;
        document.getElementById('profile-email').textContent = params.email;
    }

    const modal = document.getElementById("modal");
    const editBtn = document.getElementById("edit-btn");
    const span = document.getElementsByClassName("close")[0];
    const fileInput = document.getElementById("modal-image");

    editBtn.onclick = function() {
        document.getElementById('modal-name').value = document.getElementById('profile-name').textContent;
        document.getElementById('modal-id').value = document.getElementById('profile-id').textContent;
        document.getElementById('modal-type').value = document.getElementById('profile-type').textContent;
        document.getElementById('modal-phone').value = document.getElementById('profile-phone').textContent;
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

    document.getElementById("modal-save").onclick = function() {
        document.getElementById('profile-name').textContent = document.getElementById('modal-name').value;
        document.getElementById('profile-id').textContent = document.getElementById('modal-id').value;
        document.getElementById('profile-type').textContent = document.getElementById('modal-type').value;
        document.getElementById('profile-phone').textContent = document.getElementById('modal-phone').value;
        document.getElementById('profile-email').textContent = document.getElementById('modal-email').value;

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-picture').src = e.target.result;
            }
            reader.readAsDataURL(fileInput.files[0]);
        }
        

        modal.style.display = "none";
    }
});
