'use client';

import { ReactNode, useState } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';

import Head from 'next/head';
import Header from '../components/Header';
import Footer from 'components/Footer';
import LoginModal from '../components/LoginModal';
import SignUpModal from '../components/SignUpModal';
import ForgotPasswordModal from '../components/FogotPasswordModal';


interface IPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const PageLayout = ({ title, children }: IPageLayoutProps) => {
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState(false);
  const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex direction="column" minHeight="100vh" backgroundColor="#F5F5F5">
          <Header
            position="sticky"
            top="0"
            openLoginModal={() => setIsOpenLoginModal(true)}
            height={{ base: '140px', md: '90px' }}
            background="#fff"
            color="#63687a"
            boxShadow="md"
            paddingBottom="14px"
            underLineHoverColor="#ff5533"
            hoverColor="#1a2b49"
          />
          {children}
          <Footer />
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
        </Flex>
      </main>
    </>
  );
};

export default PageLayout;
