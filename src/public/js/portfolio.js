async function getPortfolio() {
    try {
        const username = localStorage.getItem("urlUserName");
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


(async () => {
    const data = await getPortfolio();
console.log(data.portfolio)
    const profilePictureElement = document.getElementById('portfolio-image')
    renderPortfolioData(profilePictureElement, data.portfolio.image)

    const nameElement = document.getElementById('portfolio-name')
    renderPortfolioData(nameElement, data.portfolio.name)

    const taglineElement = document.getElementById('portfolio-tagline')
    renderPortfolioData(taglineElement, data.portfolio.tagline)

    const aboutElement = document.getElementById('portfolio-about')
    renderPortfolioData(aboutElement, data.portfolio.about)

    const educationContainer = document.getElementById('education-container')
    createEducationCard(educationContainer, data.portfolio.education)

    const projectContainer = document.getElementById('projects-container')
    createExperienceCard(projectContainer, data.portfolio.projects)
})();
