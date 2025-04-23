function feedback(beforeElement, feedbackMessage) {
    const feedback = document.createElement('p')
    feedback.id = 'feedback'
    feedback.className="text-sm mt-2 text-red-500"
    feedback.textContent = feedbackMessage
    beforeElement.classList.add('input-error')
    beforeElement.parentNode.insertBefore(feedback, beforeElement.nextSibling)
}

function removePreviousFeedbackMessages() {
    const feedbackMessages = document.querySelectorAll('#feedback')
    feedbackMessages.forEach((message) => {
        message.remove()
    })
}
function CheckIsAlphaNum(value) {
    const isAlphanum = /^[a-z0-9]$/i.test(value);
    if (!isAlphanum)
        return 0
    return 1
}
async function checkFullNameValidity() {

    const fullName = fullNameInput.value
    fullNameInput.classList.remove('input-error')
    if (fullName === ''){
        feedback(fullNameInput, 'full name is required')
        return 0
    }
    const isAlphanum = CheckIsAlphaNum(fullName[0])
    if (!isAlphanum) {
        feedback(fullNameInput, 'first char must be letter or number')
        return 0
    }
    if (fullName.length < 10) {
        feedback(fullNameInput, 'name must be 10 to 20 character')
        return 0
    }
    if (!(await checkFullNameAvailability(fullName))) {
        feedback(fullNameInput, 'name already found, please try another name')
        return 0
    }
    return 1
}

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


// //////////////////////////////////////////////////////////////////////////////

async function checkEmailAvailability(email) {
    try {
        const response = await fetch(
            '/auth/check-email',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            }
        )
        if (!response.ok) {
            console.error('an error occured')
        } else {
            const data = await response.json()
            return data.availablity
        }
    } catch(error) {
        console.error(error)
    }
}

async function checkEmailValidity() {
    const email = emailInput.value
    emailInput.classList.remove('input-error')
    if (email === '') {
        feedback(emailInput, 'email is required')
        return 0
    }
    const isAlphanum = CheckIsAlphaNum(email[0])
    if (!isAlphanum) {
        feedback(emailInput, 'first char must be letter or number')
        return 0
    }
    if (!emailInput.checkValidity()) {
        feedback(emailInput, 'invalide email format')
        return 0
    }
    if (!(await checkEmailAvailability(email))) {
        feedback(emailInput, 'email already exist')
    }
    return 1
}
const emailInput = document.getElementById('email')
emailInput.addEventListener('input', async (e) => {
    removePreviousFeedbackMessages()
    await checkEmailValidity()
})

const fullNameInput = document.getElementById('fullName')
fullNameInput.addEventListener('input', async (e) => {
    removePreviousFeedbackMessages()
    await checkFullNameValidity()
})

const singubBtn = document.getElementById('signup-submit-btn')
singubBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    removePreviousFeedbackMessages()
    await checkFullNameValidity()
    await checkEmailValidity()

})