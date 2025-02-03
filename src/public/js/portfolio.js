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

// Call the function
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
})();
