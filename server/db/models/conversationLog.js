const db = require("../db");
const Sequelize = require("sequelize");

const ConversationLog = db.define("conversationLog", {
  lastActiveAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = ConversationLog;
