import { HOST } from "../constants.js";

const getAllUser = async () => {
  const res = await fetch("http://localhost:8080/api/users", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error:", errorData);
    alert("error : " + errorData.error);
    return;
  }

  const resjson = await res.json();
  console.log(resjson);
};

const getUser = async (userId) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error:", errorData);
    alert("error : " + errorData.error);
    return;
  }

  const resjson = await res.json();
  console.log(resjson);
  alert(resjson.message);
};

const postUser = async (userId) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: "test2",
      email: "test2@test.com",
      name: "hoyeon",
      team: "delivery2",
      position: "FE-lead",
      imgUrl: "#",
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error:", errorData);
    alert("error : " + errorData.error);
    return;
  }

  const resjson = await res.json();
  console.log(resjson);
  alert(resjson.message);
};

const editUser = async (userId) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: "새로운 비번",
      email: "test2@test.com",
      name: "hoyeon",
      team: "delivery2",
      position: "FE-lead",
      imgUrl: "#",
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error:", errorData);
    alert("error : " + errorData.error);
    return;
  }

  const resjson = await res.json();
  console.log(resjson);
  alert(resjson.message);
};

const deleteUser = async (userId) => {
  const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error:", errorData);
    alert("error : " + errorData.error);
    return;
  }

  const resjson = await res.json();
  console.log(resjson);
  alert(resjson.message);
};

document.getElementById("req").addEventListener("click", () => {
  editUser("kimpra3");
});

document
  .getElementById("fetch-user-info")
  .addEventListener("click", async () => {
    const res = await fetch(`${HOST}/api/users/kimpra2989`);
    const user = await res.json();

    console.log(user)

    const { email, imgUrl, name, position, team, userId } = user.data;

    const profile = document.getElementById("profile-image");
    document.getElementById("name").textContent = name;
    document.getElementById("team").textContent = team;
    document.getElementById("position").textContent = position;
    document.getElementById("email").textContent = email;
    document.getElementById("userId").textContent = userId;

    const placeholder = "https://placehold.co/300x300";
    profile.setAttribute("src", imgUrl ?? placeholder);
  });
