import { ITour } from "interfaces/tour";

export interface Suggestion {
  _id: string;
  title: string;
  type?: string;
  description?: string;
  thumbnail?: string;
};

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  suggestions?: Suggestion[];
  detailsInfo?: ITour;
}; 