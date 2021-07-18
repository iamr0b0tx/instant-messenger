const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // count the unread messages
      convoJSON.notReadCount = await Message.count({
        where: {
          conversationId: convo.id,
          senderId: {
              [Op.not]: userId,
          },
          read: false
        }
      });

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;

      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      convoJSON.otherUser.online = onlineUsers.has(convoJSON.otherUser.id);

      // set properties for notification count and latout est message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;

      // reverse so that it is ordered asc
      convoJSON.messages.reverse()

      // save for response
      conversations[i] = convoJSON;
    }

    return res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const senderId = req.user.id;
  const {conversationId} = req.body;

  let conversation = await Conversation.isValid(conversationId, senderId);
  if(!conversation){
    return res.sendStatus(404)
  }

  await Message.update(
    { read: true },
    {
      where: {
        conversationId: conversationId,
        senderId: {
            [Op.not]: senderId,
        },
        read: false
      }
    }
  );

  return res.json({conversationId: conversationId});

});

module.exports = router;
