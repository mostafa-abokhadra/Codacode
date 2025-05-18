const requestsContainer = document.getElementById('requests-container');
const requests = JSON.parse(requestsContainer.dataset.requests)
const user = JSON.parse(requestsContainer.dataset.user)

const noReq = document.getElementById('no-requests')
if (requests.requests.length === 0)
    noReq.classList.remove('hidden')

function createAccepteAndRejectedCard(cardData) {
    const card = document.createElement('div')
    card.className = 'card'
    let statusColor, status; 
    if (cardData.status == 'rejected') {
        statusColor = "rgb(165 23 44)"
        status = 'reject'
    } else if (cardData.status == 'accepted') {
        statusColor = 'rgb(0, 80, 18)'
        status = 'accept'
    }
    card.innerHTML = 
    `
  
        <div style="display: flex; justify-content: space-between;">
            <a  href="#" class="card-header" style="width: 87%;">
                <div
                    class="user-image"
                    style="background-image: url(${cardData.userApplied.profile.image}); background-size: cover;">
                </div>
                <div class="user-info">
                    <div class="username">${cardData.userApplied.fullName}</div>
                    <div class="date">some date</div>
                </div>
            </a>
            <button id="hide-request-card-btn" class="hide-request-card" requestId="${cardData.id}">❌</button>
        </div>
        <div class="card-content">
            Applied to <b>${cardData.role.position}</b> position to your <a href="#"><b>${cardData.role.post.title}</b></a> project
        </div>
        <div class="card-footer" style="display: block;">
            <span style="transition: 0.3s; font-size: 30px;">Status: </span>
            <button id="${status}" class="button ${status}" requestid="${cardData.id}" disabled style="background-color: ${statusColor}">${cardData.status}</button>
        </div>
  
    `
    return card
}

function createCard(cardData) {
    const card = document.createElement('div')
    card.className = "card"
    // card.setAttribute('style', `position: absolute;`)
    card.innerHTML = 
    `
        <a id="user-applied-portfolio" data-user-applied="${cardData.userApplied.fullName}" class="card-header">
            <div class="user-image" style="background-image: url(${cardData.userApplied.profile.image}); background-size: cover;">
            </div>
            <div class="user-info">
                <div class="username">${cardData.userApplied.fullName}</div>
                <div class="date">some data</div>
            </div>
        </a>
        <div class="card-content">
            Applied to <b>${cardData.role.position}</b> position to your <a href="#"><b>${cardData.role.post.title}</b></a> project
        </div>
        <div class="card-footer">
            <button id="accept" class="button accept" requestId="${cardData.id}">accept</button>
            <button id="reject" class="button reject" requestId="${cardData.id}">Reject</button>
        </div>
    `;
    return card
}
for (let i = 0; i < requests.requests.length; i++) {
    let card;
    if (requests.requests[i].status == 'accepted' ||
        requests.requests[i].status == 'rejected') {
            card = createAccepteAndRejectedCard(requests.requests[i])
        } else {
            card = createCard(requests.requests[i])
        }
    requestsContainer.appendChild(card)
}

const acceptRequestButtons = document.querySelectorAll('.accept')

for (let i = 0; i < acceptRequestButtons.length; i++) {
    
    acceptRequestButtons[i].addEventListener('click', async(event) => {
        const res = await fetch(
            `/users/${user.id}/requests/${acceptRequestButtons[i].attributes.requestId.value}/accept`,
            {
                method: 'post'
            })
        if (!res.ok) 
            document.getElementById('server-error-popup').classList.remove('hidden')
        acceptSuccessPopup.classList.remove('hidden')
    })
}


const acceptSuccessPopup = document.getElementById('accept-success-popup');
// const closeAcceptPopup = document.getElementById('close-accept-popup');

document.getElementById('close-accept-popup').addEventListener('click', (e) => {
    acceptSuccessPopup.classList.add('hidden');
    window.location.reload()
});

