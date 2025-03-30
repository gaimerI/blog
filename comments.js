export const commentBackendURL = "https://gaimeri17-forumcommentmanagement.web.val.run";
import { currentUser } from "./auth.js";
import { escapeHTML } from "./utils.js";

let commentCache = [];

export function fetchComments() {
    return fetch(commentBackendURL)
        .then(response => response.json())
        .then(comments => {
            commentCache = comments;
            displayAllComments();
        })
        .catch(error => {
            console.error("Error fetching comments:", error);
        });
}

export function displayAllComments() {
    document.querySelectorAll(".topic").forEach(topicDiv => {
        displayCommentsForTopic(topicDiv.dataset.id);
    });
}

export function displayCommentsForTopic(topicID) {
    const topicDiv = document.querySelector(`.topic[data-id="${topicID}"]`);
    const commentSection = topicDiv.querySelector(".comment-section");
    commentSection.innerHTML = "";

    const filteredComments = commentCache.filter(c => c.topicID == topicID);
    if (filteredComments.length === 0) {
        commentSection.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    filteredComments.forEach(comment => {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";
        commentDiv.innerHTML = `
            <div class="comment-content">${escapeHTML(comment.content)}</div>
            <div class="comment-user">${escapeHTML(comment.username)}</div>
        `;
        commentSection.appendChild(commentDiv);
    });
}
