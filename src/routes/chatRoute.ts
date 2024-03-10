import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import {
    deleteChats,
  generateChatCompletion,
  getChats,
} from "../controllers/chatController.js";

const chatRoute = Router();
chatRoute.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);

chatRoute.get("/chats", verifyToken, getChats);
chatRoute.delete("/delete", verifyToken, deleteChats);

export default chatRoute;
