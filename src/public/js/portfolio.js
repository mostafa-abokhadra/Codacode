if (localStorage.getItem('urlUserName')) {
    document.getElementById('logo-text').textContent = "Dashboard"
    document.getElementById('sign-up-btn').classList.add('hidden')
    document.getElementById('login-btn').classList.add('hidden')
    document.getElementById('mobile-signup-btn').classList.add('hidden')
    document.getElementById('mobile-login-btn').classList.add('hidden')
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

////////////////////////////////////////////////////
function renderAboutData(element, elementValue) {
    try {
        if (element) {
            if (!elementValue) {
                if (element.id === 'portfolio-image') {
                    element.setAttribute(
                        'src', 'https://www.treasury.gov.ph/wp-content/uploads/2022/01/male-placeholder-image.jpeg')
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

function createEditDeleteMenue(cardId) {
    const menueElement = document.createElement('div')
    menueElement.className = "absolute top-4 left-4"
    menueElement.innerHTML =
    `
        <button class="relative focus:outline-none" onclick="toggleMenu(this)">
            <span class="text-green-600 text-xl" style="font-weight: bold">&#x22EE;</span>
        </button>
        <div class="hidden absolute left-0 mt-2 w-28 bg-white border border-gray-200 shadow-md rounded-md z-10 py-1">
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >Edit</button>
            <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" >Delete</button>
        </div>
    `
    return menueElement.outerHTML
}

function educationElement(anEducation) {
    const educationCardElement = document.createElement('div')
    educationCardElement.className =
        "group relative bg-gradient-to-r from-green-100 to-blue-100 p-6 \
        rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
    const menueElement = createEditDeleteMenue(anEducation.id)
    educationCardElement.setAttribute('data-education-id', anEducation.id)
    educationCardElement.innerHTML = 
        `
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
        return educationCardElement

}
function createEducationCard(educationContainer, education) {
    try {
        let educationCardElement = document.createElement('div')
        const noEducationCardsToRender = document.getElementById('noEducationCardsToRender')
        if (!educationContainer)
            throw new Error(`can't render education-container`)
        if (
            typeof education === 'object' &&
            !Array.isArray(education) &&
            education !== null
        ) {
            educationCardElement = educationElement(education)
            closeEducationPopupBtn.click()
            noEducationCardsToRender.classList.add('hidden')
            educationContainer.className = "grid md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto"
            educationContainer.appendChild(educationCardElement)
        }  else if (education.length === 0) {
            educationContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            noEducationCardsToRender.classList.remove('hidden')
            return
        } else {
            education.map((anEducation) => {
                educationCardElement = educationElement(anEducation)
                educationContainer.appendChild(educationCardElement)
            })
        }
        
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

function experienceElement(aProject) {
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
        <a href="${aProject.link}" target='_blank' class="text-primary mt-4 inline-block">View Project →</a>
    `
    
    return projectCardElement
}

function createExperienceCard(projectContainer, projects) {
    try {
        
        let projectCardElement = document.createElement('div')
        const noProjectCardsToRender = document.getElementById('noProjectCardsToRender')

        if (!projectContainer)
            throw new Error(`can't render projects container`)
        if (
            typeof projects === 'object' &&
            !Array.isArray(projects) &&
            projects !== null
        ) {
            projectCardElement = experienceElement(projects)
            closeProjectPopupBtn.click()
            noProjectCardsToRender.classList.add('hidden')
            // projectContainer.className = "grid md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto"
            projectContainer.appendChild(projectCardElement)
        }
        if (projects.length === 0) {
            projectContainer.className = "grid md:grid-cols-1 gap-6 mt-6 max-w-6xl mx-auto"
            noProjectCardsToRender.classList.remove('hidden')
            noProjectCardsToRender.style = "justify-self: center"
            return
        }
        projects.map((aProject) => {
            projectCardElement = experienceElement(aProject)
            projectContainer.appendChild(projectCardElement)
        })
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}

///////////////////////////////////////
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

    renderAboutData(profilePictureElement, data.portfolio.image)
    renderAboutData(nameElement, data.portfolio.name)
    renderAboutData(taglineElement, data.portfolio.tagline)
    renderAboutData(aboutElement, data.portfolio.about)

    createEducationCard(educationContainer, data.portfolio.education)
    createExperienceCard(projectContainer, data.portfolio.projects)
    console.log( data.portfolio.projects)

    createSkillCard(skillsContainer, data.portfolio.skills)
    createSocialMediaLinks(contactContainer, data.portfolio.contact)

})();
