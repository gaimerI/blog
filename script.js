document.addEventListener("DOMContentLoaded", () => {
    const topics = [];
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
                <h3>${topic.title} by ${topic.user}</h3>
                <p>${topic.content}</p>
                <button onclick="viewTopic(${index})">View Topic</button>
                <button onclick="deleteTopic(${index})">Delete</button>
                <aside>Posted on ${topic.date}</aside>
            `;
            topicList.appendChild(li);
        });
    }

    // Add new topic
    newTopicForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTopic = {
            title: topicTitle.value,
            content: topicContent.value,
            user: username,
            date: new Date().toLocaleString(),
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

    // View topic (for future expansion)
    window.viewTopic = function (index) {
        alert(`Viewing Topic:\n\n${topics[index].title}\n\n${topics[index].content}`);
    };
});
