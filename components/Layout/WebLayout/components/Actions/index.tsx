import { Box, HStack } from "@chakra-ui/react";
import { PiTicketBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { LuShoppingCart } from "react-icons/lu";
import routes from "routes";
import UserProfile from "../UserProfile";
import ActionItem from "./ActionItem";
import { useStores } from "hooks";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { IRequestTour, IRequsetCheckoutReview } from "interfaces/checkout";
import dayjs from "dayjs";

interface IHeaderProps {
  openLoginModal: () => void;
  color?: string;
  underLineHoverColor?: string;
  hoverColor?: string;
}

const Action = (props: IHeaderProps) => {
  const { cartStore } = useStores();
  const { authStore } = useStores();
  const { bookingStore } = useStores();
  const { pendingCount } = bookingStore;
  const { cartCount } = cartStore;
  const { isLogin } = authStore;

  const route = useRouter();

  const [time, setTime] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const fetchActionData = async () => {
      if (!isLogin) {
        return;
      }
      await cartStore.fetchCartCount();
      await bookingStore.fetchPendingBooking()
    }

    fetchActionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function gotoCartPage() {
    route.push(routes.cart.value);
  }
  function gotoBookingViewPage() {
    route.push(routes.booking.view);
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  const { openLoginModal, color, underLineHoverColor, hoverColor } = props;
  return (
    <HStack
      height="100%"
      justifyContent="center"
      alignItems="center"
      marginTop="14px"
    >
      <>
        <Box
          {...(pendingCount !== 0 && !isExpired &&
            isLogin && {
            _before: {
              position: "absolute",
              content: `"${pendingCount}"`,
              textAlign: "center",
              fontSize: "13px",
              top: "0",
              marginLeft: "47px",
              marginTop: "13px",
              width: "20px",
              height: "20px",
              background: "#CB3F00",
              color: "#fff",
              borderRadius: "full",
            },
          })}
        >
          <ActionItem
            color={color}
            underLineHoverColor={underLineHoverColor}
            hoverColor={hoverColor}
            actionIcon={<PiTicketBold />}
            title={time ? formatTime(time) : "Booking"}
            to={gotoBookingViewPage}
          />
        </Box>
        <Box
          {...(cartStore.cartCount !== 0 &&
            isLogin && {
            _before: {
              position: "absolute",
              content: `"${cartCount}"`,
              textAlign: "center",
              fontSize: "13px",
              top: "0",
              marginLeft: "30px",
              marginTop: "13px",
              width: "20px",
              height: "20px",
              background: "#CB3F00",
              color: "#fff",
              borderRadius: "full",
            },
          })}
        >
          <ActionItem
            color={color}
            underLineHoverColor={underLineHoverColor}
            hoverColor={hoverColor}
            actionIcon={<LuShoppingCart />}
            title="Cart"
            to={gotoCartPage}
          />
        </Box>
      </>
      <UserProfile
        underLineHoverColor={underLineHoverColor}
        hoverColor={hoverColor}
        color={color}
        openLoginModal={openLoginModal}
      />
    </HStack>
  );
};

export default observer(Action);
