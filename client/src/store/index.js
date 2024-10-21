import {create} from "zustand";
import { createAuthSlice } from "./slices/auth-slices";
import { createChatSLice } from "./slices/chat-slice";

export const userAppStore = create()((...a) =>({
    ...createAuthSlice(...a),
    ...createChatSLice(...a),
}));