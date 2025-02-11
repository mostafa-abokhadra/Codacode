const requestsContainer = document.getElementById('requests-container');
const requests = JSON.parse(requestsContainer.attributes.requests.value)
const user = JSON.parse(requestsContainer.attributes.user.value)

if (requests.requests.length === 0) {
    const noReq = document.getElementById('noRequests')
    noReq.classList.remove('hidden')
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

const acceptRequestButtons = document.querySelectorAll('#accept')
const acceptSuccessPopup = document.getElementById('acceptSuccessPopup');
const closeAcceptPopup = document.getElementById('closeAcceptSuccessPopup');

closeAcceptPopup.addEventListener('click', () => {
    acceptSuccessPopup.classList.add('hidden');
    window.location.reload()
});

const serverErrorPopup = document.getElementById('serverErrorPopup')
function closeErrorPopup() {
    serverErrorPopup.classList.add('hidden');
    window.location.reload()
}
for (let i = 0; i < acceptRequestButtons.length; i++) {
    
    acceptRequestButtons[i].addEventListener('click', async(event) => {
        const res = await fetch(
            `/${user.urlUserName}/requests/${acceptRequestButtons[i].attributes.requestId.value}/accept`,
            {method: 'post'})
            console.log(await res.json())
        if (!res.ok) {
            serverErrorPopup.classList.remove('hidden')
        } else {
            acceptSuccessPopup.classList.remove('hidden')
        }
    })
}

const rejectRequestButtons = document.querySelectorAll('#reject')
const confirmRejectPopup = document.getElementById('confirmRejectPopup')

for (let i = 0; i < rejectRequestButtons.length; i++) {
    rejectRequestButtons[i].addEventListener('click', async(event) => {
        confirmRejectPopup.setAttribute('requestId', rejectRequestButtons[i].attributes.requestId.value)
        confirmRejectPopup.classList.remove('hidden')
    })
}

const confirmRejectButton = document.getElementById('confirmRejectButton')
const closeConfirmRejectPopup = document.getElementById('closeConfirmRejectPopup')

closeConfirmRejectPopup.addEventListener('click', async(event) => {
    confirmRejectButton.parentElement.parentElement.parentElement.classList.add('hidden')
})
confirmRejectButton.addEventListener('click', async(event) => {
    const thirdParent = confirmRejectButton.parentElement
    ?.parentElement
    ?.parentElement;
    if (thirdParent && thirdParent.id === "confirmRejectPopup") {
        const requestId = thirdParent.getAttribute('requestId');
        if (requestId) {
            const res = await fetch(
                `/${user.urlUserName}/requests/${requestId}/reject`,
                {method: 'delete'}
            )
            if (!res.ok) {
                closeConfirmRejectPopup.click()
                serverErrorPopup.classList.remove('hidden')
            } else {
                window.location.reload()
            }
        }
    }
})

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
    <div class="card">
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
        <button style="height: fit-content;font-size:larger;font-weight:bold;" id="hideRequestCard" requestId="${cardData.id}">&#10060;</button>
    </div>
        <div class="card-content">
            Applied to <b>${cardData.role.position}</b> position to your <a href="#"><b>${cardData.role.post.title}</b></a> project
        </div>
        <div class="card-footer" style="display: block;">
            <span style="transition: 0.3s; font-size: 30px;">Status: </span>
            <button id="${status}" class="button ${status}" requestid="${cardData.id}" disabled style="background-color: ${statusColor}">${cardData.status}</button>
        </div>
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
            <button id="accept" class="button accept" requestId="${cardData.id}">Accept</button>
            <button id="reject" class="button reject" requestId="${cardData.id}">Reject</button>
        </div>
    `;
    return card
}

const hideRequestCard = document.querySelectorAll('#hideRequestCard')
for (let i = 0; i < hideRequestCard.length; i++) {
    hideRequestCard[i].addEventListener('click', async (event)=> {
        console.log(hideRequestCard[i])
        const requestId = hideRequestCard[i].attributes.requestId.value
        if (requestId) {
            const res = await fetch(
                `/${user.urlUserName}/requests/${requestId}/show`,
                {
                    method: 'put'
                }
            )
            window.location.reload()
        }
    })
}
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
                createUserAppliedPortfolioPopup(portfolioData)
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


function createUserAppliedPortfolioPopup(portfolioData) {
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
                <span id="portfolio-name" class="text-primary">${portfolioData.portfolio.name}</span>
            </h1>
            <p id="portfolio-tagline" class="text-xl mt-4">${portfolioData.portfolio.tagline}</p>
            <p id="portfolio-about" class="mt-4 max-w-lg">${portfolioData.portfolio.about}</p>
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
                class="grid md:grid-cols-4 gap-6 mt-6 max-w-6xl mx-auto"
            >
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
                class="grid md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto"
            >
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
                class="grid md:grid-cols-3 gap-6 mt-6 max-w-6xl mx-auto"
            >
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
                    <a
                        id="instagram"
                        href="${portfolioData.portfolio.contact.instagram}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="instagrma-icon" class="fab fa-instagram"></i>
                    </a>
                    <a
                        id="facebook"
                        href="${portfolioData.portfolio.contact.facebook}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="facebook-icon" class="fab fa-facebook"></i>
                    </a>

                    <a
                        id="linkedIn"
                        href="${portfolioData.portfolio.contact.linkedIn}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="linkedin-icon" class="fab fa-linkedin"></i>
                    </a>

                    <a
                        id="github"
                        href="${portfolioData.portfolio.contact.github}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="github-icon" class="fab fa-github"></i>
                    </a>

                    <a
                        id="youtube"
                        href="${portfolioData.portfolio.contact.youtube}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="youtube-icon" class="fab fa-youtube"></i>
                    </a>

                    <a
                        id="website"
                        href="${portfolioData.portfolio.contact.website}"
                        target="_blank"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="website-icon" class="fas fa-globe"></i>
                    </a>

                    <a
                        id="number"
                        href="+${portfolioData.portfolio.contact.number.countryCode}${portfolioData.portfolio.contact.number.number}"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="phone-icon" class="fas fa-phone"></i>
                    </a>

                    <a
                        id="email"
                        href="${portfolioData.portfolio.contact.email}"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="mail-icon" class="fas fa-envelope"></i>
                    </a>

                    <a
                        id="twitter"
                        href="${portfolioData.portfolio.contact.twitter}"
                        class="text-gray-600 hover:text-primary text-2xl hidden"
                    >
                        <i id="twitter-icon" class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        </section>

    `
    userPortfolioPopupContainer.appendChild(userPortfolioElement)
}