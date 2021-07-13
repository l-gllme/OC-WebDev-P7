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

        let author = document.getElementById('postAuthor')
        author.innerHTML = 'Post by: ' + post.postAuthor
        let content = document.getElementById('postContent')
        content.innerHTML = post.content
        let link = document.getElementById('link')
        link.href = post.url
        let url = document.getElementById('postUrl')
        url.innerHTML = post.url
        url.classList = 'col-11 col-md-8 col-xl-4 rounded btn-transparent border container'
        if (isAdmin || userId == post.userId) {
            let deleteBtn = document.getElementById('deletePost')
            deleteBtn.style.display = 'block'
            localStorage.setItem('postUserId', post.userId)
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

    let data = JSON.stringify({
        userId: localStorage.getItem('userId'),
        content: document.getElementById('commentText').value,
        postId: paramValue
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

    const getUserData = async () => {
        const response = await fetch('http://localhost:3000/api/users/' + comment.userId, {
            headers: {
                'Authorization': token
            }
        })
        const user = await response.json()
        if (response.status == 201) {
            let commentAuthor = user.username
            localStorage.setItem('commentAuthor', commentAuthor)

        } else {
            alert('Error ' + response.status + 'Please Retry')
        }
    }

    getUserData();
    localStorage.setItem('commentAuthorId',comment.userId)
    commentAuthor = localStorage.getItem('commentAuthor')

    if (isAdmin || userId == comment.userId) {

        let target = document.getElementById('comments');
        target.innerHTML +=

        `<div class="container  col-10 col-sm-10 col-md-10 col-xl-10 bg-light ">
                <p class="content container col-11 col-sm-11 col-md-11 col-xl-5 bg-white" id="commentAuthor">Comment
                by: ${commentAuthor}</p>
                <p class="content container col-11 col-sm-11 col-md-11 col-xl-11 bg-white">${comment.content}</p>
                <a href="post.html?id=${paramValue}&commentId=${comment.id}"><div class="btn btn-danger col-6 col-md-3 col-xl-2 deleteComment">Delete Comment</div></>
            </div>`
    }else{
        `<div class="container  col-10 col-sm-10 col-md-10 col-xl-10 bg-light ">
            <p class="content container col-11 col-sm-11 col-md-11 col-xl-5 bg-white" id="commentAuthor">Comment
            by: ${commentAuthor}</p>
                <p class="content container col-11 col-sm-11 col-md-11 col-xl-11 bg-white">${comment.content}</p>
            </div>`
    }

}
/*let dell = document.getElementsByClassName('deleteComment')
for ( var i = 0 ; i < dell.length; i++){
    dell[i].addEventListener('click', async (e) => {
        e.preventDefault()
    
        let cParamValue = params.get('commentId')
    
        let data = JSON.stringify({
            userId: userId,
            isAdmin: isAdmin,
            commentAuthorId : localStorage.getItem('commentAuthorId')
        })
        const response = await fetch('http://localhost:3000/api/posts/' + ParamValue +'/comments/'+ cParamValue, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: data
        })
        if (response.status == 200) {
            alert('Post successfully deleted')
            location.reload
        } else {
            alert('Error ' + response.status + 'Please Retry')
        }
    })
}*/

