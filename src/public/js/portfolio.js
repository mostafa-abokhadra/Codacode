


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
function renderPortfolioData(element, elementValue) {
    try {
        if (element) {
            if (!elementValue) {
                if (element.id === 'portfolio-image') {
                    element.setAttribute(
                        'src', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010')
                } else if (element.id === 'portfolio-name'){
                    element.textContent = localStorage.getItem('urlUserName')
                } else if (element.id == 'portfolio-tagline') {
                    element.textContent = 'edit from above right corner button to add your tagline...'
                } else if (element.id === 'portfolio-about') {
                    element.textContent = 'edit from above right corner button to add your about info...'
                }
                return
            } else {
                if (element.id === 'portfolio-image')
                    element.setAttribute('src', elementValue)
                else if (element.id === 'portfolio-name') {
                    element.textContent = elementValue
                }
                else if (element.id === 'portfolio-tagline') {
                    element.textContent = elementValue
                } else if (element.id === 'portfolio-about') {
                    element.textContent = elementValue
                }
            }
        } else {
            console.error(`An Error: can't get elemenet`)
        }
    } catch(error) {
        console.error('An Unexpected Error Occured: ' ,error)
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

function createEducationCard(educationContainer, education) {
    try {
        if (!educationContainer)
            throw new Error(`can't render education-container`)
        if (education.length === 0) {
            const noEducationCardsToRender = document.getElementById('noEducationCardsToRender')
            educationContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            noEducationCardsToRender.classList.remove('hidden')
            return
        }
        education.map((anEducation) => {
            const educationCardElement = document.createElement('div')
            educationCardElement.className =
                "group relative bg-gradient-to-r from-green-100 to-blue-100 p-6 \
                rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                const menueElement = createEditDeleteMenue(editEducation, deleteEducation, anEducation.id)
            educationCardElement.innerHTML = `
                ${menueElement}
                <div class="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600 transition">
                    🎓
                </div>
                <h3 class="text-2xl font-semibold text-gray-800">
                    ${anEducation.organization}
                </h3>
                <p class="text-gray-600 text-sm">${anEducation.degree} in ${anEducation.course}</p>
                <p class="text-gray-700 font-medium mt-2">
                    ${anEducation.startDate.split('T')[0].replaceAll('-', '/')} - ${anEducation.endDate.split('T')[0].replaceAll('-', '/')}</p>
                <div class="mt-4">
                    <span
                        class="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full"
                    >
                        Honours
                    </span>
                </div>
            `
            educationContainer.appendChild(educationCardElement)
        })
    } catch (error) {
        console.error('An Unexpected Error Occurred: ', error)
    }
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

function editEducation() {
    alert("Edit function triggered");
}

function deleteEducation() {
    alert("Delete function triggered");
}

function createExperienceCard(projectContainer, projects) {
    try {
        if (!projectContainer)
            throw new Error(`can't render experience-container`)
        if (projects.length === 0) {
            projectContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            const noProjectCardsToRender = document.getElementById('noProjectCardsToRender')
            noProjectCardsToRender.classList.remove('hidden')
            noProjectCardsToRender.style = "justify-self: center"
            return
        }
        projects.map((aProject) => {
            const projectCardElement = document.createElement('div')
            projectCardElement.className = `relative bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition a-project`
            const menue = createEditDeleteMenue()
            projectCardElement.innerHTML = 
            `
            <div style="display: grid; padding-bottom: 5px">
                ${menue}
                <h3 style="margin: 0px"class="text-xl font-semibold mt-4">${aProject.title}</h3>
            </div>
                <img
                    src="${aProject.image}"
                    alt="Project 1 photo"
                    class="w-full h-40 object-cover rounded-lg"
                />
                
                <p class="mt-2">${aProject.description}</p>
                <a href=${aProject.link} target='_blank' class="text-primary mt-4 inline-block">View Project →</a>
            `
            projectContainer.appendChild(projectCardElement)
        })
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}

function createSkillCard(skillsContainer, skills) {
    try {
        if (!skillsContainer) {
            throw new Error('An Unexpected Error Occur')
        }
        if (skills.length === 0) {
            skillsContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            const noSkillCardsToRender = document.getElementById('noSkillCardsToRender')
            noSkillCardsToRender.classList.remove('hidden')
            noSkillCardsToRender.style = `justify-self: center`
            return
        }
        skills.map((aSkill) => {
            const skillElement = document.createElement('div')
            skillElement.id = aSkill.id
            skillElement.className = "bg-gray-100 p-6 relative rounded-lg shadow-md a-skill"
            const menue = createEditDeleteMenue()
            skillElement.innerHTML = `${menue} <h3 class="text-xl font-semibold">${aSkill.name}</h3>`
            skillsContainer.appendChild(skillElement)
        })
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}
function createSocialMediaLinks(contactContainer, links){
    try {
        if (!contactContainer)
            throw new Error(`can't render contact container`)
        if (!links) {
            const noContactInfoToRender = document.getElementById('noContactInfoToRender')
            noContactInfoToRender.classList.remove('hidden')
            return
        }

        Object.keys(links).map((key) => {
            if (links[key] && key !== 'id' && key !=='profile_id' && key !== 'profile') {

                const linkElement = document.getElementById(key)
                linkElement.classList.remove('hidden')

                if (key === 'email') {
                    linkElement.setAttribute('href', `mailto:${links[key]}`)
                } else if (key === 'number') {
                    if (links[key].number)
                        linkElement.setAttribute('href', `tel:+${links[key]['countryCode']}${links[key]['number']}`)
                } else {
                    linkElement.setAttribute('href', `${links[key]}`)
                }
            }
        })
    } catch(error) {
        console.error('An Unexpected Error Occured', error)
    }
}

async function handlePortfolioImageUpload(portfolioImageUpload){
    if (portfolioImageUpload) {
        portfolioImageUpload.addEventListener('change', async (event) => {
            const file = event.target.files[0]; // Get the selected file

            if (!file) {
                console.error("No file selected.");
                return;
            }

            const formData = new FormData();
            formData.append('portfolio-image', file);
            const response = await sendProfilePhoto(formData)
            console.log('res', response)

            const portfolioImage = document.getElementById('portfolio-image')
            portfolioImage.setAttribute('src', response.path);
            window.location.reload()
        })
    }
}

async function sendProfilePhoto(formData) {
    try {
        const username = localStorage.getItem("fullName");
        if (!username) throw new Error("User not found in localStorage");

        const sendProfilePhoto = await fetch(
            `/${username}/portfolio/image`, {
                method: 'PUT',
                body: formData
            }
        );
        
        if (!sendProfilePhoto.ok) {
            throw new Error(`HTTP error! Status: ${sendProfilePhoto.status}`);
        }

        return await sendProfilePhoto.json();
    } catch(error) {

    }
}

function removeErrorMessages() {
    const existErrorMessages = document.querySelectorAll(`.error-message`);
    existErrorMessages.forEach((message) => {
        message.remove();
    });
}

const editAboutBtn = document.getElementById('edit-about-btn')
function openAboutPopup() {
    aboutPopup.classList.remove("hidden");
}
editAboutBtn.addEventListener('click', openAboutPopup)
const closeAboutPopupBtn = document.querySelector('.close-about-popup')

function closeAboutPopup() {
    removeErrorMessages()
    aboutPopup.classList.add("hidden");
}
closeAboutPopupBtn.addEventListener('click', closeAboutPopup)

function handleAboutData(sendAboutDataBtn) {
    if (sendAboutDataBtn) {
        sendAboutDataBtn.addEventListener('click', (event) => {
            const name = document.getElementById('name').value
            const tagline = document.getElementById('tagline').value
            const about = document.getElementById('about').value
            sendAboutDataToServer(name, tagline, about)
        })
    }
}
function createErrorElement(msg) {
    const errorElement = document.createElement('small')
    errorElement.setAttribute(
        'style', 'color: red; display: flex; margin-bottom: 5px;')
        errorElement.className = `error-message`
    errorElement.textContent = msg
    return errorElement
}
async function  sendAboutDataToServer(name, tagline, about) {
    removeErrorMessages()
    const data = {
        name: name,
        tagline: tagline,
        about: about
    }
    const response = await fetch(
        `/portfolio/about`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    if (!response.ok) {
        if (response.status === 400) {
            const errors = await response.json()
            const existErrorMessages = document.querySelectorAll(`.error-message`)
            existErrorMessages.forEach((message) => {
                message.remove()
            })
            for(let i = 0; i < errors.errors.length; i++) {
                if (errors.errors[i].path === 'name') {
                    const nameFormGroup = document.getElementById('name-form-group')
                    nameFormGroup.setAttribute('style', 'margin-bottom: 5px;')
                    
                    errorElement = createErrorElement(errors.errors[i].msg)
                    nameFormGroup.insertAdjacentElement('afterend', errorElement)
                }
                if (errors.errors[i].path === 'tagline') {
                    const taglineFormGroup = document.getElementById('tagline-form-group')
                    taglineFormGroup.setAttribute('style', 'margin-bottom: 5px;')
                    errorElement = createErrorElement(errors.errors[i].msg)
                    taglineFormGroup.insertAdjacentElement('afterend', errorElement)
                }
                if (errors.errors[i].path === 'about') {
                    const aboutFormGroup = document.getElementById('about-form-group')
                    aboutFormGroup.setAttribute('style', 'margin-bottom: 5px;')
                    errorElement = createErrorElement(errors.errors[i].msg)
                    aboutFormGroup.insertAdjacentElement('afterend', errorElement)
                }
            }
        } else if(response.status === 500) {
            const serverError = document.getElementById('serverErrorPopup')
            serverError.classList.remove('hidden')
        }
    }
    const responseData = await response.json()
    const portfolioName = document.getElementById('portfolio-name')
    portfolioName.textContent = responseData.data.name

    const portfolioTagline = document.getElementById('portfolio-tagline')
    portfolioTagline.textContent = responseData.data.tagline

    const portfolioAbout = document.getElementById('portfolio-about')
    portfolioAbout.textContent = responseData.data.about

    closeAboutPopupBtn.click()
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

(async () => {

    const data = await getPortfolio();
    localStorage.setItem('portfolio', JSON.stringify(data.portfolio))

    const profilePictureElement = document.getElementById('portfolio-image')
    const nameElement = document.getElementById('portfolio-name')
    const taglineElement = document.getElementById('portfolio-tagline')
    const aboutElement = document.getElementById('portfolio-about')
    const educationContainer = document.getElementById('education-container')
    const projectContainer = document.getElementById('projects-container')
    const skillsContainer = document.getElementById('skills-container')
    const contactContainer = document.getElementById('links-container');

    renderPortfolioData(profilePictureElement, data.portfolio.image)
    renderPortfolioData(nameElement, data.portfolio.name)
    renderPortfolioData(taglineElement, data.portfolio.tagline)
    renderPortfolioData(aboutElement, data.portfolio.about)
    createEducationCard(educationContainer, data.portfolio.education)
    createExperienceCard(projectContainer, data.portfolio.projects)
    createSkillCard(skillsContainer, data.portfolio.skills)
    createSocialMediaLinks(contactContainer, data.portfolio.contact)

    const portfolioImageUpload = document.getElementById('profile-image-upload')
    handlePortfolioImageUpload(portfolioImageUpload)
    
    const sendAboutDataBtn = document.getElementById('send-about-data')
    handleAboutData(sendAboutDataBtn)

    const sendEducationDataBtn = document.getElementById('send-education-data')
    handleEducationData(sendEducationDataBtn)

})();
