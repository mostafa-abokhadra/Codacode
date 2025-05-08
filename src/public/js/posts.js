if (localStorage.getItem('urlUserName')) {
  const logoText = document.getElementById('logo-text')
  const signupBtn = document.getElementById('sign-up-btn')
  const loginBtn = document.getElementById('login-btn')
  const mobileSignupBtn = document.getElementById('mobile-signup-btn')
  const mobileloginBtn = document.getElementById('mobile-login-btn')
  mobileSignupBtn.classList.add('hidden')
  mobileloginBtn.classList.add('hidden')
  logoText.textContent = "Dashboard"
  signupBtn.classList.add('hidden')
  loginBtn.classList.add('hidden')
}
const posts = document.getElementById('posts-container');

let user;
try {
  user = JSON.parse(posts.attributes.user.value)
} catch(error) {
  console.error("can't parse user data", error)
}

let pending;
try {
  pending = JSON.parse(posts.attributes.pending.value)
} catch(error) {
  console.error("cant't parse user pending requests", error)
}

const createButton = async (role) => {
  try {
      const pending = await getPendingReq();
      // Determine if the button should be disabled
      const isDisabled = !pending.some(req => req.role_id === role.id);
      // Create button HTML dynamically
      const buttonHTML = `
          <button
              id="apply"
              ${isDisabled ? 'disabled' : ''}
              roleId="${role.id}"
              class="apply-btn bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
              Apply
          </button>
      `;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = buttonHTML;
      const elem = tempDiv.firstChild; // This will be the <button> element
      return elem
  } catch (error) {
      console.error("Failed to fetch pending requests:", error);
  }
};

if (posts) {
  try {
    const userPosts = JSON.parse(posts.attributes.posts.value)
    if (!userPosts) {
      const noProjects = document.getElementById('no-projects')
      noProjects.classList.remove('hidden')
    }
    document.addEventListener("DOMContentLoaded", () => {
      for (let i = userPosts.length - 1; i >= 0 ; i--) {
          userPosts[i].createdAt = userPosts[i].createdAt.split('T')
          const post = generatePost(userPosts[i]);
          posts.appendChild(post);
      }
  });
  } catch(error) {
    console.error("an error: ", error)
  }
}

// document.querySelectorAll(".apply-btn").forEach((button) => {
//     button.addEventListener("click", () => {
//       button.classList.add("hidden");
//       const cancelButton = button.nextElementSibling;
//       cancelButton.classList.remove("hidden");
//     });
//   });

