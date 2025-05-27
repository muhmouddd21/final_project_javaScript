document.addEventListener("DOMContentLoaded", function () {
  const accordionButtons = document.querySelectorAll(".faq-accordion-button");

  accordionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");

      const content = this.nextElementSibling;
      content.classList.toggle("active");

      if (this.classList.contains("active")) {
        accordionButtons.forEach((otherButton) => {
          if (otherButton !== this) {
            otherButton.classList.remove("active");
            otherButton.nextElementSibling.classList.remove("active");
          }
        });
      }
    });
  });
});
