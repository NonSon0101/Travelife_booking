"use client";
import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import HeaderHome from "components/Layout/WebLayout/HomeLayout/HeaderHome";
import SignUpModal from "../components/SignUpModal";
import LoginModal from "../components/LoginModal";
import ForgotPasswordModal from "../components/FogotPasswordModal";
import Footer from "components/Footer";
import CountdownTimer from "components/CountDownTimer";
import { useStores } from "hooks/useStores";

interface IMainLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = (props: IMainLayoutProps) => {
  const { children } = props;
  const { authStore } = useStores();
  const { isLogin } = authStore
  const [isOpenLoginModal, setIsOpenLoginModal] = useState<boolean>(false);
  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState<boolean>(false);
  const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] = useState<boolean>(false);

  return (
    <>
      {isLogin &&
        <CountdownTimer />
      }
      <VStack width="full" position="relative" id="headerHome">
        <HeaderHome
          openLoginModal={() => setIsOpenLoginModal(true)}
          openSignUpModal={() => setIsOpenLoginModal(true)} />

        {children}
        <LoginModal
          openForgotPasswordModal={() => setIsOpenForgotPasswordModal(true)}
          openSignUpModal={() => setIsOpenSignUpModal(true)}
          isOpen={isOpenLoginModal}
          onClose={() => setIsOpenLoginModal(false)}
        />
        <SignUpModal
          openLoginModal={() => setIsOpenLoginModal(true)}
          isOpen={isOpenSignUpModal}
          onClose={() => setIsOpenSignUpModal(false)}
        />
        <ForgotPasswordModal
          isOpen={isOpenForgotPasswordModal}
          onClose={() => setIsOpenForgotPasswordModal(false)}
        />
        <Footer />
      </VStack>
    </>
  );
};

export default HomeLayout;
