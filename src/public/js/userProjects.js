const userProjectsContainer = document.getElementById('user-projects-container')
const user = JSON.parse(userProjectsContainer.dataset.user)

async function getAllProjects() {
    try {
        const response = await fetch( `/users/${user.id}/all/projects`)
        const data = await response.json()
        if (!response.ok ||
            data.user.Projects.length + data.user.assignedProjects.length === 0
        ) {
            document.getElementById('no-projects-found').classList.remove('hidden')
            return 0
        }
        else
            return data
    } catch(error) {
        console.error('an error', error)
    }
}
async function cardCreation(data) {
    let cardCounter = 0;
    let projectCard;
    for (let i = 0; i < data.user.Projects.length; i++ ) {
        const avatars = await getProjectTeamProfileAvatars(data.user.Projects[i].id)
        // const roles =  await getUserProjectRoles(data.Projects[i].id)
        projectCard = createProjectCard(data.user.Projects[i], avatars, /*roles,*/ ++cardCounter)
    }
    for (let i = 0; i < data.user.assignedProjects.length; i++ ) {
        const avatars = await getProjectTeamProfileAvatars(data.user.assignedProjects[i].id)
        // const roles =  await getUserAssignedProjectRoles(user.assignedProjects[i].id)
        projectCard = createProjectCard(data.user.assignedProjects[i], avatars, /*roles,*/ ++cardCounter)
    }
    userProjectsContainer.append(projectCard)
    cardCounter = 0
}
async function getProjectTeamProfileAvatars(projectId) {
    const response = await fetch(`/users/${user.id}/projects/${projectId}/team/avatars`)
    if (response.status === 204) {
        console.log('204')
    } else if(response.status === 400) {
        console.log("server error")
    } else {
        const data = await response.json()
        return data
    }
}
// async function getUserProjectRoles(projectId) {
//     const response = await fetch(`/${user.urlUserName}/projects/${projectId}/roles`)
//     if (!response.ok) {

//     } else {
//         const data = await response.json()
//         if (data.length === 0)
//             return null
//         return data
//     }
// }
// async function getUserAssignedProjectRoles(projectId) {
//     const response = await fetch(`/${user.urlUserName}/assignedProjects/${projectId}/roles`)
//     if (!response.ok) {

//     } else {
//         return await response.json()
//     }
// }


