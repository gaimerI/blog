document.addEventListener("DOMContentLoaded", () => {
    const postContainer = document.getElementById("post-container");
    const searchInput = document.getElementById("search-input");
    const sortOptions = document.getElementById("sort-options");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const postForm = document.getElementById("post-form");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    let posts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 5;

    // Fetch posts from posts.json
    fetch("posts.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch posts.");
            }
            return response.json();
        })
        .then(data => {
            posts = data.map(post => ({ ...post, likes: 0 })); // Initialize likes for posts
            filteredPosts = [...posts];
            renderPosts();
        })
        .catch(error => {
            console.error("Error loading posts:", error);
            postContainer.innerHTML = "<p>Failed to load posts.</p>";
        });

    // Render posts
    function renderPosts() {
        postContainer.innerHTML = "";
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const pagePosts = filteredPosts.slice(start, end);

        if (pagePosts.length === 0) {
            postContainer.innerHTML = "<p>No posts available.</p>";
            return;
        }

        pagePosts.forEach(post => {
            const postElement = createPostElement(post);
            postContainer.appendChild(postElement);
        });

        updatePagination();
    }

    // Update pagination buttons
    function updatePagination() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage * postsPerPage >= filteredPosts.length;
    }

    // Filter posts
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(query) || post.author.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderPosts();
    });

    // Sort posts
    sortOptions.addEventListener("change", () => {
        const sortBy = sortOptions.value;
        filteredPosts.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
        renderPosts();
    });

    // Pagination buttons
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * postsPerPage < filteredPosts.length) {
            currentPage++;
            renderPosts();
        }
    });

    // Create new post
    postForm.addEventListener("submit", event => {
        event.preventDefault();
        const newPost = {
            title: document.getElementById("post-title").value,
            author: document.getElementById("post-author").value,
            content: document.getElementById("post-content").value,
            category: document.getElementById("post-category").value,
            likes: 0
        };

        posts.push(newPost);
        filteredPosts = [...posts];
        currentPage = Math.ceil(filteredPosts.length / postsPerPage);
        renderPosts();

        postForm.reset();
    });

    // Create a post element
    function createPostElement(post) {
        const postDiv = document.createElement("div");
        postDiv.className = "post";

        const title = document.createElement("h2");
        title.textContent = post.title;

        const author = document.createElement("p");
        author.textContent = `By: ${post.author}`;

        const category = document.createElement("p");
        category.textContent = `Category: ${post.category}`;

        const content = document.createElement("p");
        content.textContent = post.content;

        const likes = document.createElement("button");
        likes.textContent = `👍 ${post.likes}`;
        likes.addEventListener("click", () => {
            post.likes++;
            renderPosts();
        });

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.addEventListener("click", () => editPost(post));

        const remove = document.createElement("button");
        remove.textContent = "Delete";
        remove.addEventListener("click", () => deletePost(post));

        const viewDetails = document.createElement("button");
        viewDetails.textContent = "View Details";
        viewDetails.addEventListener("click", () => showPostDetails(post));

        postDiv.append(title, author, category, content, likes, edit, remove, viewDetails);
        return postDiv;
    }

    // Edit post
    function editPost(post) {
        const newTitle = prompt("Edit Title:", post.title);
        const newContent = prompt("Edit Content:", post.content);
        if (newTitle) post.title = newTitle;
        if (newContent) post.content = newContent;
        renderPosts();
    }

    // Delete post
    function deletePost(post) {
        const index = posts.indexOf(post);
        if (index > -1) {
            posts.splice(index, 1);
            filteredPosts = [...posts];
            renderPosts();
        }
    }

    // Show post details
    function showPostDetails(post) {
        alert(`Title: ${post.title}\nAuthor: ${post.author}\nContent: ${post.content}`);
    }

    // Dark mode toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});
