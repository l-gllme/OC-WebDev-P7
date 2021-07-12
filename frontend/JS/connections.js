document.getElementById('signup-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    let data = {
        email: this.signup_email.value,
        username: this.signup_userName.value,
        password: this.signup_password.value
    }
    const response = await fetch('http://localhost:3000/api/users/signup', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if(response.status == 201) {
        alert('Utilisateur créé. Vous pouvez vous connecter.')
        window.location.reload()
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
        console.log(data)
    }
})

//Log in the application
document.getElementById('signin-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    let data = JSON.stringify({
        email: this.signin_email.value,
        password: this.signin_password.value
    })
    const response = await fetch('http://localhost:3000/api/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    let apiData = await response.json()
    if(response.status == 200) {
        sessionStorage.setItem('token', apiData.token)
        sessionStorage.setItem('userId', apiData.user)
        sessionStorage.setItem('isAdmin', apiData.isAdmin)
        sessionStorage.setItem('username', apiData.username)
        window.location = 'main.html'
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
})