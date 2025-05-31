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
    const raw = localStorage.getItem("agent_session");
    const userId = localStorage.getItem(`${PLATFORM.WEBSITE}UserId`)!
    if (!raw || !userId) {
      setIsStarted(false);
      return;
    }
    setUserId(localStorage.getItem(`${PLATFORM.WEBSITE}UserId`) ?? "")

    let expired = true;
    try {
      const { expiredTime } = JSON.parse(raw) as { expiredTime: number | string };

      if (typeof expiredTime === "number") {
        expired = Math.floor(Date.now() / 1000) > expiredTime;
      } else {
        expired = new Date() > new Date(expiredTime);
      }
    } catch (err) {
      console.warn("Invalid session data:", err);
      expired = true;
    }

    if (expired) {
      setIsStarted(false);
      localStorage.removeItem("agent_session");
    } else {
      setIsStarted(true);
    }
  }, []);

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
    const syncUserMsg = await sendMessage(userId, "user", userMessage, [])
    setInputValue("");
    setIsLoading(true);
    setDisplayedBotText("");

    try {
      const res = await fetchBotReply(userMessage);

      const botHTML = res.reply || "No reply found.";
      const suggestions = res.suggestions || [];
      console.log(suggestions)
      const syncBotMsg = await sendMessage(userId, "bot", botHTML, suggestions)

      const tokens = tokenizeHTML(botHTML);
      let i = 0;

      const typeNext = () => {
        if (i < tokens.length) {
          setDisplayedBotText((prev) => prev + tokens[i]);
          i++;
          setTimeout(typeNext, 15);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: botHTML, suggestions },
          ]);
          setDisplayedBotText("");
        }
      };

      typeNext();
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
      const collectionData = await createCollection(userId);
      if (sessionData) {
        const expiresAtSeconds = sessionData.last_update_time + 3600;
        const expiresAtISO = new Date(expiresAtSeconds * 1000).toISOString();

        const agent_session = {
          sessionId: sessionData.id,
          expiredTime: expiresAtISO,
        };
        localStorage.setItem(
          'agent_session',
          JSON.stringify(agent_session)
        );
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
                      disabled={!userId}
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
                      disabled={!userId}
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
