const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
let user = document.getElementById('username').attributes.user.value
user = JSON.parse(user)

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

const createBtn = document.querySelector(".dashboard-card button");
const modal = document.getElementById("createProjectModal");
const closeModalBtn = document.getElementById("closeModal");
const rolesContainer = document.getElementById("rolesContainer");

const GithubAuthBtn = document.getElementById("githubAuthPopup");
const openGithubAuthPopupButton = document.getElementById("openPopup");
const closeGithubAuhtPopupButton = document.getElementById("closePopup");

// Open the popup
openGithubAuthPopupButton.addEventListener("click", () => {
  GithubAuthBtn.classList.remove("hidden");
});

// Close the popup
closeGithubAuhtPopupButton.addEventListener("click", () => {
  GithubAuthBtn.classList.add("hidden");
});

// Open Modal
createBtn.addEventListener("click", () => {
  if (!user.GitHub) {
    openGithubAuthPopupButton.click()
  } else {
    modal.style.display = "block";
  }
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

  const title = document.getElementById("title").value
  const description = document.getElementById("description").value
  const langPref = document.getElementById('langPref').value
  const yourRole = document.getElementById("yourRole").value
  const repo = document.getElementById("repoLink").value
  const roles = JSON.stringify(rolesData)

  const postData = {
    title: title,
    description: description,
    langPref: langPref,
    yourRole: yourRole,
    repo: repo,
    roles: roles
  }
  createPost(postData)
});

async function createPost (dic) {
  try {
    const formData = new URLSearchParams(dic).toString();
    let res = await fetch(`/${user.fullName}/posts`, {
      method: 'post',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    res = await res.json()
    // if (res.errors[0].msg == "Repo URL Already Belong to Another Project")
    // if (res.errors[0].msg == "Repo URL Already Belong to Another Project")
    // console.log(res)
    // console.log("the res", res)

    // if 200 close form and popup created successfully
  } catch(error) {
    console.error("the errro", error)
  }
}
const startCollaboration = document.getElementById("startCollaboration")
startCollaboration.addEventListener('click', (e) => {
  window.location.href = '/projects'
})
