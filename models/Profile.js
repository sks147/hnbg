const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  read_articles: { type: [Number] },
  deleted_articles: { type: [Number] }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
