const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

const createBtn = document.querySelector(".dashboard-card button");
const modal = document.getElementById("createProjectModal");
const closeModalBtn = document.getElementById("closeModal");
const rolesContainer = document.getElementById("rolesContainer");

// Open Modal
createBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close Modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close Modal on Outside Click
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Add or Remove Role Input Fields
rolesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-role-btn")) {
    const roleInputDiv = document.createElement("div");
    roleInputDiv.classList.add("role-input");
    roleInputDiv.innerHTML = `
      <input type="text" name="role" class="role-field" placeholder="Enter role needed" />
      <input type="number" name="numberNeeded" class="number-needed" placeholder="Number Needed" min="1" />
      <button type="button" class="add-role-btn">+</button>
      <button type="button" class="remove-role-btn">-</button>
    `;
    rolesContainer.appendChild(roleInputDiv);
  }

  if (e.target.classList.contains("remove-role-btn")) {
    const roleInput = e.target.closest(".role-input");
    if (rolesContainer.children.length > 1) {
      rolesContainer.removeChild(roleInput);
    }
  }
});

// Format the roles data on form submission
const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", (e) => {
  const roleFields = document.querySelectorAll(".role-field");
  const numberFields = document.querySelectorAll(".number-needed");
  const rolesData = [];

  roleFields.forEach((roleField, index) => {
    const role = roleField.value;
    const numberNeeded = numberFields[index].value;
    if (role && numberNeeded) {
      rolesData.push({ role, numberNeeded });
    }
  });

  // Replace the existing inputs with a hidden input containing the roles JSON
  const rolesInput = document.createElement("input");
  rolesInput.type = "hidden";
  rolesInput.name = "roles";
  rolesInput.value = JSON.stringify(rolesData);

  projectForm.appendChild(rolesInput);
});

const startCollaboration = document.getElementById("startCollaboration")
startCollaboration.addEventListener('click', (e) => {
  window.location.href = '/projects'
})