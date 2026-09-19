
const classOptions = [
  { id: "gentle", name: "Gentle Yoga", description: "A slower-paced class focused on comfortable stretching, breathing, balance, and mobility.", bestFor: "Beginners and students who prefer a calm pace." },
  { id: "vinyasa", name: "Vinyasa Yoga", description: "A flowing class that connects movement with breathing and offers modifications.", bestFor: "Students who enjoy continuous movement." },
  { id: "restorative", name: "Restorative Yoga", description: "A quiet practice using supported poses and relaxation techniques.", bestFor: "Students looking for stress relief and rest." }
];

const storageKeys = {
  preferredClass: "riverbendPreferredClass",
  visitorEmail: "riverbendVisitorEmail"
};

function findClass(classId) {
  return classOptions.find(item => item.id === classId);
}

function renderClassChoice(classId, restored = false) {
  const result = document.querySelector("#class-result");
  if (!result) return;
  const selected = findClass(classId);
  if (!selected) {
    result.innerHTML = "<p>Select a class to see a recommendation.</p>";
    return;
  }
  result.innerHTML = `
    <h3>${restored ? "Welcome back - your saved class:" : "Your class choice:"} ${selected.name}</h3>
    <p>${selected.description}</p>
    <p><strong>Good fit:</strong> ${selected.bestFor}</p>
  `;
}

function saveClassChoice(classId) {
  localStorage.setItem(storageKeys.preferredClass, classId);
}

function loadSavedClassChoice() {
  const selector = document.querySelector("#class-preference");
  if (!selector) return;
  const saved = localStorage.getItem(storageKeys.preferredClass);
  if (saved && findClass(saved)) {
    selector.value = saved;
    renderClassChoice(saved, true);
  }
}

function setupClassSelector() {
  const selector = document.querySelector("#class-preference");
  if (!selector) return;
  selector.addEventListener("change", () => {
    const value = selector.value;
    if (!value) {
      localStorage.removeItem(storageKeys.preferredClass);
      renderClassChoice("");
      return;
    }
    saveClassChoice(value);
    renderClassChoice(value);
  });
  loadSavedClassChoice();
}

function showError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  if (error) error.textContent = message;
  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  const error = document.querySelector(`#${field.id}-error`);
  if (error) error.textContent = "";
  field.removeAttribute("aria-invalid");
}

function validateRequestForm(event) {
  const form = event.currentTarget;
  const name = form.querySelector("#name");
  const email = form.querySelector("#email");
  const message = form.querySelector("#message");
  let valid = true;

  [name, email, message].forEach(clearError);

  if (name.value.trim().length < 2) {
    showError(name, "Please enter at least 2 characters for your name.");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showError(email, "Please enter a valid email address, such as name@example.com.");
    valid = false;
  }

  if (message.value.trim().length < 10) {
    showError(message, "Please enter a message with at least 10 characters.");
    valid = false;
  }

  if (!valid) {
    event.preventDefault();
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  localStorage.setItem(storageKeys.visitorEmail, email.value.trim());
  event.preventDefault();
  const status = document.querySelector("#form-status");
  if (status) status.textContent = "Thanks! Your request passed validation and is ready to send.";
}

function loadSavedEmail() {
  const email = document.querySelector("#email");
  if (!email) return;
  const savedEmail = localStorage.getItem(storageKeys.visitorEmail);
  if (savedEmail && !email.value) email.value = savedEmail;
}

function setupFormValidation() {
  const form = document.querySelector("#request-form");
  if (!form) return;
  form.addEventListener("submit", validateRequestForm);
  loadSavedEmail();
}

document.addEventListener("DOMContentLoaded", () => {
  setupClassSelector();
  setupFormValidation();
});
