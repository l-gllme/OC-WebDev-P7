let connected = localStorage.getItem('token')

if (!connected) {
    localStorage.clear()
    alert('You are not connected')
    window.location = 'index.html'
}