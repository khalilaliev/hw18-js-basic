"use strict";

fetch("http://localhost:3000/posts")
  .then((response) => {
    console.log("response:", response);
    return response.json();
  })
  .then((response) => {
    console.log("response:", response);
  });
