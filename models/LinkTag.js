const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Link = require('./Link.sequelize');
const Tag = require('./Tag.sequelize');

// Many-to-Many junction table for Links and Tags
const LinkTag = sequelize.define('LinkTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  linkId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'links',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  tagId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'link_tags',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['linkId', 'tagId']
    }
  ]
});

// Define many-to-many associations
Link.belongsToMany(Tag, {
  through: LinkTag,
  foreignKey: 'linkId',
  otherKey: 'tagId',
  as: 'tags'
});

Tag.belongsToMany(Link, {
  through: LinkTag,
  foreignKey: 'tagId',
  otherKey: 'linkId',
  as: 'links'
});

module.exports = { LinkTag, Link, Tag };
