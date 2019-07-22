const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const _ = require('lodash');

/*
 * Get current logged in user profile
 * */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'email']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No Profile available for user' });
    }
    res.json(profile);
    console.log(`profile :${JSON.stringify(profile)}`);
  } catch (err) {
    console.error(`ERROR in profile GET API path: '/me' :${err.stack}`);
    res.status(500).send('Server Error');
  }

  res.send('Profile route');
});

/*
 * Update user profile
 * */
router.post('/', authMiddleware, async (req, res) => {
  const { read_articles, deleted_articles } = req.body;
  const profileFields = {};
  profileFields.user = req.user.id;
  if (read_articles) {
    profileFields.read_articles = read_articles;
  }
  if (deleted_articles) {
    profileFields.deleted_articles = deleted_articles;
  }
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    //Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(`ERROR in profile POST API path: '/' :${err.stack}`);
    res.status(500).send('Server Error');
  }
});

/*
 * Get profile by user id
 * */
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'email']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(
      `ERROR in profile GET API path: '/user/:user_id' :${err.stack}`
    );
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

/*
 * Delete profile
 * */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    // Remove profile and User
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(
      `ERROR in profile GET API path: '/user/:user_id' :${err.stack}`
    );
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

/*
 * Update read articles list
 * */
router.post('/read/:article_id', authMiddleware, async (req, res) => {
  try {
    const article_id = req.params.article_id;
    let profile = await Profile.findOne({ user: req.user.id });
    if (
      _.findIndex(
        profile.read_articles,
        elem => elem === Number(article_id)
      ) !== -1
    ) {
      return res.status(400).send('Article already marked as read');
    }
    profile.read_articles.push(article_id);
    const update = { read_articles: profile.read_articles };
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, update, {
        new: true,
        upsert: true
      });
      return res.json(profile);
    }
    console.log(`profile '/' :${JSON.stringify(profile)}`);
  } catch (err) {
    console.error(
      `ERROR in profile POST API path: '/read/:article_id' :${err.stack}`
    );
    res.status(500).send('Server Error');
  }
});

/*
 * Update deleted articles list
 * */
router.post('/delete/:article_id', authMiddleware, async (req, res) => {
  try {
    const article_id = req.params.article_id;
    let profile = await Profile.findOne({ user: req.user.id });
    if (
      _.findIndex(
        profile.deleted_articles,
        elem => elem === Number(article_id)
      ) !== -1
    ) {
      return res.status(200).send('Article already deleted');
    }
    profile.deleted_articles.push(article_id);
    const update = { deleted_articles: profile.deleted_articles };
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, update, {
        new: true,
        upsert: true
      });
      return res.json(profile);
    }
    console.log(`profile '/' :${JSON.stringify(profile)}`);
  } catch (err) {
    console.error(
      `ERROR in profile POST API path: '/delete/:article_id' :${err.stack}`
    );
    res.status(500).send('Server Error');
  }
});

module.exports = router;
