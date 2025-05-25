
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class on the button
            this.classList.toggle('active');
            
            // Get the accordion content
            const content = this.nextElementSibling;
            
            // Toggle active class on the content
            content.classList.toggle('active');
            
            // Optionally close other open items
            if (this.classList.contains('active')) {
                accordionButtons.forEach(otherButton => {
                    if (otherButton !== this) {
                        otherButton.classList.remove('active');
                        otherButton.nextElementSibling.classList.remove('active');
                    }
                });
            }
        });
    });
    });
