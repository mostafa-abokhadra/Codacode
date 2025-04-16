if (localStorage.getItem('urlUserName')) {
    const logoText = document.getElementById('logo-text')
    const signupBtn = document.getElementById('sign-up-btn')
    const loginBtn = document.getElementById('login-btn')
    const mobileSignupBtn = document.getElementById('mobile-signup-btn')
    const mobileloginBtn = document.getElementById('mobile-login-btn')
    mobileSignupBtn.classList.add('hidden')
    mobileloginBtn.classList.add('hidden')
    logoText.textContent = "Dashboard"
    signupBtn.classList.add('hidden')
    loginBtn.classList.add('hidden')
}

async function getPortfolio() {
    try {
        const username = localStorage.getItem("fullName");
        if (!username) throw new Error("User not found in localStorage");

        const getPortfolioResponse = await fetch(`/${username}/portfolio`);
        
        if (!getPortfolioResponse.ok) {
            throw new Error(`HTTP error! Status: ${getPortfolioResponse.status}`);
        }

        return await getPortfolioResponse.json();
    } catch (error) {
        console.error("An Error Occurred:", error);
        return null;
    }

}

function createEditDeleteMenue(editFunction, deleteFunction, cardId) {
    const menueElement = document.createElement('div')
    menueElement.className = "absolute top-4 left-4"
    menueElement.innerHTML =
    `
        <button class="relative focus:outline-none" onclick="toggleMenu(this)">
            <span class="text-green-600 text-xl" style="font-weight: bold">&#x22EE;</span>
        </button>
        <div class="hidden absolute left-0 mt-2 w-28 bg-white border border-gray-200 shadow-md rounded-md z-10 py-1">
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="editEducation()">Edit</button>
            <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onclick="deleteEducation()">Delete</button>
        </div>
    `
    return menueElement.outerHTML
}


function toggleMenu(button) {
    const menu = button.nextElementSibling;
    menu.classList.toggle('hidden');
    document.addEventListener('click', function hideMenu(event) {
        if (!button.contains(event.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', hideMenu);
        }
    });
}


const educationPopup = document.getElementById("education-popup")
const openEducationPopupBtn = document.getElementById('open-education-popup')

openEducationPopupBtn.addEventListener('click', openEducationPopup)

function openEducationPopup() {
    educationPopup.classList.remove("hidden");
}

const closeEducationPopupBtn = document.querySelector('.close-education-popup')
closeEducationPopupBtn.addEventListener('click', closeEducationPopup)

function closeEducationPopup() {
    removeErrorMessages()
    educationPopup.classList.add('hidden')
}

function handleEducationData(sendEducationDataBtn) {
    sendEducationDataBtn.addEventListener('click', (event) => {
        const course = document.getElementById('course').value
        const degree = document.getElementById('degree').value
        const organization = document.getElementById('organization').value
        const startDate = document.getElementById('start-date').value
        const endDate = document.getElementById('end-date').value

        const startDateParts = startDate.split('-')
        const endDateParts = endDate.split('-')

        const startDateData = {
            day: Number(startDateParts[2]),
            month: Number(startDateParts[1]),
            year: Number(startDateParts[0])
        }

        const endDateData = {
            day: Number(endDateParts[2]),
            month: Number(endDateParts[1]),
            year: Number(endDateParts[0])
        }
        
        const data = {
            course: course,
            degree: degree,
            organization: organization,
            startDate: startDateData,
            endDate: endDateData
        }
        sendEducationData(data)
    })
}
async function sendEducationData(data) {
    try {
        removeErrorMessages()
        const response  = await fetch(
            '/portfolio/education', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        if (!response.ok) {
            const existErrorMessages = document.querySelectorAll(`.error-message`)
            existErrorMessages.forEach((message) => {
                message.remove()
            })
            const errors = await response.json()
            handleEducationErrors(response.status, errors.errors)
        }
        const responseData = await response.json()
        const educationContainer = document.getElementById('education-container')
        createEducationCard(educationContainer, responseData.education)
    } catch(error) {
        console.log(error)
    }
}

function handleEducationErrors(status, errors) {
    if (status === 400) {
        for(let i = 0; i < errors.length; i++) {
            const error = createErrorElement(errors[i].msg)
            const appendAfterElement = document.querySelector(`.${errors[i].path}`)
            appendErrorMessage(appendAfterElement, error)
        }
    }
}

function appendErrorMessage(appendAfterElement, errorElement) {
    appendAfterElement.insertAdjacentElement('afterend', errorElement)
}

const sendEducationDataBtn = document.getElementById('send-education-data')
handleEducationData(sendEducationDataBtn)