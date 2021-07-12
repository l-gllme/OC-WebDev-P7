document.getElementById('disconect').addEventListener('click', function(e) {
    sessionStorage.clear()
    window.location = 'index.html'
})
document.getElementById('profile').addEventListener('click', function(e) {
    const userId = sessionStorage.getItem('userId')
    window.location = 'profile.html?userId=' + userId
})