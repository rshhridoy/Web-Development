// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, remove, update, onChildAdded, onChildRemoved, onChildChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7_LclyLXUsvH8r-FLZnzuk7Wz-Avhs8Q",
    authDomain: "photobox-396fd.firebaseapp.com",
    projectId: "photobox-396fd",
    storageBucket: "photobox-396fd.appspot.com",
    messagingSenderId: "1054553324612",
    appId: "1:1054553324612:web:ca35c25684b5949e599011"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Select DOM elements
const contactForm = document.getElementById('contactForm');
const messagesContainer = document.getElementById('messagesContainer');

// Global variable to track the editing key
let editingKey = null;

// Add a single event listener for form submission
contactForm.addEventListener("submit", handleFormSubmit);

// Function to handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const name = getElementVal('name');
    const email = getElementVal('email');
    const message = getElementVal('message');

    // Validate form inputs
    if (name && email && message) {
        if (editingKey) {
            // Update the existing message in Firebase
            update(ref(database, 'contactForm/' + editingKey), {
                name: name,
                email: email,
                message: message
            })
                .then(() => {
                    console.log('Message updated successfully!');
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error updating message:', error);
                });
        } else {
            // Create a new message in Firebase
            const messageKey = Date.now().toString(); // Unique key based on timestamp
            const messageRef = ref(database, 'contactForm/' + messageKey);
            set(messageRef, {
                name: name,
                email: email,
                message: message
            })
                .then(() => {
                    console.log('Message saved successfully!');
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error saving message:', error);
                });
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Helper function to reset the form
function resetForm() {
    contactForm.reset();
    editingKey = null; // Clear the editing key
    removeExistingSaveEditButton();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = false;
}

// Function to save data to Firebase Realtime Database
function saveMessageToFirebase(name, email, message) {
    const messageKey = Date.now().toString(); // Unique key based on timestamp
    const messageRef = ref(database, 'contactForm/' + messageKey);
    return set(messageRef, {
        name: name,
        email: email,
        message: message
    });
}

// Helper function to get input values by ID
function getElementVal(id) {
    return document.getElementById(id).value.trim();
}

// Listen for new messages added to Firebase and update the DOM
const messagesRef = ref(database, 'contactForm');

onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    addMessageToDOM(key, data.name, data.email, data.message);
});

// Listen for messages removed from Firebase and update the DOM
onChildRemoved(messagesRef, (snapshot) => {
    const key = snapshot.key;
    const messageElement = document.querySelector(`[data-key="${key}"]`);
    if (messageElement) {
        messagesContainer.removeChild(messageElement);
    }
});

// Listen for messages updated in Firebase and update the DOM
onChildChanged(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    const messageElement = document.querySelector(`[data-key="${key}"]`);
    if (messageElement) {
        messageElement.querySelector('.name').innerText = `Name: ${data.name}`;
        messageElement.querySelector('.email').innerText = `Email: ${data.email}`;
        messageElement.querySelector('.message').innerText = `Message: ${data.message}`;
    }
});

// Function to add a message to the DOM
function addMessageToDOM(key, name, email, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-item');
    messageElement.setAttribute('data-key', key);
    messageElement.innerHTML = `
        <p class="name"><strong>Name:</strong> ${name}</p>
        <p class="email"><strong>Email:</strong> ${email}</p>
        <p class="message"><strong>Message:</strong> ${message}</p>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    messagesContainer.appendChild(messageElement);

    // Add event listener for the Edit button
    messageElement.querySelector('.edit-btn').addEventListener('click', () => {
        populateFormForEdit(key, name, email, message);
    });

    // Add event listener for the Delete button
    messageElement.querySelector('.delete-btn').addEventListener('click', () => {
        deleteMessage(key);
    });
}

// Function to populate the form fields for editing
function populateFormForEdit(key, name, email, message) {
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('message').value = message;

    editingKey = key; // Set the global editing key
    removeExistingSaveEditButton();

    // Scroll to the form for user convenience
    contactForm.scrollIntoView({ behavior: 'smooth' });
}

// Function to remove existing "Save Changes" button
function removeExistingSaveEditButton() {
    const existingButton = document.querySelector('.save-edit-btn');
    if (existingButton) {
        existingButton.remove(); // Remove the button to avoid duplicates
    }
}

// Function to delete a message from Firebase
function deleteMessage(key) {
    const messageRef = ref(database, 'contactForm/' + key);
    remove(messageRef)
        .then(() => {
            console.log('Message deleted from Firebase.');
        })
        .catch((error) => {
            console.error('Error deleting message from Firebase:', error);
        });
}
