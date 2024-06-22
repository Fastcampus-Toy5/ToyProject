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
