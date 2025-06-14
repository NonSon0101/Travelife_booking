"use client";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { API_URL } from "API";
import FormInput from "components/FormInput";
import Icon from "components/Icon";
import PasswordField from "components/PasswordField";
import { PLATFORM } from "enums/common";
import { useStores } from "hooks/useStores";
import { ILoginForm } from "interfaces/auth";
import get from "lodash/get";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "lib/firestore";

interface ILoginModalProps {
  openSignUpModal: () => void;
  openForgotPasswordModal: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const { isOpen, onClose, openSignUpModal, openForgotPasswordModal } = props;
  const { authStore } = useStores();
  const methods = useForm<ILoginForm>();
  const { handleSubmit } = methods;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: ILoginForm): Promise<void> {
    try {
      setIsLoading(true);
      console.log("Login with:", data.email, data.password);
      await authStore.login({ ...data, isRemember: true }, PLATFORM.WEBSITE);
      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) { console.log('signed in to firestore with user: ', user) }
        })
        .catch(async (err) => {
          console.error(`Couldnt sign in to firestore ${err.code}, \n ${err.message}`)
          await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
              const user = userCredential.user;
              if (user) { console.log('signed in to firestore with user: ', user) }
            })
            .catch((err) => {
              console.error(`Couldnt sign in to firestore ${err.code}, \n ${err.message}`)
            });
        });
      setIsLoading(false);
      onClose();
      toast.success("Login successfully");
    } catch (error) {
      setIsLoading(false);
      console.error("errorMessage", error);
      const errorMessage: string =
        get(error, "data.error.message", "Email or password incorrect") ||
        JSON.stringify(error);
      // toast.error(errorMessage)
    }
  }

  function handleOpenSigupModal() {
    onClose();
    openSignUpModal();
  }

  async function checkIfUserExists(email) {
    try {
      console.log('user email', email)
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log("Checking email:", email);
      console.log("Returned sign-in methods:", methods);

      if (methods.includes('password')) {
        console.log("User exists with email/password sign-in.");
        return true;
      } else {
        console.log("Email exists but not with email/password (maybe Google, Facebook, etc).");
        return false;
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  }

  function handleFogotPass() { }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Stack spacing={8} py={{ base: 0, sm: 8 }} px={{ base: 4, sm: 10 }}>
          <Stack spacing={6}>
            <Stack spacing={{ base: 2, md: 3 }} textAlign="center">
              <Heading size={{ base: "xs", md: "lg" }}>
                Log in to your account
              </Heading>
              <Text color="fg.muted">
                {`Don't have an account?`}{" "}
                <button onClick={handleOpenSigupModal}><Text color='teal' _hover={{ textDecoration: 'underline' }} >Sign Up</Text></button>
              </Text>
            </Stack>
          </Stack>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                bg={{ base: "transparent", sm: "bg.surface" }}
                borderRadius={{ base: "none", sm: "xl" }}
              >
                <Stack spacing={6}>
                  <Stack spacing="5">
                    <FormInput
                      name="email"
                      label="Email or username"
                      autoComplete="off"
                    />
                    <PasswordField />
                  </Stack>
                  <HStack justify="space-between">
                    <Checkbox defaultChecked>Remember me</Checkbox>
                    <Button
                      variant="text"
                      size="sm"
                      _hover={{
                        color: 'teal',
                        textDecoration: 'underline'
                      }}
                      onClick={openForgotPasswordModal}
                    >
                      Forgot password?
                    </Button>
                  </HStack>
                  <Stack spacing={6}>
                    <Button
                      type="submit"
                      colorScheme="teal"
                      isLoading={isLoading}
                    >
                      Login
                    </Button>
                    <HStack>
                      <Divider borderColor="gray.300" />
                      <Text fontSize="sm" whiteSpace="nowrap" color="fg.muted">
                        OR
                      </Text>
                      <Divider borderColor="gray.300" />
                    </HStack>
                    <a
                      style={{ alignSelf: "center", width: "100%" }}
                      href={`${API_URL}/api/v1/auth/google`}
                    >
                      <Button
                        width="full"
                        fontSize="sm"
                        fontWeight={500}
                        background="none"
                        border="1px solid #CBD5E0"
                      >
                        <Icon iconName="google.svg" size={20} />
                        <Text marginLeft={2} color="gray.700" lineHeight={6}>
                          Login with Google
                        </Text>
                      </Button>
                    </a>
                  </Stack>
                </Stack>
              </Box>
            </form>
          </FormProvider>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
