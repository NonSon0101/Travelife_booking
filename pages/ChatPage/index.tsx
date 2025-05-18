"use client";

import { Box, HStack, VStack, Text, Input, Button, Avatar, Spacer } from "@chakra-ui/react";
import { useState } from "react";

const ChatPage = () => {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hi there!" },
    { id: 2, sender: "me", text: "Hey! How are you?" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <HStack h="100vh" spacing={0} align="stretch">
      {/* Sidebar */}
      <VStack w="300px" bg="gray.100" p={4} spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="xl">Chats</Text>
        <HStack spacing={3} p={2} bg="white" borderRadius="md" _hover={{ bg: "gray.200" }}>
          <Avatar size="sm" />
          <VStack spacing={0} align="start">
            <Text fontWeight="medium">Michael</Text>
            <Text fontSize="sm" color="gray.500">Last message...</Text>
          </VStack>
        </HStack>
        {/* Thêm các item chat khác ở đây */}
      </VStack>

      {/* Chat Window */}
      <VStack flex="1" bg="gray.50" spacing={0}>
        {/* Header */}
        <HStack w="full" bg="white" p={4} boxShadow="sm">
          <Avatar size="sm" />
          <Text fontWeight="bold">Michael</Text>
          <Spacer />
        </HStack>

        {/* Messages */}
        <VStack flex="1" w="full" px={4} py={2} spacing={3} overflowY="auto">
          {messages.map((msg) => (
            <HStack
              key={msg.id}
              w="full"
              justify={msg.sender === "me" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="70%"
                p={3}
                borderRadius="lg"
                bg={msg.sender === "me" ? "blue.500" : "gray.200"}
                color={msg.sender === "me" ? "white" : "black"}
              >
                <Text>{msg.text}</Text>
              </Box>
            </HStack>
          ))}
        </VStack>

        {/* Input */}
        <HStack w="full" p={4} bg="white" spacing={2}>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
            Send
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}

export default ChatPage;