document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    

    const existingErrors = form.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      // Passwords don't match, display error message
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Passwords do not match";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.paddingBottom = "20px";
      form.insertBefore(errorMessage, form.firstChild);
      return;
    }
    if (!isStrongPassword(password)) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "Password must contain at least 8 characters with letters and numbers.";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.paddingBottom = "20px";
      form.insertBefore(errorMessage, form.firstChild);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uid");
    const token = urlParams.get("token");

    const data = JSON.stringify({ uid, token, new_password: password, re_new_password: confirmPassword });

    try {
      const response = await axios.post(
        "https://papershub-prod-ee9f6b8e1268.herokuapp.com/auth/users/reset_password_confirm/",
        data,
        {
          headers: {
            "Content-Type": "application/json", // Set the content type header
          },
          Credential: "include",
        }
      );

      // Handle the response (e.g., show a success message to the user)
      console.log(response.data);
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Password changed successfully! You can now log in.";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "green";
      errorMessage.style.paddingBottom = "20px";
      form.insertBefore(errorMessage, form.firstChild);
      form.reset(); 
    } catch (error) {
      // Handle errors (e.g., show an error message to the user)
      console.error("Error:", error.response.data);
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "Please enter the right credentials.";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.paddingBottom = "20px";
      form.insertBefore(errorMessage, form.firstChild);
    }
  });
});

function isStrongPassword(password) {
  return password.length >= 8;
}
