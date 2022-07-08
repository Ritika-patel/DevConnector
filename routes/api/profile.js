const express = require('express')
const request = require('request')
const config = require('config')

const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

//     GET api/profile/me
//     Get current users profile
//     Private
router.get('/me', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', ['name', 'email', 'avatar']
        )

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//     POST api/profile
//     Create or update user profile
//     Private
router.post(
    '/', [
        auth, [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('skills', 'Skills is required')
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body

        // Build profile object
        const profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (website) profileFields.website = website
        if (location) profileFields.location = location
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        // Build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (twitter) profileFields.social.twitter = twitter
        if (facebook) profileFields.social.facebook = facebook
        if (linkedin) profileFields.social.linkedin = linkedin
        if (instagram) profileFields.social.instagram = instagram

        try {
            let profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })

                return res.json(profile)
            }

            // Create
            profile = new Profile(profileFields)

            await profile.save()
            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//     GET api/profile
//     Get all profiles
//     Public
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', [
            'name',
            'email',
            'avatar'
        ])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//     GET api/profile/user/:user_id
//     Get profile by user ID
//     Public
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'email', 'avatar'])

        if (!profile) return res.status(400).json({ msg: 'Profile not found' })

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error')
    }
})

//     DELETE api/profile
//     Delete profile, user & posts
//     Private
router.delete('/', auth, async(req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id })
            // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })
            // Remove user
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: 'User deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//     PUT api/profile/experience
//     Add profile experience
//     Private
router.put(
    '/experience', [
        auth, [
            check('title', 'Title is required')
            .not()
            .isEmpty(),
            check('company', 'Company is required')
            .not()
            .isEmpty(),
            check('from', 'From date is required')
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })

            profile.experience.unshift(newExp)

            await profile.save()

            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//     DELETE api/profile/experience/:exp_id
//     Delete experience from profile
//     Private
router.delete('/experience/:exp_id', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        // Get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//     PUT api/profile/education
//     Add profile education
//     Private
router.put(
    '/education', [
        auth, [
            check('school', 'School is required')
            .not()
            .isEmpty(),
            check('degree', 'Degree is required')
            .not()
            .isEmpty(),
            check('fieldofstudy', 'Field of study is required')
            .not()
            .isEmpty(),
            check('from', 'From date is required')
            .not()
            .isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id })

            profile.education.unshift(newEdu)

            await profile.save()

            res.json(profile)
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    }
)

//     DELETE api/profile/education/:edu_id
//     Delete education from profile
//     Private
// router.delete('/education/:edu_id', auth, async (req, res) => {
// try {
// const profile = await Profile.findOne({ user: req.user.id });

// Get remove index
// const removeIndex = profile.education
// .map(item => item.id)
// .indexOf(req.params.edu_id);
/*
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/

router.delete('/education/:edu_id', auth, async(req, res) => {
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id })
        const eduIds = foundProfile.education.map(edu => edu._id.toString())
            // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
        const removeIndex = eduIds.indexOf(req.params.edu_id)
        if (removeIndex === -1) {
            return res.status(500).json({ msg: 'Server error' })
        }
        // theses console logs helped me figure it out
        /*   console.log("eduIds", eduIds);
      console.log("typeof eduIds", typeof eduIds);
      console.log("req.params", req.params);
      console.log("removed", eduIds.indexOf(req.params.edu_id));
 */
        foundProfile.education.splice(
            removeIndex,
            1
        )
        await foundProfile.save()
        return res.status(200).json(foundProfile)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'Server error' })
    }
})

//     GET api/profile/github/:username
//     Get user repos from Github
//     Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error)

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' })
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router