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
      // add this to find logs for the conversations to know the last Active time
      include: [
          {
          model: User,
          as: "logs",
          // where: {
          //   id: userId
          // },
          attributes: ['id'],
          through: {attributes: ["lastActiveAt"]},
        },
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
      const lastActiveAt = convo.logs.length? convo.logs[0].conversationLog.lastActiveAt.getTime() : null;
      console.log(`convo ${i} -> ${convo.logs.length} -> ${lastActiveAt}`)

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;

      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      convoJSON.otherUser.online = onlineUsers.includes(convoJSON.otherUser.id);


      // mark the message that have not been read
      for(let message of convoJSON.messages){
        if(message.createdAt.getTime() > lastActiveAt){
          message.notRead = true;
        }else{
          break
        }
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.latestMessageNotRead = (convoJSON.messages[0].notRead === true);

      // reverse so that it is ordered asc
      convoJSON.messages.reverse()

      // save for response
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  // const message = await Conversation.create({ userId, text, conversationId });
})

module.exports = router;
