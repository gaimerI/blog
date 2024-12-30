document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById("post-container");

    // Fetch posts from posts.json
    fetch("posts.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch posts.");
            }
            return response.json();
        })
        .then(posts => {
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("Error loading posts:", error);
            postContainer.innerHTML = "<p>Failed to load posts.</p>";
        });
});

// Function to create a post element
function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const title = document.createElement("h2");
    title.textContent = post.title;

    const author = document.createElement("p");
    author.textContent = `By: ${post.author}`;

    const content = document.createElement("p");
    content.textContent = post.content;

    postDiv.appendChild(title);
    postDiv.appendChild(author);
    postDiv.appendChild(content);

    return postDiv;
}
