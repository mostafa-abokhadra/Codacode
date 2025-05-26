const cardsGrid = document.getElementById('cards-grid')
let user = JSON.parse(cardsGrid.dataset.user), pending = JSON.parse(cardsGrid.dataset.pending);
console.log(user, pending)
const noPendingRequests = document.getElementById("no-pending-requests")

function displayNoPendingRequestElement(){
    noPendingRequests.classList.remove('hidden')
}
if (pending.pending.length === 0) {
    displayNoPendingRequestElement()
}
function createAcceptedRejectedCard(cardData, i) {
    const card = document.createElement('div')
    card.id = `card-${i}`
    card.classList.add("relative", "bg-white", "shadow-lg", "rounded-lg", "p-6")
    card.setAttribute('requestId', cardData.id)
    let statusColor;
    if (cardData.status === 'accepted')
        statusColor = 'rgb(34 197 94 / var(--tw-bg-opacity, 1));'
    else
        statusColor = 'rgb(236 11 81)'
    card.innerHTML = 
    `
    <div style="display: flex; justify-content: space-between;">
        <h2 class="text-lg font-bold text-indigo-600 mb-2">
            ${cardData.role.post.title}
        </h2>
        <button
            class="remove-pending-card"
            requestId="${cardData.id}"
            style="font-size: 15px; font-weight: bold;">
                &#10060;
        </button>
    </div>
    <p class="text-gray-700 mb-2">
        Role Applied: <span class="font-medium">${cardData.role.position}</span>
    </p>
    <p class="text-gray-700 mb-4">
        Status: <span class="font-medium" style="color: ${statusColor}">${cardData.status}</span>
    </p>
    `
    const checkYourProjectsHint = document.createElement('a')
    if (cardData.status === 'accepted') {
        checkYourProjectsHint.setAttribute('href', `/users/${user.id}/projects`)
        checkYourProjectsHint.textContent = 'check your projects'
        checkYourProjectsHint.style = 'color: rgb(34 197 94 / var(--tw-bg-opacity, 1)); font-weight: bold;'
    } else {
        checkYourProjectsHint.setAttribute('href', `/projects`)
        checkYourProjectsHint.textContent = 'try to apply to another project'
        checkYourProjectsHint.style = 'color: rgb(34 197 94 / var(--tw-bg-opacity, 1)); font-weight: bold;'
    }
    card.appendChild(checkYourProjectsHint)
    return card
}
function createPendingCard(cardData, i) {
    const card = document.createElement('div')
    card.id = `card-${i}`
    card.classList.add("relative", "bg-white", "shadow-lg", "rounded-lg", "p-6")
    card.setAttribute('requestId', cardData.id)
    card.innerHTML = 
    `
    <h2 class="text-lg font-bold text-indigo-600 mb-2">
        ${cardData.role.post.title}
    </h2>
    <p class="text-gray-700 mb-2">
        Role Applied: <span class="font-medium">${cardData.role.position}</span>
    </p>
    <p class="text-gray-700 mb-4">
        Status: <span class="font-medium">${cardData.status}</span>
    </p>
    <div class="flex justify-end">
        <button
            class="cancel-btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            requestId="${cardData.id}"
            cardNum=${card.id}
        >
            Cancel
        </button>
    </div>
    `
    return card
}

let noCardsLegibleToDisplay = false
for (let i = 0; i < pending.pending.length; i++) {
    let card = null;
    if (pending.pending[i].status == 'accepted' && pending.pending[i].showInPending == true ||
        pending.pending[i].status == 'rejected' && pending.pending[i].showInPending == true
    ) {
        card = createAcceptedRejectedCard(pending.pending[i], i + 1)
        cardsGrid.appendChild(card)
        noCardsLegibleToDisplay = true
    } else if (pending.pending[i].status == 'waiting'){
        card = createPendingCard(pending.pending[i], i + 1)
        noCardsLegibleToDisplay = true
        cardsGrid.appendChild(card)
    }
    if (!noCardsLegibleToDisplay && i === pending.pending.length - 1) {
        displayNoPendingRequestElement()
    }
    
}

const removePendingCardBtn = document.querySelectorAll('.remove-pending-card')
removePendingCardBtn.forEach((btn)=>{
    btn.addEventListener('click', async (event) => {
        const requestId = btn.attributes.requestId.value
        const res = await fetch(
            `/users/${user.id}/requests/${requestId}/showInPending`,
            {
                method: 'put'
            }
        )
        if (!res.ok) {
            serverErrorPopup.classList.remove('hidden')
        } else {
            btn.parentElement.parentElement.remove()
            if (cardsGrid.childElementCount === 1)
                displayNoPendingRequestElement()
        }
    })
})

const confirmCancelPopup = document.getElementById("confirm-cancel-popup")
const cancelBtn = document.querySelectorAll('.cancel-btn')

for (let i = 0; i < cancelBtn.length; i++) {
    cancelBtn[i].addEventListener('click', async(event) => {
        confirmCancelPopup.setAttribute('requestId', cancelBtn[i].attributes.requestId.value)
        confirmCancelPopup.setAttribute('cardNum', cancelBtn[i].attributes.cardNum.value)
        confirmCancelPopup.classList.remove('hidden')
    })
}
const confirmCancelButton = document.getElementById("confirm-cancel-btn")
const closeConfirmCancelPopup = document.getElementById("close-confirm-cancel")
confirmCancelButton.addEventListener('click', (e) => {
    const thirdParent = confirmCancelButton.parentElement
        ?.parentElement
        ?.parentElement;

    if (thirdParent && thirdParent.id === "confirm-cancel-popup") {
        const requestId = thirdParent.getAttribute('requestId');
        const cardNum = thirdParent.getAttribute('cardNum')
        if (requestId) {
            cancelRequest(requestId, cardNum);
        } else {
            console.error('requestId not found');
        }
    } else {
        console.error('Third parent not found or incorrect element');
    }
})
closeConfirmCancelPopup.addEventListener('click', (e) => {
    confirmCancelPopup.classList.add('hidden')
})
async function cancelRequest(requestId, cardNum) {
    try {
        const response = await fetch(`/users/${user.id}/requests/${requestId}`, {
            method: 'delete'
        })
        if (!response.ok) {
            closeConfirmCancelPopup.click()
            serverErrorPopup.classList.remove('hidden')
        } else if(response.ok && response.status === 204) {
            closeConfirmCancelPopup.click()
            document.getElementById(cardNum).remove()
            if (cardsGrid.childElementCount === 1) 
                displayNoPendingRequestElement()
        }
    } catch(error) {
        console.error(error)
    }
}
for (let i = 0; i < closeConfirmCancelPopup.length; i++) {
    closeConfirmCancelPopup[i].addEventListener('click', async(e) => {
        confirmCancelPopup.classList.add('hidden')
    })
}
const serverErrorPopup = document.getElementById('serverErrorPopup')
function closeErrorPopup() {
    serverErrorPopup.classList.add('hidden');
    // window.location.reload()
}