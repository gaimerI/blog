const backendURL = "https://gaimeri17-teachableturquoisewren.web.val.run";
const registerAuthURL = "https://gaimeri17-userauthval.web.val.run/register";
const loginAuthURL = "https://gaimeri17-userauthval.web.val.run/login";
const userDataAuthURL = "https://gaimeri17-userauthval.web.val.run/users";
const commentBackendURL = "https://gaimeri17-sensitivetealangelfish.web.val.run";
const reactionBackendURL = "https://gaimeri-teachableturquoisewren.web.val.run/react";
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

function fetchTopics() {
    fetch(backendURL)
        .then(response => response.json())
        .then(topics => displayTopics(topics))
        .catch(error => {
            console.error("Error fetching topics:", error);
            document.getElementById("topics-container").innerHTML = "<p>Failed to load topics.</p>";
        });
}

function displayTopics(topics) {
    const container = document.getElementById("topics-container");
    container.innerHTML = "";

    if (topics.length === 0) {
        container.innerHTML = "<p>No topics yet. Be the first to post!</p>";
        return;
    }

    topics.forEach(topic => {
        const profileIconNumber = userCache[topic.username] || 1;  // Default to 1 if not found
        const iconPath = `profile${profileIconNumber}.svg`;
    
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic";
        topicDiv.dataset.id = topic.id;
        topicDiv.dataset.username = topic.username;
        // careful with this
        topicDiv.innerHTML = `
            <div class="topic-title">${escapeHTML(topic.title)}</div>
            <div class="topic-body">${escapeHTML(topic.body)}</div>
            <div class="topic-username">
                Posted by ${escapeHTML(topic.username)}
                <img src="${iconPath}" alt="Profile Icon" class="profile-icon">
            </div>
            <div class="vote-section">
                <button onclick="voteTopic('${topic.username}', ${topic.id}, 'like')">▲</button>
                <span id="vote-count-${topic.id}">${topic.likes - topic.dislikes || 0}</span>
                <button onclick="voteTopic(${topic.username}, ${topic.id}, 'dislike')">▼</button>
            </div>

            ${currentUser === topic.username ? `
                <button onclick="editTopic(${topic.id}, '${topic.username}')">Edit</button>
                <button onclick="deleteTopic(${topic.id}, '${topic.username}')">Delete</button>
            ` : ''
            }
            <div class="comment-section"></div>
            <input type="text" id="comment-input-${topic.id}" placeholder="Write a comment...">
            <button onclick="postComment(${topic.id})">Post Comment</button>
        `;

        container.appendChild(topicDiv);
    });
    displayAllComments();
}

function postTopic() {
    if (!currentUser) {
        alert("You must be logged in to post.");
        return;
    }
    const username = currentUser;

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!username || !title || !body) {
        alert("Please fill in all fields.");
        return;
    }

    const topicData = { username, title, body };

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to post topic");
        return response.json();
    })
    .then(() => {
        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
        fetchTopics();
    })
    .catch(error => {
        console.error("Error posting topic:", error);
        alert("Error posting topic.");
    });  // <--- THIS was the missing closing bracket you dumbass!
}


