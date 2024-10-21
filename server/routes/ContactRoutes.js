import {Router} from "express";
import { getALlContacts, getContactsForDMList, searchContacts } from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactRoutes = Router();

contactRoutes.post("/search",verifyToken,searchContacts);
contactRoutes.get("/get-contact-for-dm",verifyToken,getContactsForDMList);
contactRoutes.get("/get-all-contact",verifyToken,getALlContacts)

export default contactRoutes;