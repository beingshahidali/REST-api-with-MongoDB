const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/',(req,res) => {
    res.send('api users')
})

//update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (e) {
                return res.status(500).json({ error: 'Error hashing password' });
            }
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'Account has been updated', user: updatedUser });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Unable to update account at this moment' });
        }
    } else {
        return res.status(403).json({ error: 'You can update only your account' });
    }
});

//delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const updatedUser = await User.findByIdAndDelete(req.params.id); // we could have used deleteOne({ _id: req.params.id})
              res.status(200).json({ message: 'Account has been deleted' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Unable to delete account at this moment' });
        }
    } else {
        return res.status(403).json({ error: 'You can delete only your account' });
    }
});

//get a user

router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        !user && res.status(404).json({ message: 'Doesnt exist' });

        const {password,updatedAt,createdAt,...other}= user._doc;
        res.status(200).json({ user: other})
    }catch(err){res.status(500).json({ error: err.message})};
})

//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("User has been followed");
            } else {
                res.status(400).json('You already follow this user');
            }
        } catch (e) {
            res.status(500).json('Internal Server Error');
        }
    } else {
        res.status(400).send('You can\'t follow yourself');
    }
});



//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(400).json('You dont follow this user');
            }
        } catch (e) {
            res.status(500).json('Internal Server Error');
        }
    } else {
        res.status(400).send('You can\'t unfollow yourself');
    }
});

module.exports = router