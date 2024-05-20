// Function to parse URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get UID and token from URL parameters
var uid = getUrlParameter("uid");
var token = getUrlParameter("token");

if (uid && token) {
  fetch("https://papershub-prod-ee9f6b8e1268.herokuapp.com/auth/users/activation/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid: uid, token: token }),
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("activationMessage").textContent = "Account activated successfully!";
        window.location.href = "../login";
      } else {
        throw new Error("Activation error");
      }
    })
    .catch((error) => {
      console.error("Error activating account:", error);
      document.getElementById("activationMessage").textContent = "Error activating account";
    });
}
