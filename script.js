document.addEventListener("DOMContentLoaded", () => {
    let topics = [];
    const username = "Test user";
    const topicList = document.getElementById("topic-list");
    const newTopicForm = document.getElementById("new-topic-form");
    const topicTitle = document.getElementById("topic-title");
    const topicContent = document.getElementById("topic-content");

    // Render topics
    function renderTopics() {
        topicList.innerHTML = "";
        topics.forEach((topic, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${topic.title} - by ${topic.user}</h3>
                <p>${topic.content}</p>
                <button onclick="viewTopic(${index})"><span class="material-symbols-outlined">visibility</span></button>
                <button onclick="deleteTopic(${index})"><span class="material-symbols-outlined">remove</span></button>
                <aside>Posted on ${topic.date}</aside>
            `;
            topicList.appendChild(li);
        });
    }

    // Fetch topics from external file
    fetch("topics.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load topics.");
            }
            return response.json();
        })
        .then(data => {
            topics = data;
            renderTopics();
        })
        .catch(error => {
            console.error("Error fetching topics:", error);
        });

    // Add new topic
    newTopicForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!topicTitle.value.trim() || !topicContent.value.trim()) {
            alert("Please fill out both title and content.");
            return;
        }
        const newTopic = {
            title: topicTitle.value,
            content: topicContent.value,
            user: username,
            date: new Date().toLocaleString("en-GB", { timeZone: "UTC" }),
        };
        topics.push(newTopic);
        topicTitle.value = "";
        topicContent.value = "";
        renderTopics();
    });

    // Delete topic
    window.deleteTopic = function (index) {
        topics.splice(index, 1);
        renderTopics();
    };

    // View topic
    window.viewTopic = function (index) {
        alert(`Viewing Topic:\n\n${topics[index].title}\n\n${topics[index].content}`);
    };
});
