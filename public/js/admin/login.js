const form = document.getElementById("loginForm");
const output = document.getElementById('output-text');
const spinner = document.getElementById('spinner');

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    spinner.classList.remove('hidden');
    output.classList.remove('red');
    output.classList.remove('green');
    output.innerText = "Processing... Please Wait";


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

    spinner.classList.add('hidden');
    if (response.ok) {
        output.innerText = "Successful! You will be redirected shortly!";
        output.classList.add('green');
        window.location.href = "/admin/dashboard";
    } else {
        output.innerText = "Your username or password is incorrect. Please try again.";
        output.classList.add('red');
    }
});