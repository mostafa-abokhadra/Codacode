const singubBtn = document.getElementById('signup-submit-btn')
singubBtn.addEventListener('click', (e) => {
    e.preventDefault()
})

const fullNameInput = document.getElementById('fullName')
function feedback(beforeElement, feedbackMessage) {
    const feedback = document.createElement('p')
    feedback.id = 'feedback'
    feedback.className="text-sm mt-2 text-red-500"
    feedback.textContent = feedbackMessage
    beforeElement.parentNode.insertBefore(feedback, beforeElement.nextSibling)
}
fullNameInput.addEventListener('input', async (e) => {
    removePreviousFeedbackMessages()
    const fullName = fullNameInput.value
    let feedbackMessage;
    const isAlphanum = /^[a-z0-9]$/i.test(fullName[0]);
    if (!isAlphanum) 
        feedbackMessage = feedback(fullNameInput, 'first char must be letter or number')
    if (fullName.length < 10)
        feedbackMessage = feedback(fullNameInput, 'name must be 10 to 20 character')
    if (!(await checkFullNameAvailability(fullName)))
        feedbackMessage = feedback(fullNameInput, 'name already found, please try another name')
})

async function checkFullNameAvailability(fullName) {
    try {
        const response = await fetch(
            '/auth/check-name',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName })
            }
        )
        if (!response.ok) {
            console.error('an error occured')
        } else {
            const data = await response.json()
            return data.availablity
        }
    } catch(error) {
        console.log(error)
    }
}

function removePreviousFeedbackMessages() {
    const feedbackMessages = document.querySelectorAll('#feedback')
    feedbackMessages.forEach((message) => {
        message.remove()
    })
}

// async function checkEmailAvailability() {

// }