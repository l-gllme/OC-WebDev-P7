const token = 'Bearer ' + localStorage.getItem('token')
const params = new URLSearchParams(document.location.search)
const paramValue = params.get('userId')
//Display user information

if (params.has('userId')) {
    const paramValue = params.get('userId')
    const getUserData = async () => {
        const response = await fetch('http://localhost:3000/api/users/' + paramValue, {
            headers: {
                'Authorization': token
            }
        })
        const user = await response.json()
        if (response.status == 201) {
            let username = document.getElementById('username')
            username.innerHTML = user.username
            let mail = document.getElementById('mail')
            mail.innerHTML = user.maskedEmail
        } else {
            alert('Error ' + response.status + 'Please Retry')
        }
    }
    getUserData();
} else {
    alert('Error Unkown user')
    window.location = 'main.html'
}

document.getElementById('edit').addEventListener('click', async (e) => {
    e.preventDefault()
    let editZone = document.getElementById('updateProfile')
    editZone.style.display = 'block'
})
document.getElementById('cancelUpdate').addEventListener('click', async (e) => {
    e.preventDefault()
    let editZone = document.getElementById('updateProfile')
    editZone.style.display = 'none'
})
//delete profile
document.getElementById('delete').addEventListener('click', async (e) => {
    e.preventDefault()
    let data = JSON.stringify({
        userId: localStorage.getItem('userId'),
        isAdmin: localStorage.getItem('isAdmin')
    })
    const response = await fetch('http://localhost:3000/api/users/' + localStorage.getItem('userId'), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })
    if (response.status == 200) {
        sessionStorage.clear()
        alert('Account successfully deleted')
        window.location = 'index.html'
    } else {
        alert('Error ' + response.status + 'Please Retry')
    }
})
//username
document.getElementById('changeUsername').addEventListener('click', async (e) => {
    e.preventDefault()
    let username = document.getElementById('new_userName').value
    let data = JSON.stringify({
        newUsername: username,
        userId: paramValue
    })
    if (username == "") {
        alert('Empty input')
    } else {
        const response = await fetch('http://localhost:3000/api/users/' + paramValue + '/username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        if (response.status == 200) {
            alert('Username updated')
            window.location.reload()
        } else {
            alert('Error ' + response.status + ' Please retry')
        }
    }
})

document.getElementById('changePassword').addEventListener('click', async (e) => {
    e.preventDefault()
    let password = document.getElementById('new_password').value
    let confirmPassword = document.getElementById('confirm_new_password').value

    if (password == confirmPassword) {

        let data = JSON.stringify({
            newPassword: password,
            userId: paramValue
        })
        if (password == "") {
            alert('Empty input')
        } else {
            const response = await fetch('http://localhost:3000/api/users/' + paramValue + '/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
            if (response.status == 201) {
                alert('password updated')
                window.location.reload()
            } else {
                response.json().then((data) => {alert(data.error)})
            }
        }
    }else {
    alert('Passwords do not match')
    }
})

document.getElementById('changeEmail').addEventListener('click', async (e) => {
    e.preventDefault()
    let email = document.getElementById('new_email').value
    let data = JSON.stringify({
        newEmail: email,
        userId: paramValue
    })
    if (email == "") {
        alert('Empty input')
    } else {
        const response = await fetch('http://localhost:3000/api/users/' + paramValue + '/email', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        if (response.status == 200) {
            alert('email updated')
            window.location.reload()
        } else {
            response.json().then((data) => {alert(data.error)})
        }
    }
})

