const express = require('express')
const router = express.Router()
const config = require('config')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')



router.post('/', [
    check('name', 'Name is required')
    .not()     //should not be empty
    .isEmpty(),

    check('email', 'Please enter a valid email address')
    .isEmail(),

    check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min : 6 })

],
async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }

    const  { name, email, password } = req.body

    try{
    //see if user exists 
    let user = await User.findOne({ email })
    if(user){
       return res.status(400).json({ errors: [{msg: 'User already exists'}]})
    }

    //get users gravatar
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d:'mm'
    }) 

    user = new User({
        name,
        email,
        avatar,
        password,
    
    })

    //encrypt password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

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