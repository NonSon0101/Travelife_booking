'use client';

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useStores } from 'hooks/useStores';

const CountdownTimer = () => {
  const [time, setTime] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const dataBookingString = localStorage.getItem('booking_timeout')!;
    const userId = localStorage.getItem('websiteUserId')
    if (!dataBookingString) {
      setIsExpired(true);
      return;
    } else {

      const dataBooking = JSON.parse(dataBookingString);
      const timeoutString = dataBooking.timeOut

      if (!userId || (userId !== dataBooking.userId)) {
        localStorage.removeItem('booking_timeout')
        setIsExpired(true);
        return;
      }

      const now = dayjs();
      const timeout = dayjs(timeoutString, 'YYYY-MM-DD HH:mm:ss');

      if (now.isAfter(timeout)) {
        setIsExpired(true);
        return;
      }

      const remainingSeconds = timeout.diff(now, 'second');
      setTime(remainingSeconds);

      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsExpired(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('headercontent');
      if (!header) return;

      const headerRect = header.getBoundingClientRect();

      if (headerRect.top <= 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  if (isExpired) return null;

  return (
    <Box
      width="full"
      background="teal.400"
      color="white"
      p={4}
      textAlign="center"
      zIndex={99}
      position={isFixed ? 'fixed' : 'sticky'}
      top={isFixed ? '0' : 'unset'}
    >
      We’ll hold your booking for {formatTime(time)} minutes.
    </Box>
  );
};

export default CountdownTimer;
