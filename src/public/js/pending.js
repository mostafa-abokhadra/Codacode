const cardsGrid = document.getElementById('cardsGrid')
let user, pending;
try {
    user =  cardsGrid.attributes.user.value 
    pending = cardsGrid.attributes.pending.value
    user =  JSON.parse(user)
    pending =  JSON.parse(pending)
} catch(error) {
    console.log(error)
}
console.log(pending.pending.length)
if (pending.pending.length === 0) {
    console.log("here")
    const noPendingRequests = document.getElementById("noPendingRequests")
    console.log(noPendingRequests)
    noPendingRequests.classList.remove('hidden')
}
for (let i = 0; i < pending.pending.length; i++) {
    const card = document.createElement('div')
    card.id = `card-${i + 1}`
    card.classList.add("relative", "bg-white", "shadow-lg", "rounded-lg", "p-6")
    card.setAttribute('requestId', pending.pending[i].id)
    card.innerHTML = 
    `
    <h2 class="text-lg font-bold text-indigo-600 mb-2">
        ${pending.pending[i].role.post.title}
    </h2>
    <p class="text-gray-700 mb-2">
        Role Applied: <span class="font-medium">${pending.pending[i].role.position}</span>
    </p>
    <p class="text-gray-700 mb-4">
        Status: <span class="font-medium">${pending.pending[i].status}</span>
    </p>
    <div class="flex justify-end">
        <button
            id="cancelBtn"
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            requestId="${pending.pending[i].id}"
        >
            Cancel
        </button>
    </div>
    `
    cardsGrid.appendChild(card)
}

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

async function cancelRequest(requestId) {
    try {
        const response = await fetch(`/${user.urlUserName}/requests/${requestId}`, {
            method: 'delete'
        })
        if (response.ok && response.status === 204) {
            console.log("ok")
            window.location.reload()
        }
    } catch(error) {
        console.error(error)
    }
}