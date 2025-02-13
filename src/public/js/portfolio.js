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

function createEducationCard(educationContainer, education) {
    try {
        if (!educationContainer)
            throw new Error(`can't render education-container`)
        if (education.length === 0) {
            const noEducationCardsToRender = document.getElementById('noEducationCardsToRender')
            noEducationCardsToRender.classList.remove('hidden')
            return
        }
        education.map((anEducation)=>{
            const educationCardElement = document.createElement('div')
            educationCardElement.className =
                "group relative bg-gradient-to-r from-green-100 to-blue-100 p-6 \
                rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            educationCardElement.innerHTML = 
            `
                <div
                    class="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600 transition"
                >
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

    } catch(error) {
        console.error('An Unexpexted Error Occur: ', error)
    }
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
            projectCardElement.className = `bg-white p-6 rounded-lg shadow-lg hover:scale-105 transition a-project`
            projectCardElement.innerHTML = 
            `
                <img
                    src="${aProject.image}"
                    alt="Project 1 photo"
                    class="w-full h-40 object-cover rounded-lg"
                />
                <h3 class="text-xl font-semibold mt-4">${aProject.title}</h3>
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
            skillElement.className = "bg-gray-100 p-6 rounded-lg shadow-md a-skill"
            skillElement.innerHTML = `<h3 class="text-xl font-semibold">${aSkill.name}</h3>`
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

    const eidtAboutDataPopup = document.getElementById('edit-about-popup')
    const editAboutDataBtn = document.getElementById('edit-about-data')
    const closeEditAboutPopup = document.getElementById('close-edit-about-popup')
    const saveAboutData = document.getElementById('save-about-data')

    eidtAboutDataPopup.addEventListener('click', (e) => {
        if (e.target === eidtAboutDataPopup)
            eidtAboutDataPopup.setAttribute('style', `display: none`)
    })
    editAboutDataBtn.addEventListener('click', (e) => {
        eidtAboutDataPopup.setAttribute('style', 'display: flex')
        
    })
    closeEditAboutPopup.addEventListener('click', (e) => {
        eidtAboutDataPopup.setAttribute('style', `display: none`)
    })
    
    saveAboutData.addEventListener('click', async (e) => {
        document.querySelectorAll('.error-message').forEach((msg) => msg.remove());
        const name = document.getElementById('edit-name')
        const tagline = document.getElementById('edit-tagline')
        const about = document.getElementById('edit-about')
        const data = {
            name: name.value,
            tagline: tagline.value,
            about: about.value
        }
        const updatedData = await updateAboutSection(data)
        if (updatedData.hasOwnProperty('errors')) {
            updatedData.errors.map((error) => {
                const errorSpan =  document.createElement('span')
                errorSpan.className = "error-message"
                errorSpan.textContent = error.msg
                errorSpan.setAttribute('style', 'color: red; font-size: small')
                if (error.path === 'name') {
                    name.after(errorSpan)
                } else if (error.path === 'tagline') {
                    tagline.after(errorSpan)
                } else if (error.path === 'about') {
                    about.after(errorSpan)
                }
            })
        } else {
            closeEditAboutPopup.click()
            nameElement.textContent = updatedData.data.name
            taglineElement.textContent = updatedData.data.tagline
            aboutElement.textContent = updatedData.data.about
        }
    })

})();

async function updateAboutSection(data) {
    try {
        const updateAbout = await fetch(
            `/portfolio/about`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    tagline: data.tagline,
                    about:data.about
                })
            }
        )
        if (updateAbout.status === 500 ) {
            throw new Error('Network response was not ok');
        }
        return await updateAbout.json()
    } catch(error) {
        console.error('An Unexpected Error has Occured: ', error)
    }
}