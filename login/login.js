const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("password-toggle");
const password = document.getElementById("password");

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Function to get cookie by name
const getCookie = (name) => {
  const cookieName = `${name}=`;
  const cookieArray = document.cookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

passwordToggle.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// Assuming you have an API endpoint for login (e.g., /api/login)
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const existingErrors = loginForm.querySelectorAll(".error-message");
  existingErrors.forEach((error) => error.remove());

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  try {
    // Make a POST request to your login API endpoint
    const response = await fetch(
      "https://papershub-prod-ee9f6b8e1268.herokuapp.com/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      // Assuming your API returns a token
       const { access, refresh } = await response.json();

       // Set access token cookie
       setCookie("accessToken", access, 7);
       // Set refresh token cookie
       setCookie("refreshToken", refresh, 7);


      // Redirect to resources.html
      window.location.href = "/resources.html";
    } else if (response.status === 404) {
      // Account not found
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "This Account was not found";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.paddingBottom = "20px";
      loginForm.insertBefore(errorMessage, loginForm.firstChild);
    } else {
      // Handle login failure (show error message, etc.)
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "Incorrect Credentials";
      errorMessage.classList.add("error-message");
      errorMessage.style.color = "red";
      errorMessage.style.paddingBottom = "20px";
      loginForm.insertBefore(errorMessage, loginForm.firstChild);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});
