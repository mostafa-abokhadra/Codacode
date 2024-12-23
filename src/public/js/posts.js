const posts = document.getElementById('posts-container');
const userPosts = JSON.parse(posts.attributes.posts.value)


document.querySelectorAll(".apply-btn").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("hidden");
      const cancelButton = button.nextElementSibling;
      cancelButton.classList.remove("hidden");
    });
  });

  document.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("hidden");
      const applyButton = button.previousElementSibling;
      applyButton.classList.remove("hidden");
    });
  });

document.addEventListener("DOMContentLoaded", () => {

    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i].createdAt = userPosts[i].createdAt.split('T')
        const post = generatePost(userPosts[i]);
        posts.appendChild(post);
    }
});
  
  function generatePost(postData) {
    const postCard = document.createElement("div");
    postCard.className = "bg-white p-4 rounded-lg shadow-md mb-4";
  
    postCard.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <img src="data:image/jpeg;base64,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" alt="Profile" class="w-12 h-12 rounded-full">
          <div>
            <p class="text-lg font-semibold">${postData.user.fullName}</p>
            <p class="text-sm text-gray-500">${postData.createdAt[0]}</p>
          </div>
        </div>
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
            <div class="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <p style="font-weight: bold;">${role.position}</p>
              <button class="apply-btn bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Apply</button>
            </div>
          `
          )
          .join("")}
      </div>
      <div class="mt-4">
        <a href="${postData.repo}" class="text-green-600 underline hover:text-green-700">
          Repository Link
        </a>
      </div>
    `;
  
    // Handle Apply/Cancel button logic
    const applyButtons = postCard.querySelectorAll(".apply-btn");
    applyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.textContent = "Cancel";
        btn.classList.remove("bg-green-600", "hover:bg-green-700");
        btn.classList.add("bg-red-600", "hover:bg-red-700");
        btn.removeEventListener("click", applyHandler);
        btn.addEventListener("click", cancelHandler);
      });
  
      const applyHandler = () => {
        btn.textContent = "Cancel";
        btn.classList.remove("bg-green-600", "hover:bg-green-700");
        btn.classList.add("bg-red-600", "hover:bg-red-700");
        btn.removeEventListener("click", applyHandler);
        btn.addEventListener("click", cancelHandler);
      };
  
      const cancelHandler = () => {
        btn.textContent = "Apply";
        btn.classList.remove("bg-red-600", "hover:bg-red-700");
        btn.classList.add("bg-green-600", "hover:bg-green-700");
        btn.removeEventListener("click", cancelHandler);
        btn.addEventListener("click", applyHandler);
      };
  
      btn.addEventListener("click", applyHandler);
    });
  
    return postCard;
  }
  