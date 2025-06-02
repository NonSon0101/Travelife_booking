"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Input,
  VStack,
  HStack,
  Text,
  Flex,
  Avatar,
  Spinner,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { fetchBotReply } from "API/agent/chat";
import { toast } from "react-toastify";
import { createChatSession } from "API/agent/create_sesion";
import { PLATFORM } from "enums/common";
import { createCollection, sendMessage } from "utils/firestoreChat";
import { ChatMessage } from "interfaces/agent";
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from "lib/firestore";


const preMessages: string[] = [
  "Hi there! 👋 How can I assist you today?",
  "Try things like:",
  "• Suggest me a travel destination in Hoi An",
  "• What's we can do in Hoi An?",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedBotText, setDisplayedBotText] = useState("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string>('');
  const [isCeatingChat, setIsCeatingChat] = useState<boolean>(false);
  useEffect(() => {
    setUserId(localStorage.getItem(`${PLATFORM.WEBSITE}UserId`) ?? "")
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, displayedBotText]);

  useEffect(() => {
    const storedUserId = localStorage.getItem(`${PLATFORM.WEBSITE}UserId`);
    if (!storedUserId) return;

    const userDocRef = doc(firestore, "travellife_chat", storedUserId);

    const checkFirestoreExpiration = async () => {
      const snapshot = await getDoc(userDocRef);
      if (!snapshot.exists()) {
        setIsStarted(false);
        return;
      }

      const data = snapshot.data();
      console.log('data from firestore: ', data)
      const expiredAt = new Date(data.expried_at * 1000);
      console.log('expiredAt', expiredAt)
      console.log('!expiredAt || new Date() > expiredAt', !expiredAt || new Date() > expiredAt)

      if (!expiredAt || new Date() > expiredAt || !data.expried_at) {
        setIsStarted(false);
        localStorage.removeItem("agent_session");
      } else {
        setIsStarted(true);
      }
    };

    checkFirestoreExpiration();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem(`${PLATFORM.WEBSITE}UserId`);
    if (!storedUserId) return;

    const q = query(
      collection(firestore, "travellife_chat", storedUserId, "messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: ChatMessage[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          sender: data.sender,
          text: data.text,
          suggestions: data.suggestions || [],
        };
      });

      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [messages]);

  function tokenizeHTML(html: string): string[] {
    const regex = /(<[^>]+>|[^<]+)/g;
    const tokens: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      tokens.push(match[0]);
    }

    return tokens;
  }

  const handleSend = async (text?: string) => {
    const userMessage = text || inputValue.trim();
    if (userMessage === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputValue("");
    await sendMessage(userId, "user", userMessage, [])
    setIsLoading(true);
    setDisplayedBotText("");

    try {
      const res = await fetchBotReply(userMessage);
      
      const botHTML = res.reply || "No reply found.";
      const suggestions = res.suggestions || [];
      await sendMessage(userId, "bot", botHTML, suggestions)

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
      setDisplayedBotText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    const userId = localStorage.getItem(`${PLATFORM.WEBSITE}UserId`)
    if (!userId) {
      toast.warn("Please login first");
      return;
    }
    setUserId(userId);

    try {
      setIsCeatingChat(true)
      const sessionData = await createChatSession();
      if (sessionData) {
        const expiresAtSeconds = sessionData.last_update_time + 1200;
        const expiresAtISO = new Date(expiresAtSeconds * 1000).toISOString();

        await createCollection(userId, expiresAtSeconds);
        setIsCeatingChat(false)
        setIsStarted(true)
      }
    } catch (err: any) {
      setIsCeatingChat(false)
      toast.error("Can't create chat session: " + err.message);
    }
  };

  const renderMessage = (msg: ChatMessage, i: number) => (
    <HStack
      key={i}
      alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
      spacing={2}
      maxW="100%"
    >
      {msg.sender === "bot" && <Avatar size="sm" name="Bot" bg="teal.400" />}
      <Box
        bg={msg.sender === "user" ? "teal.500" : "gray.300"}
        color={msg.sender === "user" ? "white" : "black"}
        px={3}
        py={2}
        borderRadius="md"
        wordBreak="break-word"
      >
        <Box dangerouslySetInnerHTML={{ __html: msg.text }} />
        {Array.isArray(msg.suggestions) && msg.suggestions.length > 0 && (
          <VStack align="start" mt={3} spacing={3}>
            {msg.suggestions.map((s) => (
              <Box
                key={s._id}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                width="100%"
                bg="white"
                color="black"
              >
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    width="100%"
                    height="auto"
                    style={{ objectFit: "cover", maxHeight: "120px" }}
                  />
                )}
                <Box p={2}>
                  <Text fontWeight="bold">{s.title}</Text>
                  {s.description && (
                    <Text fontSize="sm" mt={1} color="gray.600">
                      {s.description}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
      {msg.sender === "user" && (
        <Avatar size="sm" name="You" bg="gray.600" />
      )}
    </HStack>
  );

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={1000}
      boxShadow="lg"
      borderRadius={isOpen ? "md" : "full"}
      overflow="hidden"
      bg="teal.500"
      width={isOpen ? "350px" : "60px"}
      height={isOpen ? "500px" : "60px"}
      transition="width 0.3s ease, height 0.3s ease"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Flex
        bg="teal.500"
        color="white"
        p="8px 12px"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        flexShrink={0}
        margin={isOpen ? "" : "auto"}
      >
        {isOpen ? (
          <IconButton
            aria-label="Close chat"
            icon={<CloseIcon />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            colorScheme="teal"
          />
        ) : (
          <ChatIcon boxSize={6} marginLeft='5px' />
        )}
        <Text ml={2} fontWeight="bold" fontSize="md">
          {isOpen && "Chat Assistant"}
        </Text>
      </Flex>

      {/* Chat content */}
      {isOpen && (
        <>
          <VStack
            spacing={3}
            p={3}
            flex="1"
            overflowY="auto"
            bg='white'
          >
            {messages.length === 0 && !isLoading && (
              <VStack spacing={1} color="gray.500" fontSize="sm">
                {preMessages.map((msg, idx) => (
                  <Text key={idx}>{msg}</Text>
                ))}
                {/* Quick reply carousel */}
                <Wrap spacing={2} pt={2}>
                  <WrapItem>
                    <Button
                      size="xs"
                      colorScheme="teal"
                      variant="outline"
                      disabled={!isStarted}
                      onClick={() => handleSend("Suggest me a travel destination")}
                    >
                      Travel Suggestion
                    </Button>
                  </WrapItem>
                  <WrapItem>
                    <Button
                      size="xs"
                      colorScheme="teal"
                      variant="outline"
                      disabled={!isStarted}
                      onClick={() => handleSend("What's we can do in Hoi An?")}
                    >
                      Things to do in Hoi An
                    </Button>
                  </WrapItem>
                </Wrap>
              </VStack>
            )}

            {messages.map((msg, i) => renderMessage(msg, i))}

            {displayedBotText && (
              <HStack alignSelf="flex-start" spacing={2}>
                <Avatar size="sm" name="Bot" bg="teal.400" />
                <Box
                  bg="gray.300"
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontStyle="italic"
                  dangerouslySetInnerHTML={{ __html: displayedBotText }}
                />
              </HStack>
            )}

            {isLoading && !displayedBotText && (
              <HStack alignSelf="flex-start" spacing={2}>
                <Avatar size="sm" name="Bot" bg="teal.400" />
                <Box
                  bg="gray.300"
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontStyle="italic"
                >
                  Bot is typing ...
                </Box>
              </HStack>
            )}

            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <HStack
            p={3}
            borderTop="1px solid"
            borderColor="gray.200"
            bg="white"
            justifyContent="center"
          >
            {isStarted ?
              <>
                <Input
                  placeholder="Type your message..."
                  size="sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  isDisabled={isLoading}
                  focusBorderColor="teal.500"
                />
                <IconButton
                  aria-label="Send message"
                  icon={<ArrowForwardIcon />}
                  size="sm"
                  colorScheme="teal"
                  onClick={() => handleSend()}
                  isDisabled={isLoading || inputValue.trim() === ""}
                />
              </>
              :
              <Button
                colorScheme="teal"
                alignSelf="center"
                width="full"
                onClick={handleStartChat}
                isLoading={isCeatingChat}
                loadingText="Creating chat..."
              >
                Start to chat
              </Button>
            }

          </HStack>
        </>
      )}
    </Box>
  );
};

export default ChatBot;
