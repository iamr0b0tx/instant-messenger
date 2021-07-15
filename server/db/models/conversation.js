const { Op } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids
Conversation.findConversation = async function (user1Id, user2Id) {
  // return conversation or null if it doesn't exist
  return await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });
};

// check if is an existing conversation
Conversation.isValid = async function (conversationId, user1Id) {
  // return conversation or null if it doesn't exist
  const conversation = await Conversation.findByPk(conversationId);
   if (conversation?.user1Id !== user1Id && conversation?.user2Id !== user1Id) return;
   return conversation;
};

// update conversationLogs Many to Many fields
Conversation.updateLog = async function (conversation, user, date) {
  await conversation.removeLog(user)
  await conversation.addLog(user, {through: {lastActiveAt: date}})
};

module.exports = Conversation;
