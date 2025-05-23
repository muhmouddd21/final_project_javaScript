import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// Utils
function showMessage(message, isError = true) {
  const messageBox = document.getElementById("auth-message");
  if (!messageBox) return;

  messageBox.textContent = message;
  messageBox.className = "auth-message " + (isError ? "error" : "success");
  messageBox.style.display = "block";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const provider = new GoogleAuthProvider();

// Handle Register
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("EmailInputSign").value.trim();
    const password = document.getElementById("passwordInputSign").value;

    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {
        displayName: `${firstName} ${lastName}`,
      });

      window.location.href = "loginForm.html";
      /*showMessage("Registration successful! Please log in.", false);*/
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === "auth/email-already-in-use") {
        showMessage("This email is already registered. Please log in.");
      } else {
        showMessage("Registration failed. Try again.");
      }
    }
  });

  document
    .getElementById("google-signup")
    .addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = result._tokenResponse?.isNewUser;

        if (!isNewUser) {
          showMessage("Account already exists. Please log in.");
          window.location.href = "loginForm.html";
        } else {
          window.location.href = "loginForm.html";
        }
      } catch (error) {
        console.error("Google Signup Error:", error);
        showMessage("Google sign-up failed. Try again.");
      }
    });
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailInputLog").value.trim();
    const password = document.getElementById("passwordInputLog").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        showMessage("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        showMessage("Invalid email format.");
      } else {
        showMessage("Login failed. Try again.");
      }
    }
  });

  document
    .getElementById("google-login")
    .addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        window.location.href = "index.html";
      } catch (error) {
        console.error("Google Login Error:", error);
        showMessage("Google login failed. Try again.");
      }
    });

  document.getElementById("reset").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("emailInputLog").value.trim();

    if (!email) {
      showMessage("Enter your email to reset password.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset link sent.", false);
    } catch (error) {
      console.error("Reset error:", error);
      showMessage("Error sending reset link.");
    }
  });
}

const wrapper = document.getElementById("dropdown-wrapper");
const userIcon = document.getElementById("user-icon-wrapper");
const dropdown = document.getElementById("dropdown-content");
const logoutBtn = document.getElementById("logout-btn");

// Toggle dropdown or redirect
if (userIcon) {
  userIcon.addEventListener("click", (e) => {
    e.preventDefault();
    wrapper.classList.contains("logged-in")
      ? dropdown.classList.toggle("show")
      : (window.location.href = "loginForm.html");
  });
}

// Auth state handler
if (wrapper) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      wrapper.classList.add("logged-in");
      if (userIcon) userIcon.href = "#";
    } else {
      wrapper.classList.remove("logged-in");
      if (userIcon) userIcon.href = "loginForm.html";
      if (dropdown) dropdown.classList.remove("show");
    }
  });
}

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => (window.location.href = "index.html"))
      .catch(console.error);
  });
}

document.addEventListener("click", (e) => {
  if (wrapper && !wrapper.contains(e.target) && dropdown) {
    dropdown.classList.remove("show");
  }
});
