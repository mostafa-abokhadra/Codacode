const requestsContainer = document.getElementById('requests-container');

if (requestsContainer) {
    let requests;
    try {
        requests = JSON.parse(requestsContainer.attributes.requests.value)
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
            Applied to <b>${cardData.role.position}</b> position to your <a href="#"><b>${cardData.role.post.title}</b></a> project
        </div>
        <div class="card-footer">
            <button id="accept" class="button accept" requestId="${cardData.id}">Accept</button>
            <button id="reject" class="button reject" requestId="${cardData.id}">Reject</button>
        </div>
    `;
    return card
}

const acceptReq = document.getElementById('accept')
if (!acceptReq) {
    const noReq = document.getElementById('noRequests')
    noReq.classList.remove('hidden')
}

acceptReq.addEventListener('click', async (e) => {
    try {
        const user = JSON.parse(requestsContainer.attributes.user.value)
        const res = await fetch(`/${user.urlUserName}/requests/${acceptReq.attributes.requestId.value}/accept`, {method: 'post'})
        const data = await res.json()
        acceptSuccessPopup.classList.remove('hidden')
        const immediateParent = acceptReq.parentElement
        const rejectElement = immediateParent.querySelector('.reject');
        if (rejectElement) {
            rejectElement.remove();
        }
        const span = document.createElement('span')
        span.textContent = "Status: "
        span.setAttribute('style', 'transition: 0.3s; font-size: 30px; ')
        

        immediateParent.insertBefore(span, immediateParent.firstChild)
        immediateParent.setAttribute('style', 'display: block;')
        acceptReq.style.backgroundColor = '#005012'
        acceptReq.disabled = true
        // const card = immediateParent.parentElement
        // card.setAttribute('style', 'display: none');
    } catch(error) {
        console.error("the error", error)
    }
})
const acceptSuccessPopup = document.getElementById('acceptSuccessPopup');
const closePopup = document.getElementById('closeAcceptSuccessPopup');
closePopup.addEventListener('click', () => {
    acceptSuccessPopup.classList.add('hidden');
});
