const token = 'Bearer ' + localStorage.getItem('token')

const params = new URLSearchParams(document.location.search)

let paramValue = params.get('id')

let userId = localStorage.getItem('userId')
let isAdmin = localStorage.getItem('isAdmin')

//get one post 
const getPostData = async () => {
    const response = await fetch('http://localhost:3000/api/posts/' + paramValue, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    const post = await response.json()
    if (response.status == 200) {

        let time = moment(new Date(post.createdAt)).startOf('min').fromNow();

        let author = document.getElementById('postAuthor')
        author.innerHTML = 'Post by: ' + post.postAuthor
        let content = document.getElementById('postContent')
        content.innerHTML = post.content
        let link = document.getElementById('link')
        link.href = post.url
        let url = document.getElementById('postUrl')
        let createdAt = document.getElementById('createdAt')
        createdAt.innerHTML = time
        if (userId == post.userId) {
            let deleteBtn = document.getElementById('deletePost')
            deleteBtn.style.display = 'block'
            localStorage.setItem('postUserId', post.userId)
        }
        if (post.url != "") {
            url.innerHTML = post.url
            url.classList = 'col-9 col-sm-9 col-md-7 col-xl-6 rounded border bg-white border-primary'
        }
    } else {
        alert('Error ' + response.status + 'Please Retry')
    }
}
getPostData()

//delete post

document.getElementById('deletePost').addEventListener('click', async (e) => {
    e.preventDefault()
    let data = JSON.stringify({
        userId: userId,
        isAdmin: isAdmin,
        postUserId: localStorage.getItem('postUserId')
    })
    const response = await fetch('http://localhost:3000/api/posts/' + paramValue, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: data
    })
    if (response.status == 200) {
        alert('Post successfully deleted')
        window.location = 'main.html'
    } else {
        alert('Error ' + response.status + 'Please Retry')
    }
})

document.getElementById('createCommentForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    if (document.getElementById('commentText').value == "") {
        alert('Comment Empty')
    } else {
        let data = JSON.stringify({
            userId: localStorage.getItem('userId'),
            content: document.getElementById('commentText').value,
            postId: paramValue,
            commentAuthor: localStorage.getItem('username')
        })

        const response = await fetch('http://localhost:3000/api/posts/' + paramValue + '/comments', {
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
            alert('Error ' + response.status + '. Please retry')
        }
    }
})



const getAllComments = async () => {
    const response = await fetch('http://localhost:3000/api/posts/' + paramValue + '/comments', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    const comments = await response.json()
    if (response.status == 200) {
        for (let i = comments.length; i > 0; i--) {
            displayComments(comments[i - 1]);
        }
    } else {
        alert('Erreur ' + response.status + '. Veuillez réessayer')
    }
}
getAllComments();



function displayComments(comment) {

    let time = moment(new Date(comment.createdAt)).startOf('min').fromNow();

    if (userId == comment.userId) {

        let target = document.getElementById('comments');
        target.innerHTML +=

            `<div class="container col-11 col-sm-10 col-md-8 col-xl-6 bg-light rounded shadow-sm p-3 border border-dark mt-3">
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border" id="commentAuthor">Comment
                by: ${comment.commentAuthor}</p>
                <p class="container col-11 col-sm-11 col-md-11 col-xl-11 p-2 rounded border shadow-sm bg-white">${comment.content}</p>
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border">${time}</p>
                <a  href="redirect.html?id=${paramValue}&commentId=${comment.id}" class="deleteComment col-6 col-sm-5 col-md-3 col-xl-2 p-2 m-1 rounded 
                shadow-sm btn-danger deleteComment">Delete</>
            </div>`
    } else {
        let target = document.getElementById('comments');
        target.innerHTML +=
            `<div class="container col-11 col-sm-10 col-md-8 col-xl-6 bg-light rounded shadow-sm p-2 border border-dark mt-3">
            <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border" id="commentAuthor">Comment
            by: ${comment.commentAuthor}</p>
                <p class="container col-11 col-sm-11 col-md-11 col-xl-11 p-2 rounded border shadow-sm bg-white">${comment.content}</p>
                <p class="col-6 col-sm-6 col-md-4 col-xl-3 rounded border">${time}</p>
            </div>`

    }
}