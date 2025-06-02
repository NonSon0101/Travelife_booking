import { firestore } from "../lib/firestore";

import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Suggestion } from "interfaces/agent";

export const createCollection = async (userId: string, expriedAt) => {
  const sessionRef = doc(firestore, "travellife_chat", userId);
  await setDoc(sessionRef, {
    user_id: userId,
    expried_at: expriedAt,
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

  const now = new Date();
  const expiredAt = new Date(now.getTime() + 20 * 60 * 1000);

  await updateDoc(sessionRef, {
    updated_at: serverTimestamp(),
    expried_at: Timestamp.fromDate(expiredAt),
  });
};

export const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_WEB_DOMAIN!,
  // This must be true.
  handleCodeInApp: true,
  // The domain must be configured in Firebase Hosting and owned by the project.
  //linkDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!
};
