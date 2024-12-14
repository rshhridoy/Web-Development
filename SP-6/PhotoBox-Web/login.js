// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7_LclyLXUsvH8r-FLZnzuk7Wz-Avhs8Q",
  authDomain: "photobox-396fd.firebaseapp.com",
  projectId: "photobox-396fd",
  storageBucket: "photobox-396fd.firebasestorage.app",
  messagingSenderId: "1054553324612",
  appId: "1:1054553324612:web:ca35c25684b5949e599011"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", function(event) {
    event.preventDefault();

    // Fetch input values when the form is submitted
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          alert("Logged in sucessfully");
          // Redirect or take other action
          window.location.href = "index.html";
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error: " + errorMessage);
      });
});
