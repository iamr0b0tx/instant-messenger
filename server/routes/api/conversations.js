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
          attributes: ['id'],
          through: {
            where: {
                userId: userId,
              },
            attributes: ["lastActiveAt"]
          },
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
      const lastActiveAt = convo.logs[0]?.conversationLog.lastActiveAt;

      // to know source of convo and track user logged in in frontend redux
      convoJSON.userId = req.user.id;

      // count the unread messages
      convoJSON.notReadCount = await Message.count({
        where: {
          conversationId: convo.id,
          createdAt: {
            [Op.gt]: lastActiveAt
          }
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
      convoJSON.otherUser.online = onlineUsers.includes(convoJSON.otherUser.id);

      // mark the message that have not been read
      if(lastActiveAt){
        for(let message of convoJSON.messages){
          if(message.createdAt.getTime() > lastActiveAt.getTime()){
            message.notRead = true;
          }else{
            break
          }
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

router.patch("/", async (req, res, next) => {
  if (!req.user) {
      return res.sendStatus(401);
    }

  const senderId = req.user.id;
  const { recipientId } = req.body;

  let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

  if(!conversation){
    res.sendStatus(404)
  }

  // add sender to conversation logs
  try{
    const conversationLog = await conversation.setLogs([req.user], {through: {lastActiveAt: new Date()}})
    res.json({conversationId: conversation.id});

  }catch (e){
    console.error(e)

  }

})

module.exports = router;
