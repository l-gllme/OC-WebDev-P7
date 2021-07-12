const models = require('../models');


module.exports = {

    createPost: function (req, res) {
        const post = {
            tittle: req.body.tittle,
            userId: req.body.id,
            content: req.body.content,
            url: req.body.url,
        }
        console.log(post)
        models.Post.create(post)
        .then(result => {res.status(201).json({ message: 'Post created successfully', post: result});
        })
        .catch(error => res.status(500).json({ error }));
    },
    getOnePost: function (req, res) {
        const id = req.params.id;
        models.Post.findByPk(id)
        .then(result => {res.status(200).json(result);
        }).catch(error => {res.status(500).json({message: 'Something went wrong'});
        });
    },

    getAllPost: function (req, res) {
        models.Post.findAll({
           order:[['id', 'ASC' ]],
            include:{
                model:models.User,
            }})
            .then(result => { res.status(200).json(result);})
            .catch(error => {res.status(500).json({message: 'Something went wrong'});
        });
    },
    deletePost: function (req, res) {
        const id = req.params.id
        const userId = req.body.userId
        const postUserId = req.body.postUserId
      if (!userId || !id) {
        res.status(401).json({message: "request invalid"});
        return;
      }

      // Is authorized
      let allowed = req.body.isAdmin;
      if (userId == postUserId) allowed = true
      if (!allowed) {
        res.status(401).json({message: "not allowed"})
        return;
      }
        models.Post.destroy({ where: { id: id } })
            .then(result => {res.status(200).json({message: "Post deleted successfully"})})
            .catch(error => {res.status(500).json({message: "Somenthing went wrong", error : 'error' })})
    },
}