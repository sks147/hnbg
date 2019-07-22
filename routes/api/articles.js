const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');
const Profile = require('../../models/Profile');
const timeUtil = require('../../utils/time');
const authMiddleware = require('../../middleware/auth');
const request = require('request');

/*
 * Fetch article from hackernews api by article_id
 * */
async function fetchArticle(article_id) {
  try {
    const options = {
      uri: `${process.env.BASE_URL}item/${article_id}.json`,
      method: 'GET'
    };
    const hn_url = `${process.env.HN_BASE}item?id=${article_id}`;

    request(options, async (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        console.error(`'Not able to fetch Hackernews API' :${error.stack}`);
      }
      const { url, time, score, descendants } = JSON.parse(body);
      const articleFields = {
        article_id,
        url,
        hn_url,
        posted_on: timeUtil.toIST(time),
        upvotes: score,
        comments: descendants
      };
      let article = await Article.findOne({ article_id });

      if (article) {
        // Update
        article = await Article.findOneAndUpdate(
          { article_id: article_id },
          { $set: articleFields },
          { new: true, upsert: true }
        );
      } else {
        //Create
        article = new Article(articleFields);
        await article.save();
        console.log(`fetchArticle :${article_id}`);
      }
    });
  } catch (err) {
    console.error(`ERROR in fetchArticle :${err.stack}`);
  }
}

/*
 * Update and get top 90 articles
 * */
router.get('/', async (req, res) => {
  try {
    const options = {
      uri: `${process.env.BASE_URL}topstories.json`,
      method: 'GET'
    };

    let topNinety;
    await request(options, async (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res
          .status(404)
          .json({ msg: 'Not able to fetch Hackernews API' });
      }
      topNinety = JSON.parse(body).slice(0, 90);
      const promises = topNinety.map(article_id => fetchArticle(article_id));

      await Promise.all(promises);

      res.json(`topNinety articles fetched`);
    });
    // reverse chronological order
    const articles = await Article.find({}).sort({ posted_on: -1 });
    res.send(articles);
  } catch (err) {
    console.error(`ERROR in articles GET API path: '/' :${err.stack}`);
    res.status(500).send('Server Error');
  }
});

/*
 * Get individual article
 * */
router.get('/:article_id', async (req, res) => {
  try {
    const article = await Article.findOne({
      article_id: req.params.article_id
    }).populate('article', [
      'article_id',
      'url',
      'hn_url',
      'posted_on',
      'upvotes',
      'comments'
    ]);
    if (!article) {
      return res.status(400).json({ msg: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    console.error(
      `ERROR in articles GET API path: '/:article_id' :${err.stack}`
    );
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Article not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
