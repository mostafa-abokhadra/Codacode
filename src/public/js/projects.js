const postsContainer = document.getElementById('posts-container');

let posts;
let user;
let pending;

if (postsContainer.dataset.user) 
  user = JSON.parse(postsContainer.dataset.user)
if (postsContainer.dataset.pending) 
  pending = JSON.parse(postsContainer.dataset.pending)

if (postsContainer) {
    posts = JSON.parse(postsContainer.dataset.posts)
    if (posts.length === 0) {
      const noProjects = document.getElementById('no-projects')
      noProjects.classList.remove('hidden')
    } else {
      document.addEventListener("DOMContentLoaded", () => {
          for (let i =0 ; i < posts.length ; i++) {
              posts[i].createdAt = posts[i].createdAt.split('T')
              const post = generatePost(posts[i]);
              postsContainer.appendChild(post);
          }});
    }
}

if (user) {
  document.querySelectorAll('.auth-btn').forEach((btn) => {
    btn.classList.add('hidden')
  })
  document.querySelectorAll('.mobile-auth').forEach((btn) => {
    btn.classList.add('hidden')
  })
}

function createApplyButton(role) {
    // Determine if the button should be disabled
      const isDisabled = !pending.pending.some(req => req.role_id === role.id);
      const applyButton = `
          <button
            id="apply"
            ${isDisabled ? 'disabled' : ''}
            roleId="${role.id}"
            class="apply-btn bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            Apply
          </button>
      `;
      return applyButton
};


const githubAuthPopup = document.getElementById("github-auth-popup");
const closeGithubPopup = document.getElementById("close-github-popup");
closeGithubPopup.addEventListener('click', (e) => {
  githubAuthPopup.classList.add('hidden')
})
  function generatePost(postData) {
    const postCard = document.createElement("div");
    postCard.className = "bg-white p-4 rounded-lg shadow-md mb-4";
    postCard.setAttribute('postId',`${postData.id}`)
    postCard.innerHTML = `
      <div class="flex items-center justify-between">
        <a href="#" class="flex items-center space-x-4">
          <img
            src="${postData.user.profile.image}"
            alt="Profile"
            class="w-12 h-12 rounded-full">
          <div>
            <p class="text-lg font-semibold">${postData.user.fullName}</p>
            <p class="text-sm text-gray-500">${postData.createdAt[0]}</p>
          </div>
        </a>
        <button class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>
      <h2 class="text-xl font-bold mt-4">${postData.title}</h2>
      <p class="text-gray-600 mt-2">${postData.description}</p>
      <h2 class="text-xl font-bold mt-4">Roles</h2>
      <div class="mt-4 space-y-2">
      ${postData.roles
        .map(
          (role) => `
          <div id="role" class="flex items-center justify-between bg-gray-100 p-2 rounded-md">
            <p style="font-weight: bold;">${role.position}</p>
            <button
              id="apply"
              roleId="${role.id}"
              ${pending ? (pending.pending.some((req)=>req.role_id == role.id)? 'disabled' : ''): ''}
              class="apply-btn bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              postId="${postData.id}"
              >
              Apply
            </button>
          </div>
        `
        ).join("")}
      </div>
      <h2 class="text-xl font-bold mt-4">GitHub Repo</h2>
      <div class="mt-4">
        <a href="${postData.repo}" class="text-green-600 underline hover:text-green-700">
          Repository Link
        </a>
      </div>
    
    `;

    const applyButtons = postCard.querySelectorAll(".apply-btn");
    applyButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          if (!user)
            window.location.href = "/auth/signup"
          else if (!user.GitHub) {
            githubAuthPopup.classList.remove('hidden')
          } else {
            let userPosts = await fetch(`/user/${user.id}/posts`)
            if (!userPosts.ok) {
              console.error("can't fetch user posts")
              showErrorPopup()
            } else 
              userPosts = await userPosts.json()
            let flag = userPosts.posts.some((post) =>{return post.id === Number(btn.attributes.postId.value)})
            if (flag)
              myPostFunnyMessage.classList.remove('hidden')
            else {
              let res = await fetch(
                `/user/${user.id}/posts/${btn.attributes.postId.value}/roles/${btn.attributes.roleId.value}`,
                {method: 'post'}
              )
              if (!res.ok)
                showErrorPopup()
              else {
                const data = await res.json()
                btn.setAttribute('requestId', `${data.request.id}`)
                btn.disabled = true
                applySuccessPopup.style.display = "flex"
              }
            } 
          }
        } catch(error) {
          console.error(error)
        }
      });
    });
    return postCard;
  }
//
const createNewProjectBtn = document.getElementById('create-new-project')
const createProjectModal = document.getElementById("create-project-modal")
createNewProjectBtn.addEventListener('click', (event) => {
  if (!user) {
    window.location.href = '/auth/login'
  } else if (!user.GitHub) {
    githubAuthPopup.classList.remove('hidden')
  } else {
    createProjectModal.style.display = 'block'
  }
})

const closeProjectModal = document.getElementById("close-project-modal");
closeProjectModal.addEventListener("click", () => {
  createProjectModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === createProjectModal) {
    createProjectModal.style.display = "none";
  }
});

const rolesContainer = document.getElementById("roles-container");
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


const projectForm = document.getElementById("project-form");

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
function createErrorElement(error) {
  const infoMessage = document.createElement('small')
  infoMessage.textContent = error.msg
  infoMessage.style = "color: red; margin-top: 3px"
  infoMessage.className = 'error-message';
  return infoMessage
}

async function createPost(postData) {
  try {
    const response = await sendPostData(postData)
    if (response) {
      await createProjectFromPost(response)
    } else {
      console.error('an error occured while creating a post')
    }
  } catch(error) {
    console.error('an error', error)
  }
}
async function sendPostData(postData) {
  try {
    const res = await fetch(`/user/${user.id}/posts`, {
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

async function createProjectFromPost(postCreationResponse) {
  try {
    const response = await fetch(
      `/user/${user.id}/posts/${postCreationResponse.post.id}/project`, {
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
const sucessPopup = document.getElementById('form-success-popup');
const closeSuccessPopup = document.getElementById('close-success-popup')

closeSuccessPopup.addEventListener('click', async function closeSuccessPopup() {
  sucessPopup.style.transition = 'opacity 0.5s';
  sucessPopup.style.opacity = '0';
  await new Promise((resolve) => setTimeout(resolve, 500));
  sucessPopup.style.display = 'none';
})
const serverErrorPopup = document.getElementById('server-error-poupup')
function showErrorPopup() {
  serverErrorPopup.classList.remove('hidden');
}

const closeServerErrorPopup = document.getElementById('close-server-error')
closeServerErrorPopup.addEventListener('click', (e) => {
  serverErrorPopup.classList.add('hidden');
})

const applySuccessPopup = document.getElementById('apply-success-feedback')
document.getElementById('close-apply-success-popup').addEventListener('click', (e) => {
  applySuccessPopup.style.display = "none"
})

const closeFunnyMessage = document.getElementById('close-funny-messsage')
const myPostFunnyMessage = document.getElementById('my-post-funny-feedback')
closeFunnyMessage.addEventListener('click', (e) => {
  myPostFunnyMessage.classList.add("hidden")
})