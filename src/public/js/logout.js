const logoutBtns = document.querySelectorAll('.logout-link')
logoutBtns.forEach((logoutBtn) => {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    document.getElementById('logout-form').submit()
  })
})