const token = 'Bearer ' + localStorage.getItem('token')

document.getElementById('disconect').addEventListener('click', function (e) {
    localStorage.clear()
    window.location = 'index.html'
})
document.getElementById('profile').addEventListener('click', function (e) {
    const userId = localStorage.getItem('userId')
    window.location = 'profile.html?userId=' + userId
})

document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    let data = JSON.stringify({
        id: localStorage.getItem('userId'),
        content: document.getElementById('postText').value,
        url: document.getElementById('createLink').value,
        postAuthor: localStorage.getItem('username')
    })

    const response = await fetch('http://localhost:3000/api/posts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: data
    }, true)

    if (response.status == 201) {
        window.location.reload()
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
})

const getAllPosts = async () => {
    const response = await fetch('http://localhost:3000/api/posts/all', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    const posts = await response.json()
    if (response.status == 200) {
        for (let i = posts.length; i > 0; i--) {
            displayPosts(posts[i - 1]);
        }
    } else {
        if (response.status == 401) {
            alert('You are disconected. Redirecting')
            window.location = 'index.html'
        } else {
            alert('Error ' + response.status + 'Please retry')
        }

    }
}
getAllPosts();

function displayPosts(post) {

    if (post.url == '') {
        let target = document.getElementById('posts');
        let time = moment(new Date(post.createdAt)).startOf('min').fromNow();
        target.innerHTML +=
            `<a href="post.html?id=${+post.id}">
            <div class="container col-11 col-sm-10 col-md-8 col-xl-6 bg-light rounded shadow-sm p-2 border border-dark mt-3 ">
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border" >${post.postAuthor} said:</p>
                <p class="container col-11 col-sm-11 col-md-11 col-xl-11 p-2 border shadow-sm
                bg-white">${post.content}</p>
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border">${time}</p>
                </div>
                </a>`
    } else {
        let target = document.getElementById('posts');
        let time = moment(new Date(post.createdAt)).startOf('min').fromNow();
        target.innerHTML +=
            `<a href="post.html?id=${+post.id}">
            <div class="container col-11 col-sm-10 col-md-8 col-xl-6 bg-light rounded shadow-sm p-2 border border-dark mt-3 ">
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border" >${post.postAuthor} said:</p>
                <p class="container col-11 col-sm-11 col-md-11 col-xl-11 p-2 rounded border shadow-sm
                bg-white">${post.content}</p>
                <a href="${post.url}" target="_blank" class="col-11">
                    <p class="rounded border bg-white border-primary">${post.url}</p>
                </a>
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border">${time}</p>
            </div>
        </a>`
    }
}
