import {
  VStack,
  Box,
  HStack,
  Text,
  Link,
  IconButton,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <Box as="footer" bg="#04364A" color="white" w="100%" pt={10}>
      <Box px={5} py={10} maxW="1200px" mx="auto" alignItems="center">
        <SimpleGrid columns={[1, 2, 3]} spacing={10} textAlign={["center", "left"]}>
          {/* About Us */}
          <VStack align={["center", "flex-start"]} spacing={4} alignItems="center">
            <Text fontWeight="bold" fontSize="lg">About Us</Text>
            <Link href="#">Press</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Contact</Link>
          </VStack>

          {/* Mobile */}
          <VStack align={["center", "flex-start"]} spacing={4} alignItems="center">
            <Text fontWeight="bold" fontSize="lg">Mobile</Text>
            <Link
              href="https://play.google.com/store/apps/details?id=com.getyourguide.android&hl=en_US"
              isExternal
            >
              <Image
                src="https://cdn.getyourguide.com/tf/assets/static/badges/google-play-badge-en-us.svg"
                alt="Google Play"
                width="170px"
              />
            </Link>
            <Link
              href="https://apps.apple.com/us/app/getyourguide-tours-activities/id657070903"
              isExternal
            >
              <Image
                src="https://cdn.getyourguide.com/tf/assets/static/badges/app-store-badge-en-us.svg"
                alt="App Store"
                width="170px"
              />
            </Link>
          </VStack>

          {/* Brand + Social */}
          <VStack align={["center", "flex-start"]} spacing={4} alignItems="center">
            <HStack>
              <Text fontWeight="bold" fontSize="lg">Travel Life</Text>
              <Image
                src="/assets/images/logo.jpg"
                alt="logo"
                width="70px"
                borderRadius="md"
              />
            </HStack>
            <Text fontSize="sm">Connect with Us:</Text>
            <HStack spacing={2}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebook />}
                variant="ghost"
                colorScheme="whiteAlpha"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                variant="ghost"
                colorScheme="whiteAlpha"
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                colorScheme="whiteAlpha"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                variant="ghost"
                colorScheme="whiteAlpha"
              />
            </HStack>
          </VStack>
        </SimpleGrid>
      </Box>

      {/* Bottom Bar */}
      <Box bg="#01272B" py={3}>
        <Text textAlign="center" fontSize="sm">
          &copy; {new Date().getFullYear()} Travel Life. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