// document.querySelectorAll(".cancel-btn").forEach((button) => {
//   button.addEventListener("click", () => {
//     button.classList.add("hidden");
//     const applyButton = button.previousElementSibling;
//     applyButton.classList.remove("hidden");
//   });
// });

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
        )
        .join("")}
      </div>
      <h2 class="text-xl font-bold mt-4">GitHub Repo</h2>
      <div class="mt-4">
        <a href="${postData.repo}" class="text-green-600 underline hover:text-green-700">
          Repository Link
        </a>
      </div>
      <div id="popup" class="popup-overlay">
        <div class="popup-content">
            <button class="popup-close" onclick="closePopup()">×</button>
            <h2>Success!</h2>
            <p>
                You’ve successfully applied to the role! Stay updated by tracking your 
                application status in the <a href="#" class="pending-link">Pending Requests</a> page.
            </p>
        </div>
    </div>
    <button style="display: none" id="openSuccessPopUp" onclick="openPopup()">Show Popup</button>
    
    <div id="myPostModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
      <h2 class="text-lg font-bold text-gray-800">Wait... what?! 🤔</h2>
      <p class="mt-2 text-gray-600">You can't apply to your own project!  
        That's like high-fiving yourself in public. wait for developers to apply!</p>
      <button 
        onclick="myPostApplyHandler()" 
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Got it!
      </button>
    </div>
  </div>
    `;

    // Handle Apply/Cancel button logic
    const applyButtons = postCard.querySelectorAll(".apply-btn");
    applyButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          if (!user)
            window.location.href = "/auth/signup"
          if (!user.GitHub) {
            openGithubAuthPopupButton.click()
          } else {
            let userPosts = await fetch(`${user.fullName}/posts`)
            if (!userPosts.ok)
              console.error("can't fetch user posts")
            else {
              userPosts = await userPosts.json()
            }
            let flag = userPosts.posts.some((post) =>{return post.id === Number(btn.attributes.postId.value)})
            if (flag)
              myPostApplyHandler()
            else {
              let res = await fetch(`/${user.fullName}/roles/${btn.attributes.roleId.value}`, {method: 'post'})
              // await res.json()
              res = await res.json()
              btn.setAttribute('requestId', `${res.request.id}`)
              const openPopUp = document.getElementById('openSuccessPopUp')
              openPopUp.click()
              btn.disabled = true
            } 
          }
          // if (res.status == '201') {
          //   btn.textContent = "Cancel";
          //   btn.classList.remove("bg-green-600", "hover:bg-green-700");
          //   btn.classList.add("bg-red-600", "hover:bg-red-700");
          //   btn.setAttribute('requestsId', `${res.request.id}`);
          //   btn.removeEventListener("click", applyHandler);
          //   btn.addEventListener("click", cancelHandler);
          // }
        } catch(error) {
          console.error(error)
        }
      });
  
      // const applyHandler = () => {
      //   btn.textContent = "Cancel";
      //   btn.classList.remove("bg-green-600", "hover:bg-green-700");
      //   btn.classList.add("bg-red-600", "hover:bg-red-700");
      //   btn.removeEventListener("click", applyHandler);
      //   btn.addEventListener("click", cancelHandler);
      // };
  
      // const cancelHandler = async () => {
      //   try {
      //     const res = await fetch(`${user.fullName}/requests/${}`)
      //     console.log(await res.json())
      //   } catch(error) {
      //     console.error(error)
      //   }
      //   btn.textContent = "Apply";
      //   btn.classList.remove("bg-red-600", "hover:bg-red-700");
      //   btn.classList.add("bg-green-600", "hover:bg-green-700");
      //   btn.removeEventListener("click", cancelHandler);
      //   btn.addEventListener("click", applyHandler);
      // };
  
      // btn.addEventListener("click", applyHandler);
    });
    return postCard;
  }
//
const createNewProjectBtn = document.getElementById('createNewProjectBtn')
if (createNewProjectBtn) {

}
createNewProjectBtn.addEventListener('click', (event) => {
  if (!user) {
    window.location.href = '/auth/login'
  } else if (!user.GitHub) {
    const githubAuthPopup = document.getElementById('githubAuthPopup')
    githubAuthPopup.classList.remove('hidden')

    
    const rolesContainer = document.getElementById("rolesContainer");
    
  } else {
    const createProjectModal = document.getElementById("createProjectModal")
    createProjectModal.setAttribute('style', 'display: block')
  }
})

const closeCreateProjectModalBtn = document.getElementById("closeModal");
closeCreateProjectModalBtn.addEventListener("click", () => {
  createProjectModal.style.display = "none";
});

// Close Modal on Outside Click
window.addEventListener("click", (e) => {
  if (e.target === createProjectModal) {
    createProjectModal.style.display = "none";
  }
});

const rolesContainer = document.getElementById("rolesContainer");
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
        const projectRes = await fetch(`/${user.fullName}/posts/${res.post.id}/projects`, {
          method: 'post'
        })
        if (projectRes.ok) {
          const projectData = await projectRes.json()
          closeCreateProjectModalBtn.click()
          document.getElementById('formSuccessPopUp').classList.remove('hidden')
        } else {
          showErrorPopup()
        }
    }
  } catch(error) {
    console.error("the errro", error)
  }
}

async function closeSuccessPopup() {
  const popup = document.getElementById('formSuccessPopUp');

  // Add a fading animation
  popup.style.transition = 'opacity 0.5s';
  popup.style.opacity = '0';

  // Wait for the animation to complete
  await new Promise((resolve) => setTimeout(resolve, 500));

  location.reload();

  // popup.style.display = 'none';
}

function showErrorPopup() {
  document.getElementById('serverErrorPopup').classList.remove('hidden');
}

// Function to close the popup
function closeErrorPopup() {
  document.getElementById('serverErrorPopup').classList.add('hidden');
}

