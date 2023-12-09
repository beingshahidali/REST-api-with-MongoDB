const router = require('express').Router()
const { response } = require('express');
const Post = require('../models/Post')
const User = require('../models/User')
// router.get('/', (req, res) => {
//     res.send("haha posted")
// })

//create a post


router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//update a post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            return res.status(200).json('Your post has been updated successfully');
        } else {
            return res.status(403).json('You can update only your post');
        }
    } catch (e) {
        return res.status(500).json(e);
    }
});

//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json('Post not found');
        }

        if (post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json('Your post has been deleted successfully');
        } else {
            return res.status(403).json('You can delete only your post');
        }
    } catch (e) {
        return res.status(500).json(e);
    }
});

// like,dislike a post

router.put("/:id/like",async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json('Post has been liked');
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json('Post has been disliked');

        }
    }catch(e){
        res.send(500).json(e);
    }
})
//get a post
router.get('/:id',async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(e){res.status(500).json(e)}
})
//get all posts of the users following (timeline)

router.get('/timeline/all', async (req, res) => {
    let postArray = []
    try{

        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId=>{
               return Post.find({userId: friendId})
            })
        )
        res.json(userPosts.concat(...friendPosts))

    }catch(e){res.status(500).json(e)};
})


module.exports = router;
