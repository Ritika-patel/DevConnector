const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



router.get('/', auth, async(req, res) => {
    try{
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server error')

    }
})

//@route POST api/auth
//@desc  Authenticate user and get token
//@access  Public

router.post('/',
 [


    check('email', 'Please enter a valid email address')
    .isEmail(),

    check('password', 'Password is required')
    .exists()

],
async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }

    const  {  email, password } = req.body

    try{
    //see if user exists 
    let user = await User.findOne({ email })

    if(!user){
       return res
       .status(400)
       .json({ errors: [{msg: 'invalid Credientials'}]})
    }


    //password matches
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        return res
        .status(400)
        .json({ errors: [{msg: 'invalid Credientials'}]})
     }

    //Return jsonwebtoken
    
    const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '30 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
         // res.send({user});
          
        } 
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router