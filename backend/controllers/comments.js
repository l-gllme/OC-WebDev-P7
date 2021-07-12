const models = require ('../models');

module.exports = {

    createComment : function(req, res){
    const comment = {
        userId: req.body.userId,
        postId: req.params.postId,
        content: req.body.content,
    }
    models.Comment.create(comment).then(result => {
        res.status(201).json({
            message: 'Comment created successfully', post: result });
        }).catch(error => {
            res.status(500).json({ message: 'Something went wrong', error: error })
        });
    },
    getOneComment : function(req, res){
        const id = req.params.commentId;
        const postId = req.params.id;
        models.Comment.findOne({
            include:{
            where:{postId: postId, id : id},
            model:models.User
            }
        }).then(result => {
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({ message: "Comment not found!" })
            }
        }).catch(error => {
            res.status(500).json({ message: "Something went wrong!" })
        });
    },
    getAllComments: function(req, res){
        models.Comment.findAll({
            where: {postId: req.params.postId},
            include:{
            model: models.User, 
            }
        }).then(result => {
            res.status(200).json(result);
        }) .catch(error => {
            res.status(500).json({ message: 'Something went wrong'});
        });
    },
    deleteComment: function(req, res){
        const id = req.params.commentId;
        const userId = req.body.userId;
        const postId = req.body.postId;
        const commentAuthorId = req.body.commentAuthorId
      if (!userId || !commentAuthorId) {
        res.status(401).json({message: "request invalid"});
        return;
      }
      let allowed = req.body.isAdmin;
      if (userId == commentAuthorId) allowed = true
      if (!allowed) {
        res.status(401).json({message: "not allowed"})
        return;
      }
        
        models.Comment.destroy({where: {id: id, postId: postId}})
        .then(result => { res.status(200).json({ message:"Comment deleted successfully" });
    }).catch(error => {res.status(500).json({ message: "Somenthing went wrong"});
    })
    }

}