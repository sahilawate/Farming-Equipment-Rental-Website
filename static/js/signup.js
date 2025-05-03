document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();  

    let formData = new FormData(this);

    fetch("/signup", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: data.status === "success" ? "Success!" : "Oops!",
            text: data.message,
            icon: data.status,
            timer: 3500,
            showConfirmButton: data.status !== "success",
        }).then(() => {
            if (data.status === "success") {
                window.location.href = "/login";  // Redirect to login after signup
            }
        });
    })
    .catch(error => console.error("Error:", error));
});
