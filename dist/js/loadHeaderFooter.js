document.addEventListener("DOMContentLoaded", () => {
  fetch("../html/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;
      const script = document.createElement("script");
      script.src = "../js/navbar.js";
      script.type = "module";
      document.body.appendChild(script);
    });
  fetch("../html/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-container").innerHTML = data;
    });
});
