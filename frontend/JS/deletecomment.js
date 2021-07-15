const token = 'Bearer ' + localStorage.getItem('token')

const params = new URLSearchParams(document.location.search)

let cParamValue = params.get('commentId')
let paramValue = params.get('id')

let userId = localStorage.getItem('userId')
let isAdmin = localStorage.getItem('isAdmin')

if (paramValue == undefined || cParamValue == undefined) {
    window.location = 'main.html'
}else{
    const getCommentData = async () => {

        let data = JSON.stringify({
            commentId: cParamValue
        })
        const response = await fetch('http://localhost:3000/api/posts/' + paramValue + '/comments/' + cParamValue, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: data
        })
        const comment = await response.json()
        if (response.status == 200) {
            sessionStorage.setItem('commentAuthorId', comment.userId)
        } else {
            alert('Error ' + response.status + 'Please Retry')
        }
    }
    getCommentData()

const deleteComment = async () => {

    let data = JSON.stringify({
        commentId: cParamValue,
        userId: userId,
        isAdmin: isAdmin,
        postId: paramValue,
        commentAuthorId: sessionStorage.getItem('commentAuthorId')
    })
    const response = await fetch('http://localhost:3000/api/posts/' + paramValue + '/comments/' + cParamValue, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: data
    })
    if (response.status == 200) {
        sessionStorage.clear
        window.location = 'post.html?id='+ paramValue
    } else {
        alert('Error ' + response.status + 'Please Retry')
    }
}
    deleteComment()
}
