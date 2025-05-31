import { firestore } from "../lib/firestore";
import { getAuth } from "firebase/auth";

import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ChatMessage, Suggestion } from "interfaces/agent";

export const createCollection = async (userId: string) => {
  const sessionRef = doc(firestore, "travellife_chat", userId);
  await setDoc(sessionRef, {
    user_id: userId,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
};

export const sendMessage = async (
  userId: string,
  sender: "user" | "bot",
  text: string,
  suggestions: Suggestion[] | []
) => {
  const messagesRef = collection(firestore, "travellife_chat", userId, "messages");

  await addDoc(messagesRef, {
    sender: sender,
    text: text,
    suggestions: suggestions,
    timestamp: serverTimestamp(),
  });

  const sessionRef = doc(firestore, "travellife_chat", userId);
  await updateDoc(sessionRef, {
    updated_at: serverTimestamp(),
  });
};

export const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_WEB_DOMAIN!, 
  // This must be true.
  handleCodeInApp: true,
  // The domain must be configured in Firebase Hosting and owned by the project.
  //linkDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!
};
