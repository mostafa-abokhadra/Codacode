const logoutBtns = document.querySelectorAll('.logout-link')
logoutBtns.forEach((logoutBtn) => {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    document.getElementById('logout-form').submit()
  })
})

const portfolioLinks = document.querySelectorAll('.portfolio-link')
portfolioLinks.forEach((portfolioLink) => {
  portfolioLink.addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = "/portofolio"
  })
})
const serverErrorPopup = document.getElementById('server-error-popup')
let user;
try {
  const userElement = document.getElementById('username')
  if (userElement){
    if (userElement.dataset.user) {
      user = userElement.dataset.user
      user = JSON.parse(user)
    }
  }
} catch(error) {
    console.log(error)
}

const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

const createProjectBtn = document.getElementById("create-project-btn");
const createProjectModal = document.getElementById("create-project-modal");
const closeProjectModal = document.getElementById("close-project-modal");
const rolesContainer = document.getElementById("roles-container");

if (createProjectBtn) {
createProjectBtn.addEventListener("click", () => {
  if (!user.GitHub) {
    openGithubAuthPopupButton.click()
  } else {
    createProjectModal.style.display = "block";
  }
});
}
if (closeProjectModal) {
  closeProjectModal.addEventListener("click", () => {
    createProjectModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === createProjectModal) {
    createProjectModal.style.display = "none";
  }
});
if(rolesContainer) {
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
}
const projectForm = document.getElementById("project-form");

if (projectForm) {
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

    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const langPref = document.getElementById('lang-pref').value
    const yourRole = document.getElementById("your-role").value
    const repo = document.getElementById("repo-link").value
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
}
async function createPost(postData) {
  try {
    const response = await sendPostData(postData)
    if (response) {
      await createProjectFromPost(response)
    } else {
      console.error('an error occured while creating a post')
      // createProjectModal.style.display = "none"
      // showErrorPopup()
    }
  } catch(error) {
    console.error('an error', error)
  }
}
async function sendPostData(postData) {
  try {
    const res = await fetch(`/users/${user.id}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await res.json()
    if (data.errors) {
      return createErrorsFeedback(data.errors)
    }
    return data
  } catch(error) {
    console.log(error)
  }
}

function createErrorsFeedback(errors) {

  document.querySelectorAll('.error-message').forEach((msg) => msg.remove());

  const repoLinkDiv = document.getElementsByClassName('repo-link-div')[0]
  const titleDiv = document.getElementsByClassName('title-div')[0]
  const descriptionDiv = document.getElementsByClassName(' description-div')[0]
  const langPrefDiv = document.getElementsByClassName("lang-pref-div")[0]
  const yourRoleDiv = document.getElementsByClassName('your-role-div')[0]
  const roleInputDiv = document.getElementsByClassName('role-input-div')[0]

  for (let i = 0; i < errors.length; i++) {
    const infoMessage = createErrorElement(errors[i].msg)
    if (errors[i].path === 'repo') {
      validateDivExistence(repoLinkDiv, infoMessage)
    } else if (errors[i].path === 'title') { 
      validateDivExistence(titleDiv, infoMessage)
    } else if (errors[i].path === 'description') {
      validateDivExistence(descriptionDiv, infoMessage)
    } else if (errors[i].path === 'langPref') {
      validateDivExistence(langPrefDiv, infoMessage)
    } else if (errors[i].path === 'yourRole') {
      validateDivExistence(yourRoleDiv, infoMessage)
    } else if (errors[i].path === 'roles' ) {
      validateDivExistence(roleInputDiv, infoMessage)
    }
  }
  return 0
}
function createErrorElement(msg) {
  const infoMessage = document.createElement('small')
  infoMessage.textContent = msg
  infoMessage.style = "color: red; margin-top: 3px; display: flex"
  infoMessage.className = 'error-message';
  return infoMessage
}
async function validateDivExistence(elementDiv, infoMessage) {
  if (elementDiv) {
    elementDiv.appendChild(infoMessage)
  } else {
    console.error("Element not found.");
  }
}

const successCreationPopup = document.getElementById('success-post-creation-feedback')
async function createProjectFromPost(postCreationResponse) {
  try {
    const response = await fetch(`/user/${user.id}/posts/${postCreationResponse.post.id}/project`, {
      method: 'POST'
    })
    const data = await response.json()
    if (!response.ok) {
      showErrorPopup()
    } else {
      closeProjectModal.click()
      successCreationPopup.classList.remove('hidden')
    }
  } catch(error) {
    console.log('an error', error)
  }
}

const startCollaboration = document.getElementById("start-collaboration")
if (startCollaboration) {
  startCollaboration.addEventListener('click', (e) => {
    window.location.href = '/projects'
  })
}

const closeSuccessPopupBtn = document.getElementById('close-success-popoup-btn')
if (closeSuccessPopupBtn) {
  closeSuccessPopupBtn.addEventListener('click', async (e) => {
    successCreationPopup.style.transition = 'opacity 0.5s';
    successCreationPopup.style.opacity = '0';
    await new Promise((resolve) => setTimeout(resolve, 500));
    successCreationPopup.style.display = 'none';
  })
}

function showErrorPopup() {
  serverErrorPopup.classList.remove('hidden');

}
const closeServerErrorPopup = document.getElementById('close-server-error-popoup')
if (closeServerErrorPopup) {
  closeServerErrorPopup.addEventListener('click', (e) => {
    serverErrorPopup.classList.add('hidden');
  })
}
const githubAuthPopup = document.getElementById("github-auth-popup");
const openGithubAuthPopupButton = document.getElementById("github-auth-popup-btn");
const closeGithubAuhtPopupButton = document.getElementById("close-github-auth-popup-btn");

if (openGithubAuthPopupButton) {
  openGithubAuthPopupButton.addEventListener("click", () => {
    githubAuthPopup.classList.remove("hidden");
  });
}
if (closeGithubAuhtPopupButton) {
  closeGithubAuhtPopupButton.addEventListener("click", () => {
    githubAuthPopup.classList.add("hidden");
  });
}
