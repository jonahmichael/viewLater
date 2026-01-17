const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Section = require('./Section.sequelize');

const Link = sequelize.define('Link', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: true,
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  favicon: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sectionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'sections',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'links',
  timestamps: true,
  indexes: [
    {
      fields: ['sectionId']
    },
    {
      fields: ['title']
    },
    {
      fields: ['url']
    },
    {
      type: 'FULLTEXT',
      fields: ['title', 'description']
    }
  ]
});

// Define association
Link.belongsTo(Section, {
  foreignKey: 'sectionId',
  as: 'section'
});

Section.hasMany(Link, {
  foreignKey: 'sectionId',
  as: 'links'
});

module.exports = Link;
