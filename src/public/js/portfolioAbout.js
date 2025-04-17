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

            console.log(response)

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


function openAboutPopup() {
    aboutPopup.classList.remove("hidden");
}
function removeErrorMessages() {
    const existErrorMessages = document.querySelectorAll(`.error-message`);
    existErrorMessages.forEach((message) => {
        message.remove();
    });
}
function closeAboutPopup() {
    removeErrorMessages()
    aboutPopup.classList.add("hidden");
}
const editAboutBtn = document.getElementById('edit-about-btn')
editAboutBtn.addEventListener('click', openAboutPopup)
const closeAboutPopupBtn = document.querySelector('.close-about-popup')
closeAboutPopupBtn.addEventListener('click', closeAboutPopup)

const portfolioImageUpload = document.getElementById('profile-image-upload')
handlePortfolioImageUpload(portfolioImageUpload)

const sendAboutDataBtn = document.getElementById('send-about-data')
handleAboutData(sendAboutDataBtn)