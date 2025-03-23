const backendURL = "https://gaimeri17-teachableturquoisewren.web.val.run";
const registerAuthURL = "https://gaimeri17-userauthval.web.val.run/register";
const loginAuthURL = "https://gaimeri17-userauthval.web.val.run/login";
const userDataAuthURL = "https://gaimeri17-userauthval.web.val.run/users";
let userCache = {};

document.addEventListener("DOMContentLoaded", () => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        currentUser = storedUser;
        updateAuthUI();
    }

    fetchUserData().then(() => {
        fetchTopics();
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

        topicDiv.innerHTML = `
            <div class="topic-title">${escapeHTML(topic.title)}</div>
            <div class="topic-body">${escapeHTML(topic.body)}</div>
            <div class="topic-username">
                <img src="${iconPath}" alt="Profile Icon" class="profile-icon">
                Posted by ${escapeHTML(topic.username)}
            </div>
            ${currentUser === topic.username ? `
                <button onclick="editTopic(${topic.id}, '${topic.username}')">Edit</button>
                <button onclick="deleteTopic(${topic.id}, '${topic.username}')">Delete</button>
            ` : ''}
        `;

    container.appendChild(topicDiv);
});

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
        document.getElementById("username").value = "";
        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
        fetchTopics();
    })
    .catch(error => {
        console.error("Error posting topic:", error);
        alert("Error posting topic.");
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;',
        "'": '&#39;', '"': '&quot;'
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

let currentUser = null;

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
    if (currentUser) {
        userInfo.style.display = "block";
        document.getElementById("current-user").innerText = currentUser;
    } else {
        userInfo.style.display = "none";
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