function createProjectCard(projectCardData, avatars, /*roles,*/ cardNum) {

    const repoUrlSegements = projectCardData.repo.split('/')
    const repoName = repoUrlSegements[repoUrlSegements.length - 1]
    const repoOwner = repoUrlSegements[repoUrlSegements.length - 2]

    const projectCard = document.createElement('div')
    projectCard.className = `project-card bg-white shadow-2xl rounded-xl overflow-hidden mb-5 ml-5`
    projectCard.style = "height: fit-content; width: 45%;"
    projectCard.setAttribute("project-card-num", `${cardNum}`)
    projectCard.innerHTML = 
        `
            <div class="p-8 project-card-${projectCardData.id}">
                <h2 class="text-2xl font-bold text-indigo-600 mb-4">
                    ${projectCardData.post.title}
                </h2>
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
                        >${avatars.length > 3 ? `+ ${(avatars.length - 3)}`: ''} 
                    </span>

                    <button
                        id="team-chat-btn"
                        projectCardNumber=${cardNum}
                        class="ml-auto text-indigo-600 hover:text-indigo-800 font-bold text-sm focus:outline-none"
                        onclick="openChat(${cardNum}, ${projectCardData.id})">
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
                id=chat-interface-${projectCardData.id}
                class="hidden w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden"
            >
                <div class="p-8 flex flex-col h-full">

                    <div class="flex justify-between items-center mb-4">

                        <h3 class="text-2xl font-bold text-indigo-600">Team Chat</h3>
                        <button
                            id=close-chat-interface-${projectCardData.id}
                            class="text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none"
                            onclick="closeChat(${cardNum}, ${projectCardData.id})"
                        >
                        Close
                        </button>
                    </div>

                    <div
                        id="message-list-${projectCardData.id}"
                        class="flex-grow overflow-y-auto bg-gray-50 p-4 border rounded-md mb-4 messages"
                        style: style="overflow-y: scroll; height: 300px; ";
                    >
                        <span class="p-2 border-b">Welcome to the team chat!</span>
                    </div>

                    <div class="flex items-center">
                        <input
                            id="card-${projectCardData.id}-chat-message-input"
                            type="text"
                            class="flex-grow p-2 border rounded-l-md focus:outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            class="cardSendBtn${projectCardData.id} bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none"
                        >
                            Send
                        </button>
                    </div>

                </div>
            </div>
        `
    return projectCard
}
function createAvatarElements(avatars) {
    if (avatars.length > 3)
        avatars.length = 3
    return avatars.map((avatar) => {
        `<img 
            src="${avatar}"
            class="w-10 h-10 rounded-full border-2 border-indigo-200 shadow-lg"
            alt="Avatar"
        />`
    }).join('');
}
async function fetchCommits(cardNum, repoOwner, repoName) {

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

const socket = io();

socket.on("sendMessage", (data) => {
    console.log(data)
    const { message, project, userSentMessage } = data; 
    const messageList = document.getElementById(`message-list-${project}`); 
    // const messageList = document.getElementsByClassName(`messages`); 
    if (messageList) {
        // const messageItem = document.createElement("li");
        // messageItem.textContent = message;
        // messageItem.className = "p-2 border-b";
        // messageList.appendChild(messageItem);

        // Create the message wrapper div
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("message-wrapper");


        // Create the user profile photo element
        const profilePhoto = document.createElement("img");
        profilePhoto.src = userSentMessage.profile.image || "default-profile.png";
        profilePhoto.alt = `${userSentMessage.fullName}'s profile photo`;
        profilePhoto.classList.add("profile-photo");

        // Create the message content container
        const messageContent = document.createElement("div");
        messageContent.classList.add("message-content");

        // Add the username
        const username = document.createElement("span");
        username.classList.add("username");
        username.textContent = userSentMessage.fullName;

        // Add the message text
        const messageText = document.createElement("p");
        messageText.classList.add("message-text");
        messageText.textContent = message;

        if (user.id === userSentMessage.id) {
            console.log('got here')
                messageWrapper.style = 'direction: rtl'
                messageText.style='direction: ltr'
        }

        // Append the username and message text to the message content container
        messageContent.appendChild(username);
        messageContent.appendChild(messageText);

        // Append the profile photo and message content to the wrapper
        messageWrapper.appendChild(profilePhoto);
        messageWrapper.appendChild(messageContent);

        // Append the wrapper to the messages container
        messageList.appendChild(messageWrapper);
    } else {
        console.error("Message list not found for card:", project);
    }
    // window.scrollTo(0, document.body.scrollHeight);
});

function openChat(cardNum, projectId) {
    const card = document.querySelector(`.project-card-${projectId}`);
    const chatInterface = document.getElementById(`chat-interface-${projectId}`);
    const sendMessageButton = document.querySelector(`.cardSendBtn${projectId}`);

    card.classList.add("hidden");
    chatInterface.classList.remove("hidden");
    
    // 1
    socket.emit('joinGroup', `team-${projectId}`)

    retrieveMessages(projectId)
    sendMessageButton.removeEventListener("click", sendMessage); 
    const newSendMessageButton = document.querySelector(`.cardSendBtn${projectId}`);
    newSendMessageButton.addEventListener("click", (e) => {
        sendMessage(cardNum, projectId)
    })
}
async function retrieveMessages(projectId) {
    try {
        const response = await fetch(`/users/${user.id}/projects/${projectId}/messages`)
        if (!response.ok) {
            console.error('invalid response', response.status)
        } else {
            const data = await response.json()
            createChatInterface(data)
        }
    } catch(error) {
        console.error('An expected error has occured while fetching messages')
    }
}
function createChatInterface(data) {
    // tommorow : gather messages sended in the same day in one container
    // add the date before each container
    // add each container to the message interface
    // on overflow veritcally scroll
    // add function to add to the messageinterface the most recent message 
    // console.log('i am here')
    // console.log(data)
    const messagesContainer = document.getElementById(`message-list-${data.messages[0].group.team.project_id}`);
    // console.log('here', messagesContainer)
    if (messagesContainer) {
        for (let i =0; i < data.messages.length; i++){
            // Create the message wrapper div
            const messageWrapper = document.createElement("div");
            messageWrapper.classList.add("message-wrapper");
            // console.log(user.id, data.messages[i].user.id)
            // Create the user profile photo element
            const profilePhoto = document.createElement("img");
        
            profilePhoto.src = data.messages[i].user.profile.image || "/imgs/User_default_Icon.png";
            // profilePhoto.alt = `${data.messages[i].user.fullName}'s profile photo`;
            profilePhoto.classList.add("profile-photo");
            // Create the message content container

            const messageContent = document.createElement("div");
            messageContent.classList.add("message-content");
            
            const username = document.createElement("span");
            username.classList.add("username");
            username.textContent = data.messages[i].user.fullName;
            
            const messageText = document.createElement("p");
            messageText.classList.add("message-text");
            messageText.textContent = data.messages[i].content;

            if (user.id === data.messages[i].user.id) {
                messageWrapper.style = 'direction: rtl'
                messageText.style='direction: ltr'
            }
            // Append the username and message text to the message content container
            messageContent.appendChild(username);
            messageContent.appendChild(messageText);

            // Append the profile photo and message content to the wrapper
            messageWrapper.appendChild(profilePhoto);
            messageWrapper.appendChild(messageContent);

            // Append the wrapper to the messages container
            messagesContainer.appendChild(messageWrapper);
        }
    } else {
        console.log('cant get messages container')
    }
}


function sendMessage(cardNum, projectId) {
    const inputField = document.querySelector(`.cardSendBtn${projectId}`).previousElementSibling;
    const messageText = inputField.value.trim();
    if (!messageText) return;

    // 4: Client emits sendMessage with group details and message text.
    socket.emit("sendMessage", {
        groupName: `team-${projectId}`,
        message: messageText,
        project: projectId,
        user: user.id
    });

    inputField.value = "";

}

function closeChat(cardNum, projectId) {
    const card = document.querySelector(`.project-card-${projectId}`);
    const chatInterface = document.getElementById(`chat-interface-${projectId}`);
    const messageList = document.getElementById(`message-list-${projectId}`)
    messageList.replaceChildren()
    socket.emit(`leaveGroup`, `team-${projectId}`)

    chatInterface.classList.add("hidden");
    card.classList.remove("hidden");
} 

(async() => {
    const data = await getAllProjects()
    if (data)
        await cardCreation(data)
})()