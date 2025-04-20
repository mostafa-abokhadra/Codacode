// report-bug suggest-enhance

const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle('hidden')
});
document.getElementById('get-started-btn').addEventListener('click', function() {
    window.location.href = '/auth/signup'; // Redirect to sign-up page
});
