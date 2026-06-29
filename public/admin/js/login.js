const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value;
    const password = form.password.value;

    const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    if (response.ok) {
        window.location.href = "/admin/dashboard";
    } else {
        alert("Invalid username or password.");
    }
});