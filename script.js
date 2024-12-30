// Post and Reply Data
let posts = [];

// Create a new post
function createPost() {
    const content = document.getElementById('postContent').value.trim();
    if (content) {
        const post = {
            id: posts.length + 1,
            content: content,
            replies: []
        };
        posts.push(post);
        document.getElementById('postContent').value = '';  // Clear the post input
        renderPosts();
    }
}

// Add a reply to a post
function addReply(postId) {
    const replyContent = document.getElementById(`replyContent-${postId}`).value.trim();
    if (replyContent) {
        const reply = {
            id: posts.find(post => post.id === postId).replies.length + 1,
            content: replyContent
        };
        const post = posts.find(post => post.id === postId);
        post.replies.push(reply);
        document.getElementById(`replyContent-${postId}`).value = '';  // Clear the reply input
        renderPosts();
    }
}

// Render the posts and their replies
function renderPosts() {
    const postsSection = document.getElementById('postsSection');
    postsSection.innerHTML = '';  // Clear the section

    posts.forEach(post => {
        // Create a post element
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        const postContent = document.createElement('div');
        postContent.classList.add('content');
        postContent.textContent = post.content;

        const replyForm = document.createElement('div');
        replyForm.classList.add('reply-form');
        const replyInput = document.createElement('textarea');
        replyInput.id = `replyContent-${post.id}`;
        replyInput.classList.add('form-input');
        replyInput.rows = 3;
        replyInput.placeholder = 'Write a reply...';
        const replyButton = document.createElement('button');
        replyButton.classList.add('submit-btn');
        replyButton.textContent = 'Reply';
        replyButton.onclick = () => addReply(post.id);

        replyForm.appendChild(replyInput);
        replyForm.appendChild(replyButton);

        // Create a container for replies
        const repliesSection = document.createElement('div');
        repliesSection.classList.add('replies');
        post.replies.forEach(reply => {
            const replyElement = document.createElement('div');
            replyElement.classList.add('reply');
            const replyContent = document.createElement('div');
            replyContent.classList.add('content');
            replyContent.textContent = reply.content;
            replyElement.appendChild(replyContent);
            repliesSection.appendChild(replyElement);
        });

        // Append the post content, reply form, and replies to the post
        postElement.appendChild(postContent);
        postElement.appendChild(replyForm);
        postElement.appendChild(repliesSection);

        // Append the post to the posts section
        postsSection.appendChild(postElement);
    });
}
