function feedback(beforeElement, feedbackMessage) {
    console.log('here')
    const feedback = document.createElement('p')
    feedback.id = 'feedback'
    feedback.className="text-sm mt-2 text-red-500"
    feedback.textContent = feedbackMessage
    beforeElement.classList.add('input-error')
    beforeElement.parentNode.insertBefore(feedback, beforeElement.nextSibling)
}

function removePreviousFeedbackMessages() {
    console.log('here two')
    const feedbackMessages = document.querySelectorAll('#feedback')
    feedbackMessages.forEach((message) => {
        message.remove()
    })
}

const loginBtn = document.getElementById('login-submit')
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    await sendLoginData()
})

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
async function sendLoginData() {
    try {
        removePreviousFeedbackMessages()
        const email = emailInput.value
        const password = passwordInput.value        
        const response = await fetch(
            '/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            }
        )
        if (!response.ok) {
            const data = await response.json()
            if (response.status === 400) {
                feedback(passwordInput, data.message)
            } else {
                feedback(passwordInput, "server error")
            }
            return
        }
        window.location.href = response.url
    } catch(error) {
        console.log(error)
    }
}