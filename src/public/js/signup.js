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

function containsLowercase(password) {
    let contains = false // assumning password don't contain small letter
    for(let i =0; i < password.length; i++) {
        const charCode = password.charCodeAt(i)
        if (charCode >= 97 && charCode <= 122) {
            contains = true
            break;
        }
    }
    return contains
}
function containsUppercase(password) {
    let contains = false 
    for(let i =0; i < password.length; i++) {
        const charCode = password.charCodeAt(i)
        if (charCode >= 65 && charCode <= 90) {
            contains = true
            break;
        }
    }
    return contains
}
function containsNumber(password) {
    let contains = false 
    for(let i =0; i < password.length; i++) {
        const charCode = password.charCodeAt(i)
        if (charCode >= 48 && charCode <= 57) {
            contains = true
            break;
        }
    }
    return contains
}
function containsSpecialCharacter(password) {
    let contains = false 
    for(let i =0; i < password.length; i++) {
        if (!CheckIsAlphaNum(password[i])) {
            contains = true
            break
        }
    }
    return contains
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
    // if (!(await checkFullNameAvailability(fullName))) {
    //     feedback(fullNameInput, 'name already found, please try another name')
    //     return 0
    // }
    return 1
}

// async function checkFullNameAvailability(fullName) {
//     try {
//         const response = await fetch(
//             '/auth/check-name',
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ fullName })
//             }
//         )
//         if (!response.ok) {
//             console.error('an error occured')
//         } else {
//             const data = await response.json()
//             return data.availablity
//         }
//     } catch(error) {
//         console.log(error)
//     }
// }

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

function checkPasswordValidity() {
    const password = passwordInput.value
    passwordInput.classList.remove('input-error')
    if (password === '') {
        feedback(passwordInput, 'password is required')
        return 0;
    }
    if (!containsLowercase(password)) {
        feedback(passwordInput, 'must contain at least 1 small letter')
        return 0;
    }
    if (!containsUppercase(password)) {
        feedback(passwordInput, 'must contain at least 1 cpital letter')
        return 0;
    }
    if (!containsSpecialCharacter(password)) {
        feedback(passwordInput, 'must contain at least 1 special letter')
        return 0;
    }
    if (!containsNumber(password)) {
        feedback(passwordInput, 'must contain at least 1 number')
        return 0;
    }
    if (password.length < 8) {
        feedback(passwordInput, 'password should be 8 letters or more')
        return 0;
    }
    return 1
}

function checkConfirmationValidity() {
    confirmPasswordInput.classList.remove('input-error')
    if (confirmPasswordInput.value === '') {
        feedback(confirmPasswordInput, 'confirmation is required')
        return 0;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
        feedback(confirmPasswordInput, `password don't match`)
        return 0;
    }
    return 1
}
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirm-password')

passwordInput.addEventListener('input', (e) => {
    removePreviousFeedbackMessages()
    checkPasswordValidity()
})
confirmPasswordInput.addEventListener('input', (e) =>{
    removePreviousFeedbackMessages()
    checkConfirmationValidity()
})
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

const signupBtb = document.getElementById('signup-submit-btn')
signupBtb.addEventListener('click', async (e) => {
    let allValidated = true
    e.preventDefault()
    // signupBtb.disabled = true; 
    removePreviousFeedbackMessages()
    if (!(await checkFullNameValidity())) {
        allValidated = false
    }
    if (!(await checkEmailValidity())) {
        allValidated = false
    }
    if (!checkPasswordValidity()) {
        allValidated = false
    } 
    if (!checkConfirmationValidity()) {
        allValidated = false
    } 

    if (allValidated) {
        sendRegistrationData()
    }
    await sendRegistrationData()

})

async function sendRegistrationData() {
    const fullName  = fullNameInput.value
    const email = emailInput.value
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value
    try {
        const response = await fetch(
            '/auth/signup',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({fullName, email, password, confirmPassword})
            }
        )
        const data = await response.json()

        localStorage.setItem('user', JSON.stringify(data.user))
        const rawUser = localStorage.getItem('user');
        let theUser = null;

        if (rawUser) {
            try {
                theUser = JSON.parse(rawUser);
                console.log("Parsed user:", theUser);
            } catch (e) {
                console.error("Couldn't parse user JSON:", e);
            }
        } else {
            console.warn("No user found in localStorage");
        }

        if (response.status === 400) {
            console.log('400 error')
            // show errors from the backend
            // already handled in the client side
        } else if(response.status === 500){
            console.log('500 error')
            // window.location.href = '/server-error'
        } else {
            console.log('no error')
            window.location.href = '/auth/github'
        }
        console.log(data)
        return
    } catch(error) {
        console.log(error)
    }
}
