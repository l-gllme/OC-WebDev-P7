document.getElementById('signup-form').addEventListener('submit', async(e) => {
    e.preventDefault()
    let data = {
        email: this.signup_email.value,
        username: this.signup_userName.value,
        password: this.signup_password.value
    }
    if (this.confirm_signup_password.value == data.password){

        const response = await fetch('http://localhost:3000/api/users/signup', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.status == 201) {
            alert('Registration successfully completed')
            window.location.reload()
        } else {
            response.json().then((data) => {alert(data.error)})
            
        }
    }else{
        alert('Passwords do not match')
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
        localStorage.setItem('token', apiData.token)
        localStorage.setItem('userId', apiData.user)
        localStorage.setItem('isAdmin', apiData.isAdmin)
        localStorage.setItem('username', apiData.username)
        window.location = 'main.html'
    } else {
        alert('Error ' + response.status + ' Please retry')
    }
})