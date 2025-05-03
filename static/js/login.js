document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();  

    let formData = new FormData(this);

    fetch("/login", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: data.status === "success" ? "Welcome!" : "Oops!",
            text: data.message,
            icon: data.status,
            timer: 3500, // Auto close after 3.5s
            showConfirmButton: data.status !== "success", // Show button for errors
        }).then(() => {
            if (data.status === "success") {
                window.location.href = "/";  // Redirect to home on success
            }
        });
    })
    .catch(error => console.error("Error:", error));
});
