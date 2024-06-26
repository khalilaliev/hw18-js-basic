"use strict";

// Level 1 //

// ---------------task-1--------------- //

const URL_API_SOURCE = "https://jsonplaceholder.typicode.com/";

function getApiData(source) {
  fetch(`${URL_API_SOURCE}${source}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Response is not found!");
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}
getApiData("todos/");
getApiData("comments/");
getApiData("users/");
getApiData("posts/");

// ---------------task-2--------------- //

async function getDataByAsyncAwait(source) {
  try {
    const response = await fetch(`${URL_API_SOURCE}${source}`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
}
getDataByAsyncAwait("/todos/");
getDataByAsyncAwait("/comments/");

// ---------------task-3--------------- //

// const todoButton = document.querySelector(".todo__title");
// const commentsBody = document.querySelector(".comment__body");
// const ul = document.querySelector(".todo__list");

// async function getPersonalData(endpoint) {
//   const response = await fetch(`${URL_API_SOURCE}${endpoint}`);
//   const data = await response.json();
//   data.forEach((title, index) => {
//     const li = document.createElement("li");
//     li.innerHTML = `${index + 1}: ${title.title}`;
//     ul.appendChild(li);
//   });
// }

// todoButton.addEventListener("click", () => {
//   getPersonalData("/todos/");
//   getPersonalData("/todos/");
// });

function getPersonalData(endpoint, key) {
  fetch(`${URL_API_SOURCE}${endpoint}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not found!");
      }
      return response.json();
    })
    .then((result) => {
      result.map((item, index) => {
        console.log(`${index + 1}: ${item[key]}`);
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function getPersonData(endpoint, data1, data2) {
  fetch(`${URL_API_SOURCE}${endpoint}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not found!");
      }
      return response.json();
    })
    .then((result) => {
      result.map((item, index) => {
        return console.log(`${item[data1]}: ${item[data2]}`);
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

getPersonalData("/todos/", "title");
getPersonalData("/comments/", "body");

getPersonData("/users/", "name", "email");
getPersonData("/posts/", "id", "title");

// Level 2 //

const URL_HOST = "http://localhost:3000/posts";

const loader = document.querySelector(".loader");

function setLoading() {
  loader.style.display = "block";
}
function setNotLoading() {
  loader.style.display = "none";
}

const inputTitle = document.querySelector(".title");
const inputBody = document.querySelector(".body");
const createButton = document.querySelector(".btn-create");

let currentId = 0;

async function getCurrentId() {
  try {
    const response = await fetch(URL_HOST);
    const result = await response.json();
    const maxId = result.reduce(
      (max, post) => (post.id > max ? post.id : max),
      0
    );
    currentId = parseInt(maxId) + 1;
  } catch (error) {
    console.error(error.message);
  }
}
getCurrentId();

createButton.addEventListener("click", (event) => {
  event.preventDefault();
  let newPost = {
    title: "",
    body: "",
    id: String(currentId),
  };
  newPost.title = inputTitle.value;
  newPost.body = inputBody.value;
  if (inputTitle.value === "" && inputBody.value === "") {
    return;
  } else {
    fetch(URL_HOST, {
      method: "POST",
      body: JSON.stringify(newPost),
    });
  }
});

async function getPosts() {
  try {
    setLoading();
    const response = await fetch(URL_HOST);
    const result = await response.json();
    renderPosts(result);
  } catch (error) {
    console.error(error.message);
  } finally {
    setNotLoading();
  }
}
getPosts();
function renderPosts(data) {
  const ul = document.querySelector(".posts");
  data.forEach((item) => {
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    editButton.classList.add("btn-edit");
    deleteButton.innerHTML = "Delete";
    editButton.innerHTML = "Edit";
    const li = document.createElement("li");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    h3.innerHTML = `${item.id} ${item.title}`;
    p.innerHTML = item.body;
    li.classList.add("post");
    li.appendChild(h3);
    li.appendChild(p);
    ul.appendChild(li);
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    li.addEventListener("mousemove", () => {
      deleteButton.style.display = "inline-block";
      editButton.style.display = "inline-block";
    });
    li.addEventListener("mouseleave", () => {
      deleteButton.style.display = "none";
      editButton.style.display = "none";
    });
    deleteButton.addEventListener("click", () => {
      fetch(`${URL_HOST}/${item.id}`, {
        method: "DELETE",
      });
    });
    editButton.addEventListener("click", () => {
      h3.innerHTML = /* html */ `<input type="text" class="edit-title" value="${item.title}">`;
      p.innerHTML = /* html */ `<textarea class="edit-body">${item.body}</textarea>`;
      const confirmButton = document.createElement("button");
      confirmButton.classList.add("confirm-btn");
      confirmButton.innerHTML = "Save";
      li.appendChild(confirmButton);
      confirmButton.addEventListener("click", () => {
        const editedPost = {
          title: li.querySelector(".edit-title").value,
          body: li.querySelector(".edit-body").value,
        };
        const response = fetch(`${URL_HOST}/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedPost),
        });

        if (response.ok) {
          item.title = editedPost.title;
          item.body = editedPost.body;
          renderPosts(data);
        }
      });
    });
  });
}
