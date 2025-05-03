document.addEventListener("DOMContentLoaded", function() {
    fetch('/auth/user/profile')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                document.getElementById("nav-links").innerHTML = `
                    <li><a href="#" id="profile-icon">👤 ${data.user_name}</a></li>
                `;
            } else {
                document.getElementById("nav-links").innerHTML = `
                    <li><a href="/auth/login">Login</a></li>
                    <li><a href="/auth/signup">Signup</a></li>
                `;
            }
        });

    // Sidebar toggle logic
    document.addEventListener("click", function(event) {
        if (event.target.id === "profile-icon") {
            document.getElementById("sidebar").classList.toggle("active");
        }
    });
});
