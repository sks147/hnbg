const moment = require('moment');

function toIST(unixTimestamp) {
  return moment
    .unix(unixTimestamp)
    .utcOffset('+05:30')
    .format('YYYY-MM-DDTHH:mm:ss');
}

module.exports = {
  toIST
};
