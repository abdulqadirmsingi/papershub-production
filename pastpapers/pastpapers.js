document.addEventListener("DOMContentLoaded", function () {
  // Select the papers to be blurred
  var blurredPapers = document.querySelectorAll(".blurred");

  // Disable download buttons and remove link functionality for blurred papers
  blurredPapers.forEach(function (paper) {
    var downloadButton = paper.querySelector(".download-button");
    var paperLink = paper.querySelector("a");
    if (downloadButton && paperLink) {
      downloadButton.disabled = true;
      paperLink.removeAttribute("href");
      downloadButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default button behavior
      });
    }
  });

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

  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  if (!accessToken || !refreshToken) {
    window.location.href = "../login";
  }
  const fetchUserSubscriptionStatus = async () => {
    try {
      const response = await fetch("https://papershub-prod-ee9f6b8e1268.herokuapp.com/auth/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      const userData = await response.json();
      return userData.subscribed;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return false;
    }
  };
  const displayPastPapers = async (courseId) => {
    const isSubscribed = await fetchUserSubscriptionStatus();

    // Make a fetch request to the backend API using the provided course ID
    fetch(`https://papershub-prod-ee9f6b8e1268.herokuapp.com/papers/Course/${courseId}/paper/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming data is an array of past papers for the given course
        // Modify the code below to display the past papers as per your UI design
        console.log(data);
        data
          .filter((course) => course.course === courseId)
          .forEach((paper) => {
            const papersContainer = document.querySelector(".papers-content");

            const paperDiv = document.createElement("div");
            paperDiv.classList.add("paper");

            const paperText = document.createElement("div");
            paperText.classList.add("paper-text");
            const paperLink = document.createElement("a");
            paperLink.href = paper.file; // Assuming fileUrl is provided in the data
            paperLink.target = "_blank";
            paperLink.innerHTML = `<img src="../images/pdf.png" alt="PDF Image" /><span>${paper.title}</span>`;
            paperText.appendChild(paperLink);

            const paperButton = document.createElement("div");
            paperButton.classList.add("paper-button");
            const downloadLink = document.createElement("a");
            downloadLink.href = paper.file; // Assuming fileUrl is provided in the data
            downloadLink.download = paper.title; // Assuming fileName is provided in the data
            const downloadButton = document.createElement("button");
            downloadButton.classList.add("download-button");
            downloadButton.textContent = "Download";
            downloadLink.appendChild(downloadButton);
            paperButton.appendChild(downloadLink);

            paperDiv.appendChild(paperText);
            paperDiv.appendChild(paperButton);
            papersContainer.appendChild(paperDiv);

            if (!paper.is_free && !isSubscribed) {
              // Apply blur effect to the paper for non-subscribed users
              paperDiv.classList.add("blurred");
              downloadButton.disabled = true;
              paperLink.removeAttribute("href");
              downloadButton.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default button behavior
              });
            } else if (paper.subscribed) {
              // Remove blur effect for subscribed users
              paperDiv.classList.remove("blurred");
              downloadButton.disabled = false;
              paperLink.href = paper.file; // Restore the link for subscribed users
            }
          });
      })

      .catch((error) => {
        console.error("Error fetching past papers:", error);
      });
  };

  // Extract the courseId from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("courseId");

  // Call displayPastPapers function with the extracted course ID
  displayPastPapers(courseId);
});
