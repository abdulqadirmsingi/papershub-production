document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgot-password-form");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const data = JSON.stringify({ email });

    try {
      const response = await axios.post(
        "https://papershub-prod-ee9f6b8e1268.herokuapp.com/auth/users/reset_password/",
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
      errorMessage.textContent =
        "Please Check Your e-mail to change your password";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "green";
      errorMessage.style.paddingBottom = "20px";
      form.insertBefore(errorMessage, form.firstChild);
      form.reset(); // Assuming your backend returns a response with relevant information
    } catch (error) {
      // Handle errors 
      if (error.response.status === 404) {
        console.error("Email not found.");
        // Display an error message to the user indicating that the email doesn't exist
        errorMessage.textContent =
          "Sorry! This email was not found! Try again.";
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red";
        errorMessage.style.paddingBottom = "20px";
        form.insertBefore(errorMessage, form.firstChild);
      } else {
        console.error("Error:", error.response.data);
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Please enter the right credentials!";
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red";
        errorMessage.style.paddingBottom = "10px";
        form.insertBefore(errorMessage, form.firstChild);
      }
    }
  });
});
