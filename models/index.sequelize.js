const { sequelize } = require('../config/database');
const Section = require('./Section.sequelize');
const Link = require('./Link.sequelize');
const Tag = require('./Tag.sequelize');
const { LinkTag } = require('./LinkTag');

// Export all models and sequelize instance
module.exports = {
  sequelize,
  Section,
  Link,
  Tag,
  LinkTag
};