const rejectRequestButtons = document.querySelectorAll('.reject')
const confirmRejectPopup = document.getElementById('confirm-reject-popup')

for (let i = 0; i < rejectRequestButtons.length; i++) {
    rejectRequestButtons[i].addEventListener('click', async(event) => {
        confirmRejectPopup.setAttribute('requestId', rejectRequestButtons[i].attributes.requestId.value)
        confirmRejectPopup.classList.remove('hidden')
    })
}

const confirmRejectButton = document.getElementById('confirm-reject-btn')
const closeConfirmRejectPopup = document.getElementById('close-confirm-reject-popup')

closeConfirmRejectPopup.addEventListener('click', async(event) => {
    confirmRejectButton.parentElement.parentElement.parentElement.classList.add('hidden')
})
confirmRejectButton.addEventListener('click', async(event) => {
    const thirdParent = confirmRejectButton.parentElement
    ?.parentElement
    ?.parentElement;
    if (thirdParent && thirdParent.id === "confirm-reject-popup") {
        const requestId = thirdParent.getAttribute('requestId');
        if (requestId) {
            const res = await fetch(
                `/users/${user.id}/requests/${requestId}/reject`,
                {
                    method: 'delete'
                })
            if (!res.ok) {
                closeConfirmRejectPopup.click()
                serverErrorPopup.classList.remove('hidden')
            } else {
                window.location.reload()
            }
        }
    }
})

const hideRequestCard = document.querySelectorAll('.hide-request-card')
for (let i = 0; i < hideRequestCard.length; i++) {
    hideRequestCard[i].addEventListener('click', async (event)=> {
        const requestId = hideRequestCard[i].attributes.requestId.value
        if (requestId) {
            const response = await fetch(
                `/users/${user.id}/requests/${requestId}/show`,
                {
                    method: 'PUT'
                }
            )
            if (!response.ok)
                document.getElementById('server-error-popup').classList.remove('hidden')
            else {
                if (document.querySelectorAll('.card').length === 1) {
                    hideRequestCard[i].parentElement.parentElement.remove()
                    noReq.classList.remove('hidden')
                } else 
                    hideRequestCard[i].parentElement.parentElement.remove()
            }
        }
    })
}
////////
const userPortfolioPopupContainer = document.getElementById('user-portfolio')

try {
    const usersAppliedPortfolioLInks = document.querySelectorAll('#user-applied-portfolio')
    if (usersAppliedPortfolioLInks) {
        usersAppliedPortfolioLInks.forEach((link) => {
            link.addEventListener('click', async (clickEvent) => {
                const userPortfolioPopupContainer = document.getElementById('user-portfolio')
                if (userPortfolioPopupContainer.firstChild) {
                    userPortfolioPopupContainer.firstChild.remove()
                }
            
                const userAppliedName = link.dataset.userApplied
                await getUserAppliedPortfolio(userAppliedName)
                window.scrollTo({ top: 0, behavior: "smooth" });
                // userPortfolioPopupContainer.scrollTo({ top: 0, behavior: "smooth" });
                
            })
        })
    }
} catch(error) {

}



