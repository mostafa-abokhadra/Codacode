const userProjectsContainer = document.getElementById('userProjectsContainer')
const user = JSON.parse(userProjectsContainer.attributes.user.value)

async function getUserAssignedProjectRoles(projectId) {
    const response = await fetch(`/${user.urlUserName}/assignedProjects/${projectId}/roles`)
    if (!response.ok) {

    } else {
        return await response.json()
    }
}
async function getUserProjectRoles(projectId) {
    const response = await fetch(`/${user.urlUserName}/projects/${projectId}/roles`)
    if (!response.ok) {

    } else {
        const data = await response.json()
        return data
    }
}
async function getProjectTeamProfileAvatars(projectId) {
    const response = await fetch(`/${user.urlUserName}/projects/${projectId}/team/avatars`)
    if (!response.ok) {

    } else {
        const data = await response.json()
        if (data.length === 0)
            return null
        return data
    }
}
function createAvatarElements(avatars) {
    if (avatars.length > 3)
        avatars.length = 3
    return avatars
    .map((avatar) => `<img 
                        src="${avatar}"
                        class="w-10 h-10 rounded-full border-2 border-indigo-200 shadow-lg"
                        alt="Avatar" />`)
    .join('');
}

async function cardCreation() {
    for (let i = 0; i < user.Projects.length; i++ ) {
        const avatars = await getProjectTeamProfileAvatars(user.Projects[i].id)
        const roles =  await getUserProjectRoles(user.Projects[i].id)
        const projectCard = createProjectCard(user.Projects[i], avatars, roles, i+1)
        userProjectsContainer.append(projectCard)
    }
}

// for (let i = 0; i < user.assignedProjects.length; i++ ) {
//     const avatars =  getProjectTeamProfileAvatars(user.Projects[i].id)
//     if (!avatars) {
//         // this will not happen as there will be a default avatar
//     }
//     const roles =  getUserAssignedProjectRoles(user.Projects[i].id)
//     const projectCard = createProjectCard(user.Projects[i], avatars, roles)
//     userProjectsContainer.append(projectCard)
// }

function createProjectCard(projectCardData, avatars, roles, cardNum) {
    const repoUrlSegements = projectCardData.repo.split('/')
    const repoName = repoUrlSegements[repoUrlSegements.length - 1]
    const repoOwner = repoUrlSegements[repoUrlSegements.length - 2]
    const projectCard = document.createElement('div')
    projectCard.id = "project-card"
    projectCard.className = `bg-white shadow-2xl rounded-xl overflow-hidden transform transition hover:scale-105 duration-300 mb-5 ml-5`
    projectCard.style = "height: fit-content; width: 45%;"
    projectCard.setAttribute('projectCardNumber', `${cardNum}`)
    projectCard.innerHTML = 
        `
            <div class="p-8 project-card-${cardNum}">
                <h2 class="text-2xl font-bold text-indigo-600 mb-4">
                    ${projectCardData.post.title}
                </h2>
                <p class="text-gray-800 mb-4 text-sm">
                    your Role in the Project:
                    <span class="font-medium text-indigo-500">
                        ${roles.role}
                    </span>
                </p>
                
                View Project
               <a
                    href="${projectCardData.repo}"
                    style="text-decoration:none;"
                    class="text-indigo-500 hover:text-indigo-700 underline text-sm font-medium mb-6 inline-block"
                    >Repo</a
                >

                <div class="flex items-center mb-6">
                    <div class="flex -space-x-3">
                        ${createAvatarElements(avatars.avatars)}
                    </div>
                    <span class="text-sm text-gray-600 ml-4 font-medium"
                        >${avatars.length > 3 ? `+${(avatars.length - 3) + 1} more`: ''} 
                    </span>

                    <button
                        id="teamChatBtn"
                        projectCardNumber=${cardNum}
                        class="ml-auto text-indigo-600 hover:text-indigo-800 font-bold text-sm focus:outline-none"
                        onclick="openChat(${cardNum})">
                        Team Chat
                    </button>
                </div>
                <div>
                    <button
                        id="fetch-commits-${cardNum}"
                        class="flex items-center text-indigo-600 hover:text-indigo-800 font-bold text-sm focus:outline-none"
                        onclick="fetchCommits(${cardNum}, '${repoOwner}', '${repoName}')">
                    Last Commits
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06-.02L10 10.586l3.71-3.4a.75.75 0 011.02 1.1l-4 3.673a.75.75 0 01-1.02 0l-4-3.673a.75.75 0 01-.02-1.06z"
                                clip-rule="evenodd"/
                            >
                        </svg>
                    </button>

                    <ul
                        id="fetch-commits-${cardNum}-dropdown"
                        class="hidden mt-4 bg-white border rounded-md shadow-lg p-4"
                    >
                        <li id="commits-list" class="p-4 text-gray-700">
                            No commits fetched yet.
                        </li>
                    </ul>

                </div>
                

            </div>

        </div>

            <div
                id=chat-interface-${cardNum}
                class="hidden w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden"
            >
                <div class="p-8 flex flex-col h-full">

                    <div class="flex justify-between items-center mb-4">

                        <h3 class="text-2xl font-bold text-indigo-600">Team Chat</h3>
                        <button
                            class="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none"
                            onclick="closeChat(${cardNum})"
                        >
                        Close
                        </button>
                    </div>

                    <ul
                        id="message-list-${cardNum}"
                        class="flex-grow overflow-y-auto bg-gray-50 p-4 border rounded-md mb-4"
                    >
                        <li class="p-2 border-b">Welcome to the team chat!</li>
                    </ul>

                    <div class="flex items-center">
                        <input
                            id="chat-message-input"
                            type="text"
                            class="flex-grow p-2 border rounded-l-md focus:outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            class="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none"
                            onclick="sendMessage()"
                        >
                            Send
                        </button>
                    </div>

                </div>
            </div>
        `
    return projectCard
}

