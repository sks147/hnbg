const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  article_id: { type: Number, required: true },
  url: { type: String, default: '' },
  hn_url: { type: String, default: '' },
  posted_on: { type: Date },
  upvotes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
});

module.exports = Article = mongoose.model('article', ArticleSchema);
