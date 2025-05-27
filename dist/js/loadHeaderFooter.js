document.addEventListener("DOMContentLoaded", () => {
  fetch("../html/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      const navbarScript = document.createElement("script");
      navbarScript.type = "module";
      navbarScript.src = "../js/navbar.js";
      document.body.appendChild(navbarScript);
      const authScript = document.createElement("script");
      authScript.type = "module";
      authScript.src = "../js/auth.js";
      document.body.appendChild(authScript);
    });

  fetch("../html/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
    });
});

//=============================================================================
// Scroll to top 
let span = document.querySelector(".up");

window.onscroll = function () {
  this.scrollY >= 500 ? span.classList.add("show") : span.classList.remove("show");
};

span.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
//========================================================================