function openChat(cardNum) {
    const card = document.querySelector(`.project-card-${cardNum}`);
    const chatInterface = document.getElementById(`chat-interface-${cardNum}`);
    card.classList.add("hidden");
    chatInterface.classList.remove("hidden");
}
function closeChat(cardNum) {
    const card = document.querySelector(`.project-card-${cardNum}`);
    const chatInterface = document.getElementById(`chat-interface-${cardNum}`);
    chatInterface.classList.add("hidden");
    card.classList.remove("hidden");
} 
// const teamChatBtns = document.querySelectorAll('#teamChatBtn')
// teamChatBtns.forEach((teamChatBtn)=> {
//     teamChatBtn.addEventListener('click', (e)=>{
//         const projectCardNumber = teamChatBtn.attributes.projectCardNumber.value
//         const theCard = 
//     })

// })
async function fetchCommits(cardNum, repoOwner, repoName) {
    // const commitsList = document.querySelector(`commits-list-${cardNum}`);
    const dropdown = document.getElementById(`fetch-commits-${cardNum}-dropdown`);
    if (dropdown.classList.contains("hidden")) {
        dropdown.classList.remove("hidden");
        dropdown.innerHTML = "<li>Loading commits...</li>";
        try {
            const response = await fetch(
                `https://api.github.com/repos/${repoOwner}/${repoName}/commits`
            );

            const data = await response.json();
            dropdown.innerHTML = data
                .slice(0, 5)
                .map((commit) =>
                    `<li class='p-2 border-b hover:bg-gray-100'>${commit.commit.message}</li>`
                ).join("");
        } catch (error) {
            commitsList.innerHTML = "<li>Error fetching commits.</li>";
        }
    } else {
        dropdown.classList.add("hidden");
    }
}

function sendMessage() {
    const messageInput = document.getElementById("chat-message-input");
    const messageList = document.getElementById("message-list");
    const message = messageInput.value.trim();

    if (message) {
        const messageItem = document.createElement("li");
        messageItem.className = "p-2 border-b";
        messageItem.textContent = message;
        messageList.appendChild(messageItem);
        messageInput.value = "";
    }
}

(async()=>await cardCreation())()