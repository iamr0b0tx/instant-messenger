const Conversation = require("./conversation");
const ConversationLog = require("./conversationLog");
const User = require("./user");
const Message = require("./message");

// associations
User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
User.belongsToMany(Conversation, {through: ConversationLog, as: "logs"});
Conversation.belongsToMany(User, {through: ConversationLog, as: "logs"});

module.exports = {
  User,
  Conversation,
  Message,
};