async function getUserAppliedPortfolio(userAppliedName) {
    try {
        const userPortfolio = await fetch(`/${userAppliedName}/portfolio`)

        if (userPortfolio.ok) {
            const portfolioData = await userPortfolio.json()
            if (userPortfolioPopupContainer) {
                // userPortfolioPopup.addEventListener("click", (event) => {
                //     if (event.target === userPortfolioPopup) {
                //         userPortfolioPopup.classList.add("hidden");
                //     }
                // });
                let educationCards = null, experienceCards = null, skillCards = null, socialmediaLinks = null
                if (portfolioData.portfolio.education.length > 0) 
                    educationCards = createEducationCard(portfolioData.portfolio.education)
                if (portfolioData.portfolio.projects.length > 0) 
                    experienceCards = createExperienceCard(portfolioData.portfolio.projects)
                if (portfolioData.portfolio.skills.length > 0) {
                    skillCards = createSkillCard(portfolioData.portfolio.skills)
                }
                if (portfolioData.portfolio.contact) {
                    socialmediaLinks = createSocialMediaLinks(portfolioData.portfolio.contact)
                }

                createUserAppliedPortfolioPopup(portfolioData, educationCards, experienceCards, skillCards, socialmediaLinks)
                const closeBtn = document.getElementById('closeUserPortfolioPopup')
                closeBtn.addEventListener('click', (e) => {
                    if (userPortfolioPopupContainer.firstChild) {
                        userPortfolioPopupContainer.firstChild.remove()
                        userPortfolioPopupContainer.classList.add('hidden')
                    }
                })
                userPortfolioPopupContainer.classList.remove('hidden')
                // userPortfolioPopupContainer.addEventListener("click", (e) => {
                //     if (e.target === userPortfolioPopupContainer) {
                //         userPortfolioPopupContainer.classList.add("hidden");
                //     }
                // });

            } else {

            }
        } else {
            console.error(`An Error Occured With Status Code: ${userPortfolio.status}`)
        }
    } catch(error) {

    }
}


function createUserAppliedPortfolioPopup(portfolioData, educationCards, experienceCards, skillCards, socialmediaLinks) {
    const userPortfolioElement = document.createElement('div')
    userPortfolioElement.innerHTML = 
    `   
        <button
            id="closeUserPortfolioPopup"
            class="absolute top-4 right-4 px-3 py-1 bg-black text-white rounded-md shadow-lg hover:bg-green-700 transition"
        >
            close
        </button>
        <section
            class="flex flex-col md:flex-row items-center justify-center text-center md:text-left p-10 gap-10 animate-fadeIn relative mt-10"
        >
        <img
            id="portfolio-image"
            src="${portfolioData.portfolio.image}"
            alt="User Image"
            class="w-60 h-60 rounded-full border-4 border-primary shadow-lg"
        />
        <div>
            <h1 class="text-5xl font-bold">
                Hi, I'm
                <span id="portfolio-name" class="text-primary">${portfolioData.portfolio.name ? portfolioData.portfolio.name : `no information found`}</span>
            </h1>
                
            <p id="portfolio-tagline" class="text-xl mt-4">${portfolioData.portfolio.tagline? portfolioData.portfolio.tagline: `no information found`}</p>
            
            <p id="portfolio-about" class="mt-4 max-w-lg">${portfolioData.portfolio.about? portfolioData.portfolio.about: `no information found`}</p>
            <div class="flex gap-4 mt-6">
            <a
                href="#projects"
                class="px-6 py-3 bg-primary rounded-full shadow-lg hover:bg-green-700 transition"
                >My Projects</a
            >
            <a
                href="#contact"
                class="px-6 py-3 border border-primary rounded-full shadow-lg hover:bg-primary transition"
                >Contact</a
            >
            </div>
        </div>
        </section>

        <section
            style="width: 90%"
            class="py-20 bg-white text-center animate-fadeIn relative"
            >
            <h2 class="text-4xl font-bold">Education</h2>
            <div
                id="education-container"
                class="grid ${portfolioData.portfolio.education.length > 0 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 mt-6 max-w-6xl mx-auto p-10"
            >
            ${portfolioData.portfolio.education.length === 0 ?
                `<span style="text-align: center">No information found</span>`:
                educationCards.map((anEducation)=>{return anEducation.outerHTML})
            }
            </div>
        </section>

        <section
            style="width: 90%"
            id="projects"
            class="py-20 text-center animate-fadeIn relative"
        >
            <h2 class="text-4xl font-bold">Projects</h2>
            <div
                id="projects-container"
                class="grid ${portfolioData.portfolio.projects.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6 mt-6 max-w-6xl mx-auto p-10"
            >
                ${portfolioData.portfolio.projects.length === 0 ?
                    `<span style="text-align: center">No information found</span>`:
                    experienceCards.map((anExperience)=>{return anExperience.outerHTML})
                }
            </div>
        </section>

        <section
            id="skills"
            class="py-20 text-center animate-fadeIn relative bg-white"
            style="width: 90%"
        >
            <h2 class="text-4xl font-bold">Skills</h2>
            <div
                id="skills-container"
                class="grid ${portfolioData.portfolio.skills.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-1'} gap-6 mt-6 max-w-6xl mx-auto p-10"
            >
            ${portfolioData.portfolio.skills.length === 0 ?
                `<span style="text-align: center">No information found</span>`:
                skillCards.map((aSkill)=>{return aSkill.outerHTML})
            }
            </div>
        </section>

        <section
            id="contact"
            class="py-20 bg-white text-center animate-fadeIn relative"
            style="width: 90%"
        >
            <h2 class="text-4xl font-bold">Contact Me</h2>

            <div class="mt-8">
                <div
                    id="links-container"
                    class="flex justify-center space-x-6 mt-4"
                >
                    ${ portfolioData.portfolio.contact
                        ? socialmediaLinks.map((aLink)=>{return aLink.outerHTML})
                        : `<span style="text-align: center">No information found</span>`
                    }
                </div>
            </div>
        </section>
    `
    userPortfolioPopupContainer.appendChild(userPortfolioElement)
}

