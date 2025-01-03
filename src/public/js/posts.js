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
    console.log("posts = ", )
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
  