function escapeHTML(str) {
    return str.replace(/[&<>'"`]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        "'": '&#39;', '"': '&quot;', '`': '&#96;'
    }[tag]));
}


function editTopic(id, username) {
    const topicDiv = document.querySelector(`.topic[data-id="${id}"]`);
    const title = topicDiv.querySelector(".topic-title").innerText;
    const body = topicDiv.querySelector(".topic-body").innerText;

    topicDiv.innerHTML = `
        <input type="text" id="edit-title-${id}" value="${escapeHTMLAttr(title)}">
        <textarea id="edit-body-${id}">${escapeHTMLAttr(body)}</textarea>
        <button onclick="submitEdit(${id}, '${username}')">Save</button>
        <button onclick="fetchTopics()">Cancel</button>
    `;
}

function submitEdit(id, username) {
    const title = document.getElementById(`edit-title-${id}`).value.trim();
    const body = document.getElementById(`edit-body-${id}`).value.trim();

    if (!title || !body) {
        alert("Title and body cannot be empty.");
        return;
    }

    const updateData = { id, username, title, body };

    fetch(backendURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update topic");
        return response.json();
    })
    .then(() => fetchTopics())
    .catch(error => {
        console.error("Error updating topic:", error);
        alert("Error updating topic.");
    });
}

function deleteTopic(id, username) {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    const deleteData = { id, username };

    fetch(backendURL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to delete topic");
        return response.json();
    })
    .then(() => fetchTopics())
    .catch(error => {
        console.error("Error deleting topic:", error);
        alert("Error deleting topic.");
    });
}

function escapeHTMLAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function registerUser() {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !password) {
        alert("Please fill in both fields to register.");
        return;
    }

    fetch(registerAuthURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
    })
    .then(() => {
        alert("Registration successful. You can now log in.");
        document.getElementById("register-username").value = "";
        document.getElementById("register-password").value = "";
    })
    .catch(error => {
        console.error("Error registering:", error);
        alert("Error registering user.");
    });
}

function loginUser() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Please fill in both fields to login.");
        return;
    }

    fetch(loginAuthURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
    })
    .then(() => {
        currentUser = username;
        localStorage.setItem("loggedInUser", currentUser);  // Save to localStorage
        updateAuthUI();
        fetchTopics();
    })
    .catch(error => {
        console.error("Error logging in:", error);
        alert("Login failed.");
    });
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("loggedInUser");  // Remove from localStorage
    updateAuthUI();
}


function updateAuthUI() {
    const userInfo = document.getElementById("user-info");
    const profileIconNumber = userCache[currentUser] || 1;
    const iconPath = `profile${profileIconNumber}.svg`;

    if (currentUser) {
        userInfo.style.display = "block";
        document.getElementById("current-profile-icon").style.display = "block";
        document.getElementById("current-user").innerText = currentUser;
        document.getElementById("current-profile-icon").src = iconPath;
    } else {
        userInfo.style.display = "none";
        document.getElementById("current-profile-icon").style.display = "none";
        document.getElementById("current-user").innerText = "";
    }
}

function fetchUserData() {
    return fetch(userDataAuthURL)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch user data");
            return response.json();
        })
        .then(users => {
            users.forEach(user => {
                userCache[user.username] = user.profile_icon; // Cache by username
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
}

function fetchComments() {
    return fetch(commentBackendURL)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch comments");
            return response.json();
        })
        .then(comments => {
            commentCache = comments;
            displayAllComments();
        })
        .catch(error => {
            console.error("Error fetching comments:", error);
        });
}

function displayAllComments() {
    const topicDivs = document.querySelectorAll(".topic");
    topicDivs.forEach(topicDiv => {
        const topicID = topicDiv.dataset.id;
        displayCommentsForTopic(topicID);
    });
}

function displayCommentsForTopic(topicID) {
    const topicDiv = document.querySelector(`.topic[data-id="${topicID}"]`);
    const commentSection = topicDiv.querySelector(".comment-section");
    commentSection.innerHTML = "";

    const topicIDNum = Number(topicID);
    const commentsForTopic = commentCache.filter(c => c.topicID == topicIDNum);

    if (commentsForTopic.length === 0) {
        commentSection.innerHTML = "<p>No comments yet.</p>";
        return;
    }

    commentsForTopic.forEach(comment => {
        const profileIconNumber = userCache[comment.username] || 1;
        const iconPath = `profile${profileIconNumber}.svg`;

        const commentDiv = document.createElement("div");
        commentDiv.className = "comment";

        commentDiv.innerHTML = `
            <div class="comment-content">${escapeHTML(comment.content)}</div>
            <div class="comment-user">
                ${escapeHTML(comment.username)}
                <img src="${iconPath}" alt="Profile Icon" class="profile-icon">
            </div>
        `;
        commentSection.appendChild(commentDiv);
    });
}

function postComment(topicID) {
    if (!currentUser) {
        alert("You must be logged in to comment.");
        return;
    }

    const commentInput = document.getElementById(`comment-input-${topicID}`);
    const content = commentInput.value.trim();

    if (!content) {
        alert("Comment cannot be empty.");
        return;
    }

    const commentData = {
        username: currentUser,
        topicID: topicID,
        content: content
    };

    fetch(commentBackendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to post comment");
        return response.json();
    })
    .then(() => {
        // Update cache locally to minimize backend call
        commentCache.push(commentData);
        commentInput.value = "";
        displayCommentsForTopic(topicID);
    })
    .catch(error => {
        console.error("Error posting comment:", error);
        alert("Error posting comment.");
    });
}

function voteTopic(username, id, action) {
    const reactData = {
        "topicId": id,
        "username": username,
        "reaction": action
    };
    fetch(reactionBackendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reactData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to cast vote");
        return response.json();
    })
    .then(data => {
        // Update vote count
        const voteCountElement = document.getElementById(`vote-count-${id}`);
        if (voteCountElement) {
            voteCountElement.textContent = "vote"; // assuming backend returns the new vote count
        }
    })
    .catch(error => {
        console.error("Error voting on topic:", error);
        alert(error);
    });
}