function createEducationCard(education) {
    try {
        const educationCards = education.map((anEducation)=>{
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
            return educationCardElement
        })
        return educationCards
    } catch(error) {
        console.error('An Unexpexted Error Occur: ', error)
    }
}

function createExperienceCard(projects) {
    try {
        const projectCards = projects.map((aProject) => {
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
            return projectCardElement
        })
        return projectCards
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}

function createSkillCard(skills) {
    try {
        const skillCards = skills.map((aSkill) => {
            const skillElement = document.createElement('div')
            skillElement.id = aSkill.id
            skillElement.className = "bg-gray-100 p-6 rounded-lg shadow-md a-skill"
            skillElement.innerHTML = `<h3 class="text-xl font-semibold">${aSkill.name}</h3>`
            return skillElement
        })
        return skillCards
    } catch(error) {
        console.error('An Unexpected Error Occur: ', error)
    }
}

function createSocialMediaLinks(links){
    try {
        const socialmediaLinks = Object.keys(links)
        .filter((key) => links[key] && key !== 'id' && key !== 'profile_id' && key !== 'profile')
        .map((key) => {
            let theLink = null
            if (key === 'email') {
                theLink = createSocialMediaLinkElement(key, 'fas fa-envelope')
                theLink.setAttribute('href', `mailto:${links[key]}`)
            } else if (key === 'number') {
                theLink = createSocialMediaLinkElement(key, 'fas fa-phone')
                theLink.setAttribute('href', `tel:+${links[key]['countryCode']}${links[key]['number']}`)
            } else {
                const iconClassMap = {
                    instagram: 'fab fa-instagram',
                    twitter: 'fab fa-twitter',
                    youtube: 'fab fa-youtube',
                    github: 'fab fa-github',
                    website: 'fas fa-globe',
                    linkedIn: 'fab fa-linkedin',
                    facebook: 'fab fa-facebook'
                };
                if (iconClassMap[key]) {
                    theLink = createSocialMediaLinkElement(key, iconClassMap[key]);
                    theLink.setAttribute('href', links[key]);
                }
            }
            return theLink
        }).filter(Boolean);
        return socialmediaLinks
    } catch(error) {
        console.error('An Unexpected Error Occured', error)
    }
}

function createSocialMediaLinkElement(socialmedia, icon) {
    const linkElement = document.createElement('a')
    linkElement.className = "text-gray-600 hover:text-primary text-2xl"
    const logoElement = document.createElement('i')
    linkElement.id = socialmedia
    logoElement.id = `${socialmedia}-icon`
    logoElement.className = icon
    linkElement.appendChild(logoElement)
    return linkElement
}

document.getElementById('close-server-error').addEventListener('click', (e) => {
    serverErrorPopup.classList.remove('hidden')
})