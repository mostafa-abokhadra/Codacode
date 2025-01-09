const cardsGrid = document.getElementById('cardsGrid')
let user, pending;
try {
    user =  cardsGrid.attributes.user.value 
    pending = cardsGrid.attributes.pending.value
    user =  JSON.parse(user)
    pending =  JSON.parse(pending)
} catch(error) {
    console.error(error)
}

function displayNoPendingRequestElement(){
    const noPendingRequests = document.getElementById("noPendingRequests")
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
            id="removePendingCard"
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
        checkYourProjectsHint.setAttribute('href', `/${user.urlUserName}/all/projects`)
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
            id="cancelBtn"
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            requestId="${cardData.id}"
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

const removePendingCardBtn = document.querySelectorAll('#removePendingCard')
removePendingCardBtn.forEach((btn)=>{
    btn.addEventListener('click', async (event) => {
        const requestId = btn.attributes.requestId.value
        const res = await fetch(
            `/${user.urlUserName}/requests/${requestId}/showInPending`,
            {
                method: 'put'
            }
        )
        if (res.ok) {
            window.location.reload()
        }
    })
})

const confirmCancelPopup = document.getElementById("confirmCancelPopup")
const cancelBtn = document.querySelectorAll('#cancelBtn')

for (let i = 0; i < cancelBtn.length; i++) {
    cancelBtn[i].addEventListener('click', async(event) => {
        confirmCancelPopup.setAttribute('requestId', cancelBtn[i].attributes.requestId.value)
        confirmCancelPopup.classList.remove('hidden')
    })
}
const confirmCancelButton = document.querySelectorAll("#confirmCancelButton")
const closeConfirmCancelPopup = document.querySelectorAll("#closeConfirmCancelPopup")

for (let i = 0; i < confirmCancelButton.length; i++) {
    confirmCancelButton[i].addEventListener('click', (evenet) => {
        const thirdParent = confirmCancelButton[i].parentElement
            ?.parentElement
            ?.parentElement;

        if (thirdParent && thirdParent.id === "confirmCancelPopup") {
            const requestId = thirdParent.getAttribute('requestId');
            if (requestId) {
                cancelRequest(requestId);
            } else {
                console.error('requestId not found');
            }
        } else {
            console.error('Third parent not found or incorrect element');
        }
    })
}
for (let i = 0; i < closeConfirmCancelPopup.length; i++) {
    closeConfirmCancelPopup[i].addEventListener('click', async(e) => {
        confirmCancelPopup.classList.add('hidden')
    })
}
const serverErrorPopup = document.getElementById('serverErrorPopup')
function closeErrorPopup() {
    // serverErrorPopup.classList.add('hidden');
    window.location.reload()
}
async function cancelRequest(requestId) {
    try {
        const response = await fetch(`/${user.urlUserName}/requests/${requestId}`, {
            method: 'delete'
        })
        if (!response.ok) {
            serverErrorPopup.classList.remove('hidden')
        } else if(response.ok && response.status === 204) {
            window.location.reload()
        }
    } catch(error) {
        console.error(error)
    }
}