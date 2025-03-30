import { fetchTopics, fetchComments, fetchUserData } from "./topics.js";
import { updateAuthUI } from "./auth.js";

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
