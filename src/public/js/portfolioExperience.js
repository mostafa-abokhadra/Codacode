if (localStorage.getItem('urlUserName')) {
    document.getElementById('logo-text').textContent = "Dashboard"
    document.getElementById('sign-up-btn').classList.add('hidden')
    document.getElementById('login-btn').classList.add('hidden')
    document.getElementById('mobile-signup-btn').classList.add('hidden')
    document.getElementById('mobile-login-btn').classList.add('hidden')
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

function experienceElement(anExperience) {
    const experienceCardElement = document.createElement('div')
    experienceCardElement.className = `relative bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition a-experience`
    const menue = createEditDeleteMenue()
    experienceCardElement.innerHTML = 
    `
    <div style="display: grid; padding-bottom: 5px">
        ${menue}
        <h3 style="margin: 0px"class="text-xl font-semibold mt-4">${anExperience.title}</h3>
    </div>
        <img
            src="${anExperience.image}"
            alt="experience 1 photo"
            class="w-full h-40 object-cover rounded-lg"
        />
        
        <p class="mt-2">${anExperience.description}</p>
        <a href=${anExperience.link} target='_blank' class="text-primary mt-4 inline-block">View experience →</a>
    `
    return experienceCardElement
}

function createExperienceCard(experienceContainer, experiences) {
    try {
        let experienceCardElement = document.createElement('div')
        const noExperienceCardsToRender = document.getElementById('noProjectCardsToRender')

        if (!experienceContainer)
            throw new Error(`can't render experiences container`)
        if (
            typeof experiences === 'object' &&
            !Array.isArray(experiences) &&
            experiences !== null
        ) {
            experienceCardElement = experienceElement(experiences)
            closeExperiencePopupBtn.click()
            noExperienceCardsToRender.classList.add('hidden')
            // experienceContainer.className = "grid md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto"
            experienceContainer.appendChild(experienceCardElement)
        } else if (experiences.length === 0) {
            experienceContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            noExperienceCardsToRender.classList.remove('hidden')
            noExperienceCardsToRender.style = "justify-self: center"
            return
        } else {
            experiences.map((anExperience) => {
                experienceCardElement = experienceElement(anExperience)
                experienceContainer.appendChild(experienceCardElement)
            })
        }
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}


const experienceImageUploadBtn = document.querySelector('.project-photo-upload')
const experienceImageInput = document.getElementById('project-image')

experienceImageUploadBtn.addEventListener('click', (event) => {
    if(event.isTrusted) 
        experienceImageInput.click()
})
experienceImageInput.addEventListener('change', (event) => {
    const experiencePhotoMessage = document.getElementById('project-photo-message')
    const file = experienceImageInput.files[0]
    experiencePhotoMessage.textContent = `file: ${file.name} with file size: ${file.size}`
    
})
function sanitizeExperienceData() {

    const formData = new FormData()
    formData.append('experienceTitle', document.getElementById('project-title').value)
    formData.append('experienceDescription', document.getElementById('project-description').value)
    formData.append('porjectImage', document.getElementById('project-image').files[0])
    // formData.append('experienceRole', document.getElementById('project-role').value)
    formData.append('experienceLink', document.getElementById('project-link').value)
    // formData.append('linkedinPost', document.getElementById('linkedin-post').value)

    sendExperienceData(formData)
}

async function sendExperienceData(formData) {

    try {
        const response = await fetch(`/portfolio/experience`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            console.error('an Error')
        }
        const data = await response.json()
        console.log(data)
        const projectContainer = document.getElementById('projects-container')
        createExperienceCard(projectContainer, data.experience)
    } catch(error) {
        console.log('an error', error)
    }
}

function openExperiencePopup() {
    experiencePopup.classList.remove("hidden");
}
function closeExperiencePopup() {
    experiencePopup.classList.add("hidden");
}

const experiencePopup = document.getElementById('project-popup')
const openExperiencePopupBtn = document.getElementById('open-project-popup')
openExperiencePopupBtn.addEventListener('click', openExperiencePopup)

const closeExperiencePopupBtn = document.querySelector('.close-project-popup')
closeExperiencePopupBtn.addEventListener('click', closeExperiencePopup)

const sendexperienceDataBtn = document.getElementById('send-project-data')
sendexperienceDataBtn.addEventListener('click', sanitizeExperienceData)