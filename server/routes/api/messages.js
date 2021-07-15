const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const conversation = await Conversation.isValid(conversationId, senderId)

      if(!conversation){
        return res.sendStatus(403);
      }

      const message = await Message.create({ senderId, text, conversationId });

      // update the coversation lastActiveAt
      await conversation.setLogs([req.user], {through: {lastActiveAt: new Date()}})
      return res.json({ message, sender });
    }

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
        logs: [
          { userId: senderId, updatedAt: new Date() }
        ]
      } );

      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    // add sender to conversation logs to show last active time in conversation
    await conversation.setLogs([req.user], {through: {lastActiveAt: new Date()}})
    res.json({ message, sender });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
