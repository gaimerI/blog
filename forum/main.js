import { updateAuthUI } from "./auth.js";
import { fetchTopics } from "./topics.js";
import { fetchUserData } from "./auth.js";
import { fetchComments } from "./comments.js"

const backendURL = "https://gaimeri17-forumtopicmanagemement.web.val.run";
const registerAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/register";
const loginAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/login";
const userDataAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/users";
const commentBackendURL = "https://gaimeri17-forumcommentmanagement.web.val.run";
const reactionBackendURL = "https://gaimeri17-forumtopicmanagemement.web.val.run/react";
let userCache = {};
let commentCache = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        currentUser = storedUser;
        updateAuthUI();
    }

    fetchUserData().then(() => {
        fetchTopics();
        fetchComments();
    });
});
