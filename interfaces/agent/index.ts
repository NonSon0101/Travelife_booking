export interface Suggestion {
  _id: string;
  title: string;
  description?: string;
  image?: string;
};

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  suggestions?: Suggestion[];
}; 