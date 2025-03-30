export const registerAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/register";
export const loginAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/login";
export const userDataAuthURL = "https://gaimeri17-forumusermanagement.web.val.run/users";

export let currentUser = null;

export function registerUser() {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const profile_icon = 4;

    if (!username || !password) {
        alert("Please fill in both fields to register.");
        return;
    }

    fetch(registerAuthURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, profile_icon })
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
        alert("Error registering user: " + error);
    });
}

export function loginUser() {
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
        localStorage.setItem("loggedInUser", currentUser);
        updateAuthUI();
    })
    .catch(error => {
        console.error("Error logging in:", error);
        alert("Login failed.");
    });
}

export function logoutUser() {
    currentUser = null;
    localStorage.removeItem("loggedInUser");
    updateAuthUI();
}

export function updateAuthUI() {
    const userInfo = document.getElementById("user-info");
    if (currentUser) {
        userInfo.style.display = "block";
        document.getElementById("current-user").innerText = currentUser;
    } else {
        userInfo.style.display = "none";
        document.getElementById("current-user").innerText = "";
    }
}
