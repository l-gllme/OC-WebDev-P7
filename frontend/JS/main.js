const token = 'Bearer ' + sessionStorage.getItem('token')

document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    let data = JSON.stringify({
        id: sessionStorage.getItem('userId'),
        tittle: document.getElementById('postTittle').value,
        content: document.getElementById('postText').value,
        url: document.getElementById('createLink').value
    })

    console.log(data)

    const response = await fetch('http://localhost:3000/api/posts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: data
    }, true)

    if (response.status == 201) {
        window.location.reload();
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
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
}
getAllPosts();

function displayPosts(post) {

    if (post.url == '') {
        let target = document.getElementById('posts');
        target.innerHTML +=
            `<a href="post.html?id=${+post.id}">
            <div class="container post col-10 col-sm-10 col-md-10 col-xl-10 bg-light ">
                <p class="container col-9 col-sm-9 col-md-6 col-xl-6 bg-white border" >${post.tittle}</p>
                <p class="content container col-11 col-sm-11 col-md-11 col-xl-11 bg-white">${post.content}</p>
                </div>
                </a>`
    } else {
        let target = document.getElementById('posts');
        target.innerHTML +=
            `<a href="post.html?id=${+post.id}">
            <div class="container post col-10 col-sm-10 col-md-10 col-xl-10 bg-light ">
                <p class="container col-9 col-sm-9 col-md-6 col-xl-6 bg-white border" >${post.tittle}</p>
                <p class="content container col-11 col-sm-11 col-md-11 col-xl-11 bg-white">${post.content}</p>
                <a href="${post.url}" target="_blank" ><p class="btn content container 
                col-3 col-sm-3 col-md-3 col-xl-3 bg-white">Click</p></a>
            </div>
        </a>`
    }
}
