const router = require('express').Router();
const { User, Post } = require('../../models');
const withAuth = require('../../utils/auth');



// Get all posts
router.get('/', withAuth, async (req, res) => {
    try {
      const postData = await Post.findAll({where: {
        id:req.session.user_id
      }});

      const posts = await Post.findAll({where: {
        id:req.session.user_id
      }})
      

      
      res.render('posts', postData)
    } catch (err) {
      res.status(500).json(err);
    }
  });

// Get a single post
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk({where: { id: req.session.user_id},
      include: [{ model: Post }],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Added a route to get data to display posts for a user
router.get('/post', withAuth, async (req, res) => {
 
  try {

    //Get current expenses for the user);

    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: ['note', 'date_created']
    });

    //Get the User Data
    const userData = await User.findByPk(req.session.user_id, {
      attributes: ['name']
    });

    

  } catch (err) {
    res.status(500).json(err);
  }

});

// Create a post
router.post('/', withAuth, async (req, res) => {
  console.log("In post", req.body)
  try {
    const newPost = await Post.create({
      note: req.body.note,
      user_id: req.session.user_id
    });

    if (!newPost) {
      res.status(404).json({ message: 'New post creation failed' });
      return;
    }

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a post
router.put('/:id', async (req, res) => {
    try {
      const postData = await Post.update(req.body, {
        where: {
          id: req.params.id,
        },
        individualHooks: true
      });
      if (!postData[0]) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        category_id: req.params.id,
      },
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router;