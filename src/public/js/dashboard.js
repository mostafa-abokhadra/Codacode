const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
let user;
try {
  user = document.getElementById('username').attributes.user.value
  user = JSON.parse(user)
} catch(error) {
    console.log(error)
}

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

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  document.querySelectorAll('.error-message').forEach((msg) => msg.remove());
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

async function validateDivExistence(elementDiv, infoMessage) {
  if (elementDiv) {

  
      elementDiv.appendChild(infoMessage)

  } else {
    console.error("Element not found.");
  }
}

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
    if (res.errors) {
      document.querySelectorAll('.error-message').forEach((msg) => msg.remove());
      for (let i = 0; i < res.errors.length; i++) {
        const infoMessage = document.createElement('small')
        infoMessage.textContent = res.errors[i].msg
        infoMessage.style = "color: red; margin-top: 3px"
        infoMessage.className = 'error-message';
        const repoLinkDiv = document.getElementsByClassName('repoLinkDiv')[0]
        const titleDiv = document.getElementsByClassName('titleDiv')[0]
        const descriptionDiv = document.getElementsByClassName('descriptionDiv')[0]
        const langPrefDiv = document.getElementsByClassName("langPrefDiv")[0]
        const yourRoleDiv = document.getElementsByClassName('yourRoleDiv')[0]
        const roleInputDiv = document.getElementsByClassName('roleInputDiv')[0]
        if (res.errors[i].path === 'repo') {
          validateDivExistence(repoLinkDiv, infoMessage)
        } else if (res.errors[i].path === 'title') {
            const anchor = titleDiv.querySelector('a')
            const br = document.createElement('br')
            if (anchor) {
              anchor.before(infoMessage)
              infoMessage.after(br)
            }
          // validateDivExistence(titleDiv, infoMessage)
        } else if (res.errors[i].path === 'description') {
          validateDivExistence(descriptionDiv, infoMessage)
        } else if (res.errors[i].path === 'langPref') {
          validateDivExistence(langPrefDiv, infoMessage)
        } else if (res.errors[i].path === 'yourRole') {
          validateDivExistence(yourRoleDiv, infoMessage)
        } else if (res.errors[i].path === 'roles' ) {
          validateDivExistence(roleInputDiv, infoMessage)
        }
      }
    } else {
      
        // if (res.status == '500')
        //   serverErrorPopUp.click()
        // else {}
        const projectRes = await fetch(`/${user.fullName}/posts/${res.post.id}/projects`, {
          method: 'post'
        })
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          closeModalBtn.click()
          document.getElementById('formSuccessPopUp').classList.remove('hidden')
        } else {
          showErrorPopup()
        }

    }

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

async function closeSuccessPopup() {
  const popup = document.getElementById('formSuccessPopUp');

  // Add a fading animation
  popup.style.transition = 'opacity 0.5s';
  popup.style.opacity = '0';

  // Wait for the animation to complete
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Hide the popup
  popup.style.display = 'none';
}

function showErrorPopup() {
  document.getElementById('serverErrorPopup').classList.remove('hidden');
}

// Function to close the popup
function closeErrorPopup() {
  document.getElementById('serverErrorPopup').classList.add('hidden');
}

const portfolioLink = document.getElementById('portfolio-link')
console.log(portfolioLink)
portfolioLink.addEventListener('click', (event) => {
  event.preventDefault()
  window.location.href = "portofolio"
})
