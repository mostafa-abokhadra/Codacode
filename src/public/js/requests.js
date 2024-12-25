const requestsContainer = document.getElementById('requests-container');

if (requestsContainer) {
    let requests;
    let user;
    try {
        requests = JSON.parse(requestsContainer.attributes.requests.value)
        user = JSON.parse(requestsContainer.attributes.user.value)
    } catch (error) {
        console.error("Failed to parse requests:", error);
        requests = []; // Default to an empty array if parsing fails
    }
    for (let i = 0; i < requests.requests.length; i++) {
        let card = createCard(requests.requests[i])
        requestsContainer.appendChild(card)
    }
    
} else {
    console.error("Element with ID 'requests-container' not found.");
}

function createCard(cardData) {
    const card = document.createElement('div')
    card.className = "card"
    card.innerHTML = 
    `
        <a href="#" class="card-header">
            <div class="user-image" style="background-image: url(${cardData.userApplied.profile.image}); background-size: cover;">
            </div>
            <div class="user-info">
                <div class="username">${cardData.userApplied.fullName}</div>
                <div class="date">December 24, 2024</div>
            </div>
        </a>
        <div class="card-content">
            Applied to ${cardData.role.position} position on <a href="#">${cardData.role.post.title}</a> project
        </div>
        <div class="card-footer">
            <button id="accept" class="button accept" requestsId="${cardData.id}">Accept</button>
            <button id="reject" class="button reject" requestId="${cardData.id}">Reject</button>
        </div>
    `;
    return card
}

const acceptReq = document.getElementById('accept')
acceptReq.addEventListener('click', async (e) => {
    try {
        const res = await fetch(`/${user.urlUserName}/requests/${acceptReq.attributes.requestId.value}`, {method: 'post'})
        console.log(await res.json())
    } catch(error) {

    }
})

