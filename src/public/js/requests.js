const requestsContainer = document.getElementById('requests-container');
const requests = JSON.parse(requestsContainer.attributes.requests.value)
const user = JSON.parse(requestsContainer.attributes.user.value)

if (requests.requests.length === 0) {
    const noReq = document.getElementById('noRequests')
    noReq.classList.remove('hidden')
}

for (let i = 0; i < requests.requests.length; i++) {
    let card;
    if (requests.requests[i].status == 'accepted' ||
        requests.requests[i].status == 'rejected') {
            card = createAccepteAndRejectedCard(requests.requests[i])
        } else {
            card = createCard(requests.requests[i])
        }
    requestsContainer.appendChild(card)
}

const acceptRequestButtons = document.querySelectorAll('#accept')
const acceptSuccessPopup = document.getElementById('acceptSuccessPopup');
const closeAcceptPopup = document.getElementById('closeAcceptSuccessPopup');

closeAcceptPopup.addEventListener('click', () => {
    acceptSuccessPopup.classList.add('hidden');
    window.location.reload()
});

const serverErrorPopup = document.getElementById('serverErrorPopup')
function closeErrorPopup() {
    serverErrorPopup.classList.add('hidden');
    window.location.reload()
}
for (let i = 0; i < acceptRequestButtons.length; i++) {
    
    acceptRequestButtons[i].addEventListener('click', async(event) => {
        const res = await fetch(
            `/${user.urlUserName}/requests/${acceptRequestButtons[i].attributes.requestId.value}/accept`,
            {method: 'post'})
        if (!res.ok) {
            serverErrorPopup.classList.remove('hidden')
        } else {
            acceptSuccessPopup.classList.remove('hidden')
        }
    })
}

const rejectRequestButtons = document.querySelectorAll('#reject')
const confirmRejectPopup = document.getElementById('confirmRejectPopup')

for (let i = 0; i < rejectRequestButtons.length; i++) {
    rejectRequestButtons[i].addEventListener('click', async(event) => {
        confirmRejectPopup.setAttribute('requestId', rejectRequestButtons[i].attributes.requestId.value)
        confirmRejectPopup.classList.remove('hidden')
    })
}

const confirmRejectButton = document.getElementById('confirmRejectButton')
const closeConfirmRejectPopup = document.getElementById('closeConfirmRejectPopup')

closeConfirmRejectPopup.addEventListener('click', async(event) => {
    confirmRejectButton.parentElement.parentElement.parentElement.classList.add('hidden')
})
confirmRejectButton.addEventListener('click', async(event) => {
    const thirdParent = confirmRejectButton.parentElement
    ?.parentElement
    ?.parentElement;
    if (thirdParent && thirdParent.id === "confirmRejectPopup") {
        const requestId = thirdParent.getAttribute('requestId');
        if (requestId) {
            const res = await fetch(
                `/${user.urlUserName}/requests/${requestId}/reject`,
                {method: 'delete'}
            )
            if (!res.ok) {
                closeConfirmRejectPopup.click()
                serverErrorPopup.classList.remove('hidden')
            } else {
                window.location.reload()
            }
        }
    }
})

function createAccepteAndRejectedCard(cardData) {
    const card = document.createElement('div')
    card.className = 'card'
    let statusColor, status; 
    if (cardData.status == 'rejected') {
        statusColor = "rgb(165 23 44)"
        status = 'reject'
    } else if (cardData.status == 'accepted') {
        statusColor = 'rgb(0, 80, 18)'
        status = 'accept'
    }
    card.innerHTML = 
    `
    <div class="card">
    <div style="display: flex; justify-content: space-between;">
        <a href="#" class="card-header" style="width: 87%;">
            <div
                class="user-image"
                style="background-image: url(${cardData.userApplied.profile.image}); background-size: cover;">
            </div>
            <div class="user-info">
                <div class="username">${cardData.userApplied.fullName}</div>
                <div class="date">some date</div>
            </div>
        </a>
        <button style="height: fit-content;font-size:larger;font-weight:bold;" id="hideRequestCard" requestId="${cardData.id}">&#10060;</button>
    </div>
        <div class="card-content">
            Applied to <b>${cardData.role.position}</b> position to your <a href="#"><b>${cardData.role.post.title}</b></a> project
        </div>
        <div class="card-footer" style="display: block;">
            <span style="transition: 0.3s; font-size: 30px;">Status: </span>
            <button id="${status}" class="button ${status}" requestid="${cardData.id}" disabled style="background-color: ${statusColor}">${cardData.status}</button>
        </div>
    </div>
    `
    return card
}
function createCard(cardData) {
    const card = document.createElement('div')
    card.className = "card"
    card.innerHTML = 
    `
        <a href="/cardData.userApplied.fullName" class="card-header">
            <div class="user-image" style="background-image: url(${cardData.userApplied.profile.image}); background-size: cover;">
            </div>
            <div class="user-info">
                <div class="username">${cardData.userApplied.fullName}</div>
                <div class="date">some data</div>
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

const hideRequestCard = document.querySelectorAll('#hideRequestCard')
for (let i = 0; i < hideRequestCard.length; i++) {
    hideRequestCard[i].addEventListener('click', async (event)=> {
        console.log(hideRequestCard[i])
        const requestId = hideRequestCard[i].attributes.requestId.value
        if (requestId) {
            const res = await fetch(
                `/${user.urlUserName}/requests/${requestId}/show`,
                {
                    method: 'put'
                }
            )
            window.location.reload()
        }
    })
}
