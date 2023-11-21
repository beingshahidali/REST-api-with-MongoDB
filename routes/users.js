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
//unfollow a user

module.exports = router