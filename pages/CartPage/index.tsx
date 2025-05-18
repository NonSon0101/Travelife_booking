"use client";

import {
  HStack,
  VStack,
  Text,
  Button,
  Box,
  Skeleton,
  SkeletonText,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import routes from "routes";
import CartItem from "./CartItem";
import { useStores } from "hooks";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import Title from "components/Title";
import { formatCurrency } from "utils/common";
import { FaShoppingCart } from "react-icons/fa";

const CartPage = () => {
  const { cartStore, authStore } = useStores();
  const { listCart, currentCurrency } = cartStore;
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCart(true);
      await cartStore.getListCart();
      setIsLoadingCart(false);
    };

    fetchData();
  }, []);

  const calculateTotalPrice = () => {
    let total = 0;
    if (listCart?.tours?.length) {
      listCart.tours.forEach((tour) => {
        tour.participants.forEach((participant) => {
          total += participant.price * participant.quantity;
        });
      });
    }
    setTotalPrice(total);
  };

  useEffect(() => {
    if (!isLoadingCart) calculateTotalPrice();
  }, [listCart, isLoadingCart]);

  const gotoCheckout = () => {
    setIsLoading(true);
    router.push(routes.booking.activity);
    setIsLoading(false);
  };

  const cartCount = listCart?.tours?.length || 0;

  return (
    <Box
      maxW="1400px"
      mx="auto"
      px={{ base: 4, md: 6, lg: 10 }}
      mt="48px"
      minH="700px"
      w="full"
    >
      <Flex
        direction={{ base: "column", lg: "row" }}
        align="start"
        justify="space-between"
        gap={{ base: 10, lg: 6 }}
      >
        {/* LEFT SIDE: Cart Items */}
        <Box flex={{ base: "1 1 auto", lg: "2" }} w="100%">
          <Title text="Shopping cart" mb={4} />

          {isLoadingCart ? (
            [1, 2, 3].map((i) => (
              <Box
                key={i}
                w="full"
                bg="white"
                p={5}
                boxShadow="md"
                borderRadius="md"
                mb={4}
              >
                <Skeleton height="20px" width="50%" mb={3} />
                {/* just a workaround solution and need improve further */}
                {typeof window !== 'undefined' && <SkeletonText noOfLines={4} />}
              </Box>
            ))
          ) : cartCount > 0 ? (
            listCart?.tours?.map((tour) => (
              <CartItem
                key={tour._id}
                idCart={tour._id}
                tour={tour}
                currentCurrency={currentCurrency}
              />
            ))
          ) : (
            <VStack
              w="full"
              minH="400px"
              align="center"
              justify="center"
              spacing={4}
              mt={8}
            >
              <Box color="teal.500" fontSize="9xl">
                <FaShoppingCart />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="teal.700">
                Your cart is empty
              </Text>
            </VStack>
          )}
        </Box>

        {/* RIGHT SIDE: Checkout */}
        {cartCount !== 0 && (
          <Box
            w={{ base: "100%", lg: "360px" }}
            flexShrink={0}
            mt={0}
          >
            <Title text="Total" mb={4} />
            <Box
              bg="white"
              boxShadow="lg"
              border="1px solid #E2E8F0"
              borderRadius="md"
              p={{ base: 4, md: 6 }}
            >
              {isLoadingCart ? (
                <>
                  <Skeleton height="24px" mb="3" />
                  <Skeleton height="20px" mb="4" />
                  <Skeleton height="48px" borderRadius="full" />
                </>
              ) : (
                <>
                  <HStack
                    justify="space-between"
                    fontSize="lg"
                    fontWeight="bold"
                    mb={2}
                  >
                    <Text>
                      Subtotal ({cartCount === 1 ? "1 item" : `${cartCount} items`}):
                    </Text>
                    <Text>{formatCurrency(totalPrice, currentCurrency)}</Text>
                  </HStack>
                  <Button
                    w="full"
                    mt={4}
                    py={6}
                    borderRadius="full"
                    isLoading={isLoading}
                    colorScheme="teal"
                    color="white"
                    onClick={gotoCheckout}
                  >
                    Checkout
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}
      </Flex>
    </Box>

  );
};

export default observer(CartPage);
