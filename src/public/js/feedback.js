document.addEventListener('DOMContentLoaded', function() {
    const feedbackBanner = document.getElementById('feedbackBanner');

    if (feedbackBanner && !localStorage.getItem('feedbackDismissed')) {
        const closeBtn = feedbackBanner.querySelector('.close-btn');
        document.body.classList.add('has-banner');

        feedbackBanner.style.display = 'block';
        setTimeout(() => {
            feedbackBanner.style.top = '0';

            setTimeout(() => {
                if (feedbackBanner.style.top === '0px') {
                    feedbackBanner.style.top = '-100px';
                }
            }, 5000);
        }, 50); 

        closeBtn.addEventListener('click', function() {
                feedbackBanner.style.top = '-100px';
        });
        localStorage.setItem('feedbackDismissed', 'true')
    }
});