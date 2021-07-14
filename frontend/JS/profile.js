const token = 'Bearer ' + localStorage.getItem('token')

//Display user information
const params = new URLSearchParams(document.location.search)
if(params.has('userId')) {
    const paramValue = params.get('userId')
    const getUserData = async() => {
        const response = await fetch('http://localhost:3000/api/users/' + paramValue, {
            headers: {
                'Authorization': token
            }
        })
        const user = await response.json()
        if(response.status == 201) {
           let username =  document.getElementById('username')
           username.innerHTML = user.username
           let mail =  document.getElementById('mail')
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

document.getElementById('edit').addEventListener('click', async(e) => {
    e.preventDefault()
    let editZone = document.getElementById('updateProfile')
    editZone.style.display = 'block'
})
document.getElementById('cancelUpdate').addEventListener('click', async(e) => {
    e.preventDefault()
    let editZone = document.getElementById('updateProfile')
    editZone.style.display = 'none'
})
//delete profile
document.getElementById('delete').addEventListener('click', async(e) => {
    e.preventDefault()
    let data = JSON.stringify({
        userId: localStorage.getItem('userId'),
        isAdmin: localStorage.getItem('isAdmin')
    })
    const response = await fetch('http://localhost:3000/api/users/' + localStorage.getItem('userId') ,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body : data
    })
    if(response.status == 200) {
        sessionStorage.clear()
        alert('Account successfully deleted')
        window.location = 'index.html'
    } else {
        alert('Error ' + response.status + 'Please Retry')
    }
})