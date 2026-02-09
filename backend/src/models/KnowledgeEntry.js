import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

export const Notebook = sequelize.define('Notebook', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'notebooks',
  timestamps: true,
});

export const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  notebookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Notebook,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  manualTags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  aiTags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'pages',
  timestamps: true,
});

User.hasMany(Notebook, { foreignKey: 'userId', as: 'notebooks' });
Notebook.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Notebook.hasMany(Page, { foreignKey: 'notebookId', as: 'pages' });
Page.belongsTo(Notebook, { foreignKey: 'notebookId', as: 'notebook' });
