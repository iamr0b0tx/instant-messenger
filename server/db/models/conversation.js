const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

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
Conversation.isValid = async function (conversationId, userId) {
  // return conversation or null if it doesn't exist
  return await Conversation.findOne({
    where: {
      id: conversationId,
      [Op.or]: [
           { user1Id: { [Op.eq]: userId } },
           { user2Id: { [Op.eq]: userId } }
      ]
    }
  });
};

module.exports = Conversation;
