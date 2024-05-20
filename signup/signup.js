const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const confirm_password_toggle = document.getElementById(
  "confirm-password-toggle"
);

passwordToggle.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

confirm_password_toggle.addEventListener("click", function () {
  if (confirm_password.type === "password") {
    confirm_password.type = "text";
  } else {
    confirm_password.type = "password";
  }
});

function validatePassword() {
  if (password.value !== confirm_password.value) {
    confirm_password.setCustomValidity("Passwords do not match");
  } else {
    confirm_password.setCustomValidity("");
  }
}


password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".register-form form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const existingErrors = form.querySelectorAll(".error-message");
    existingErrors.forEach((error) => error.remove());

    // Get form data
    const formData = new FormData(form);

    // Convert FormData to JSON object
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    const phoneNumberInput = formData.get("phone_number");
    if (!isValidTanzanianPhoneNumber(phoneNumberInput)) {
      const phoneNumberError = document.createElement("div");
      phoneNumberError.textContent = "* Please enter a valid phone number";
      phoneNumberError.classList.add("error-message");
      phoneNumberError.style.color = "red";
      phoneNumberError.style.paddingBottom = "5px";
      const phoneNumberField = form.querySelector("#phone_number");
      phoneNumberField.parentNode.appendChild(phoneNumberError);
      return;
    }
    // Make POST request to Django backend
    axios
      .post(
        "https://papershub-prod-ee9f6b8e1268.herokuapp.com/auth/users/",
        jsonData
      )
      .then(function (response) {
        console.log("Data sent successfully");
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "Account Made Succesfully, Please Check Your e-mail to Activate Your Account!";
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "green";
        errorMessage.style.paddingBottom = "20px";
        form.insertBefore(errorMessage, form.firstChild);
        // Handle success response, maybe redirect user or show a success message
        form.reset();
        setTimeout(() => {
          const successMessage = document.querySelector(".success-message");
          if (successMessage) {
            successMessage.remove();
          }
        }, 5000);
      })

      .catch(function (error) {
        console.error("Error sending data:", error);
        // Handle error response, append error messages below specific input fields
        if (error.response.status === 400 && error.response.data) {
          for (const key in error.response.data) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
              const errorMessage = document.createElement("div");
              errorMessage.textContent = `* ${error.response.data[key]}`;
              errorMessage.classList.add("error-message");
              errorMessage.style.color = "red";
              errorMessage.style.paddingBottom = "5px";
              input.parentNode.appendChild(errorMessage);
            }
          }
        } else if (
          error.response.status === 400 &&
          error.response.data.phone_number
        ) {
          const errorMessage = document.createElement("div");
          errorMessage.textContent =
            "Phone number does not match the required format or already exists.";
          errorMessage.classList.add("error-message");
          errorMessage.style.color = "red";
          errorMessage.style.paddingBottom = "5px";
          input.parentNode.appendChild(errorMessage);
        }
      });
  });
});

function validateYear(input) {
  if (input.value > 5) {
    input.value = 5; // Reset the value to 5 if it exceeds the maximum
  }
}

function isValidTanzanianPhoneNumber(phoneNumber) {
  // Modify this function based on your specific phone number format requirements
  const phoneRegex = /^0\d{9}$/; // Tanzanian phone numbers start with +255 or 0, followed by 9 digits
  return phoneRegex.test(phoneNumber);
}
