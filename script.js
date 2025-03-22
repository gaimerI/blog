const backendURL = "https://gaimeri17-teachableturquoisewren.web.val.run";

document.addEventListener("DOMContentLoaded", fetchTopics);

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
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic";

        topicDiv.innerHTML = `
            <div class="topic-title">${escapeHTML(topic.title)}</div>
            <div class="topic-body">${escapeHTML(topic.body)}</div>
            <div class="topic-username">Posted by ${escapeHTML(topic.username)}</div>
        `;

        container.appendChild(topicDiv);
    });
}

function postTopic() {
    const username = document.getElementById("username").value.trim();
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
        // Clear form
        document.getElementById("username").value = "";
        document.getElementById("title").value = "";
        document.getElementById("body").value = "";

        // Refetch topics (light use of backend)
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
