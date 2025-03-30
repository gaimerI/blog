export const backendURL = "https://gaimeri17-forumtopicmanagemement.web.val.run";
import { currentUser } from "./auth.js";
import { escapeHTML, escapeHTMLAttr } from "./utils.js";

export function fetchTopics() {
    fetch(backendURL)
        .then(response => response.json())
        .then(topics => displayTopics(topics))
        .catch(error => {
            console.error("Error fetching topics:", error);
            document.getElementById("topics-container").innerHTML = `<p>Failed to load topics: ${error}</p>`;
        });
}

export function displayTopics(topics) {
    const container = document.getElementById("topics-container");
    container.innerHTML = "";

    if (topics.length === 0) {
        container.innerHTML = "<p>No topics yet. Be the first to post!</p>";
        return;
    }

    topics.forEach(topic => {
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic";
        topicDiv.dataset.id = topic.id;
        topicDiv.dataset.username = topic.username;
        
        topicDiv.innerHTML = `
            <div class="topic-title">${escapeHTML(topic.title)}</div>
            <div class="topic-body">${escapeHTML(topic.body)}</div>
            <div class="topic-username">Posted by ${escapeHTML(topic.username)}</div>
            
            ${currentUser === topic.username ? `
                <button onclick="editTopic(${topic.id})">Edit</button>
                <button onclick="deleteTopic(${topic.id})">Delete</button>
            ` : ''
            }
        `;

        container.appendChild(topicDiv);
    });
}

export function postTopic() {
    if (!currentUser) {
        alert("You must be logged in to post.");
        return;
    }

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    if (!title || !body) {
        alert("Please fill in all fields.");
        return;
    }

    fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser, title, body })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to post topic");
        return response.json();
    })
    .then(() => fetchTopics())
    .catch(error => {
        console.error("Error posting topic:", error);
        alert("Error posting topic.");
    });
}
