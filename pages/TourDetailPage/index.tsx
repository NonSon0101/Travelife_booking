"use client";
import { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Text,
  useBreakpointValue,
  VStack,
  GridItem,
  Stack,
  Switch,
  FormControl,
  FormLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Skeleton
} from "@chakra-ui/react";
import { toast } from 'react-toastify'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useStores } from "hooks";
import Icon from "components/Icon";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarCheck, FaHotel, FaCreditCard, FaBus } from "react-icons/fa";
import { PiClockCountdownBold } from "react-icons/pi";
import { RiMapPinUserLine } from "react-icons/ri";
import { LuCalendarDays } from "react-icons/lu";
import { IoPeople } from "react-icons/io5";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { TriangleDownIcon } from "@chakra-ui/icons";
import MenuItem from "components/Layout/WebLayout/components/MenuItem";
import CustomCalendar from "./Calendar";
import { IAddToCart, IParticipants } from "interfaces/cart";
import { PLATFORM } from "enums/common";
import RatingStart from "components/RatingStart";
import { formatCurrency } from "utils/common";
import routes from "routes";
import Title from "components/Title";
import TourReviews from "./TourReviews";
import Timeline from "./TimeLineItems";
import PrivateOptions from "components/Layout/WebLayout/components/privateOptions";
import ItineraryMap, { ItineraryMapRef } from "./ItineraryMap";
import { IItineraryItem } from "interfaces/tour";
import ChatBot from "components/ChatBot";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const TourDetailPage = () => {

  const router = useRouter()
  const [userId, setUserId] = useState<string>('')
  const [type, setType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [initialMount, setInitialMount] = useState(true);
  const [guestInfo, setGuestInfo] = useState<IParticipants[]>([]);
  const [selectedDate, setSelectedDate] = useState<Value>(null);
  const [showDate, setShowDate] = useState<string[]>([]);
  const [convertedDate, setConvertedDate] = useState<string>("");
  const [availability, setAvailability] = useState<boolean>(false);
  const [isMenuParticipant, setIsMenuParticipant] = useState<boolean>(true);
  const [isMenuDatePick, setIsMenuDatePick] = useState<boolean>(true);
  const [isMenuHotel, setIsMenuHotel] = useState<boolean>(true);
  const [isMenuTransport, setIsMenuTransport] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tourId, setTourId] = useState<string>()
  const [slider, setSlider] = useState<Slider | null>(null)
  const [privateTour, setPrivateTour] = useState<boolean>(false)
  const [hotel, setHotel] = useState<{ id: string, name: string }>({ id: '', name: '' })
  const [transport, setTransport] = useState<{ id: string, name: string }>({ id: '', name: '' })
  const { tourStore, cartStore, bookingStore } = useStores();
  const { tourDetail, priceOptions, startLocation } = tourStore;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const mapRef = useRef<ItineraryMapRef>(null)

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };
  const top = typeof window !== 'undefined' ? useBreakpointValue({ base: '90%', md: '50%' }) : ''
  const side = typeof window !== 'undefined' ? useBreakpointValue({ base: '30%', md: '10px' }) : ''

  useEffect(() => {
    const id = localStorage?.getItem(`${PLATFORM.WEBSITE}UserId`) ?? ''
    setUserId(id)
  }, [])

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split("/");
    setTourId(urlParts[urlParts.length - 1])
  }, [])

  useEffect(() => {
    if (tourId) {
      tourStore.fetchTourDetail(tourId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  useEffect(() => {
    if (!initialMount) {
      const existingGuestIndex = guestInfo.findIndex(
        (obj) => obj.title === type
      );

      if (existingGuestIndex !== -1) {
        const updatedGuestInfo = [...guestInfo];
        updatedGuestInfo[existingGuestIndex] = {
          ...updatedGuestInfo[existingGuestIndex],
          quantity,
          price,
        };
        const filterGuest = updatedGuestInfo.filter(
          (obj) => obj.quantity !== 0 && !!obj.title
        );
        setGuestInfo(filterGuest);
      } else {
        const newGuest: IParticipants = {
          title: type,
          quantity: quantity,
          price: price,
        };
        setGuestInfo((prevGuestInfo) => [...prevGuestInfo, newGuest]);
      }
    } else {
      setInitialMount(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, quantity, price]);

  useEffect(() => {
    if (guestInfo.length === 0) {
      setTotalPrice(0);
      return;
    }
    let totalPrice: number = 0;

    guestInfo.forEach((guest) => {
      totalPrice += guest.price * guest.quantity;
    });
    setTotalPrice(totalPrice);
  }, [guestInfo]);

  useEffect(() => {
    if (!selectedDate) return;
    const today = new Date();
    if (selectedDate < today) {
      toast.warning('Cannot select date in the past')
      return;
    }
    var date = new Date(selectedDate.toString());

    var formattedDate =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);

    const showDate = selectedDate.toString().split(" ").slice(0, 3);
    setShowDate(showDate);
    setConvertedDate(formattedDate.toString());
  }, [selectedDate]);


  async function handleAddToCart(): Promise<void> {
    try {
      if (guestInfo.length === 0) {
        toast.error("Please select participants")
        return
      }
      if (userId) {
        const participant: IParticipants[] = guestInfo;
        const data: IAddToCart = {
          user: userId,
          tour: {
            tour: tourId ?? '',
            startDate: convertedDate,
            startTime: "7:00AM",
            participants: participant,
          },
        };
        if (privateTour) {
          data.tour = {
            ...data.tour,
            isPrivate: true,
            transports: [transport.id],
            hotels: [hotel.id]
          }
        }
        setIsLoading(true)
        await cartStore.addToCart(data)
        await cartStore.fetchCartCount()
        setIsLoading(false)
        toast.success('Add to cart successfully')
        window.scrollTo({ top: 0, behavior: 'smooth' });
        router.refresh()
      } else {
        toast.warning("Please login first")
        setIsLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return
      }
    } catch {
      setIsLoading(false)
      toast.error('Add to cart failed!')
    }
  }

  async function handleBookNow(): Promise<void> {
    try {
      if (guestInfo.length === 0) {
        toast.error("Please select participants")
        return
      }
      setIsLoading(true)
      if (userId) {
        const participant: IParticipants[] = guestInfo;
        const data: IAddToCart = {
          user: userId,
          tour: {
            tour: tourId ?? '',
            startDate: convertedDate,
            startTime: "7:00AM",
            participants: participant,
          },
        };
        await bookingStore.createBookNow(data)
        setIsLoading(false)
        router.push(routes.booking.activity)
      } else {
        toast.warning("Please login first")
        setIsLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return
      }
    } catch {
      setIsLoading(false)
      toast.error('Book now failed!')
    }
  }

  const handleEnablePrivate = () => {
    //setAvailability(false)
    setPrivateTour(!privateTour)
    const guestList = [...guestInfo]
    const privateGuestList = priceOptions?.filter((participant) =>
      privateTour ? participant.participantsCategoryIdentifier !== "Private" : participant.participantsCategoryIdentifier === "Private"
    );
    privateGuestList?.forEach((privateItem) => {
      const normalItem = guestList.find((item) => item.title === privateItem.title);
      if (normalItem) {
        normalItem.price = privateItem.value ?? 0;
      }
    });

  }
  function handleCheckAvailability() {
    guestInfo.length ? setIsMenuParticipant(true) : setIsMenuParticipant(false);
    showDate.length ? setIsMenuDatePick(true) : setIsMenuDatePick(false);
    privateTour && hotel.name.length ? setIsMenuHotel(true) : setIsMenuHotel(false);
    privateTour && transport.name.length ? setIsMenuTransport(true) : setIsMenuTransport(false);
    if (privateTour)
      setAvailability(!!guestInfo.length && !!showDate.length && !!hotel.name.length && !!transport.name.length);
    else
      setAvailability(!!guestInfo.length && !!showDate.length);
  }

  function setPrivateOptions(type: string, id: string, value: string) {
    if (type === 'hotel')
      setHotel({ id: id, name: value })
    else
      setTransport({ id: id, name: value })
  }

  const handleMarkerClick = (item: IItineraryItem) => {
    if (mapRef.current) {
      mapRef.current.flyToMarker(item.location.coordinates)
    }
  }

  return (
    <VStack
      maxWidth="1300px"
      width="full"
      marginX="auto"
      align="flex-start"
      spacing={4}
      padding={8}
    >
      <Heading color="gray.800" fontWeight={700} lineHeight={10}>
        {tourDetail?.title}
      </Heading>
      <RatingStart sizeStar={24} sizeText="md" ratingAverage={tourDetail?.ratingAverage} numOfRating={tourDetail?.numOfRating} />
      <Box position={'relative'} height={{ base: '300px', lg: '600px' }} width={'full'} overflow={'hidden'}>
        <IconButton
          aria-label="left-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          left={side}
          top={top}
          transform={'translate(0%, -50%)'}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
        >
          <BiLeftArrowAlt />
        </IconButton>
        {/* Right Icon */}
        <IconButton
          aria-label="right-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          right={side}
          top={top}
          transform={'translate(0%, -50%)'}
          zIndex={2}
          onClick={() => slider?.slickNext()}
        >
          <BiRightArrowAlt />
        </IconButton>
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
          {tourDetail?.images?.map((url, index) => (
            <Image
              key={index}
              height={{ base: '300px', lg: '600px' }}
              position="relative"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              borderRadius='12px'
              backgroundImage={`url(${url})`}
            />
          ))}
        </Slider>
      </Box>
      <Stack width="full" flexDirection={{ base: 'column', lg: 'row' }} justify="space-between" paddingTop="32px" gap={10}>
        <VStack
          alignSelf="flex-start"
          flex={2}
          width="full"
          align="flex-start"
        >
          <Text fontSize="lg" paddingRight="30px">
            {tourDetail?.summary}
          </Text>
          <Stack width="full" flexDirection={{ base: 'column', lg: 'row' }} overflow="hidden" marginY='24px'>
            <Box width={{ base: '100%', lg: '60%' }} >
              <Timeline itinerary={tourDetail?.itinerary || []} onMarkerClick={handleMarkerClick} />
            </Box>
            {/* Column for Maps component */}
            <Box width={{ base: '100%', lg: '70%' }}>
              <ItineraryMap ref={mapRef} itinerary={tourDetail?.itinerary || []} />
            </Box>
          </Stack>
          <Title text='About this activity' />
          <HStack align="flex-start" padding="16px">
            <Text fontSize="3xl">
              <FaRegCalendarCheck />
            </Text>
            <VStack align="flex-start">
              <Text fontSize="lg" fontWeight="bold">
                Free cancellation
              </Text>
              <Text>Cancel up to 24 hours in advance for a full refund</Text>
            </VStack>
          </HStack>
          <HStack align="flex-start" padding="16px">
            <Text fontSize="3xl">
              <FaCreditCard />
            </Text>
            <VStack align="flex-start">
              <Text fontSize="lg" fontWeight="bold">
                Reserve now & pay later
              </Text>
              <Text>
                Keep your travel plans flexible — book your spot and pay
                nothing today.
              </Text>
            </VStack>
          </HStack>
          <HStack align="flex-start" padding="16px">
            <Text fontSize="3xl">
              <PiClockCountdownBold />
            </Text>
            <VStack align="flex-start">
              <Text fontSize="lg" fontWeight="bold">
                Duration
              </Text>
              <Text>{tourDetail?.duration} hours</Text>
            </VStack>
          </HStack>
          <HStack align="flex-start" padding="16px">
            <Text fontSize="3xl">
              <RiMapPinUserLine />
            </Text>
            <VStack align="flex-start">
              <Text fontSize="lg" fontWeight="bold">
                Live tour guide
              </Text>
              <Text>English</Text>
            </VStack>
          </HStack>
          <Box
            width="full"
            height="fit-content"
            padding="16px"
            background="rgb(4, 54, 74)"
            borderRadius="15px"
            id="available_box"
          >
            <Stack width='full' flexDirection={{ base: 'column', lg: 'row' }} justifyContent={{ lg: 'space-between' }}>
              <Text fontSize="2xl" fontWeight="bold" color="#fff">
                Select participant and date
              </Text>
              {tourDetail?.isPrivate && <FormControl display='flex' alignItems='center' width='unset'>
                <FormLabel htmlFor='private-tour' mb='0' color='#fff'>
                  Private tour?
                </FormLabel>
                <Switch id='private-tour' isChecked={privateTour} onChange={handleEnablePrivate} />
              </FormControl>}
            </Stack>
            <Stack
              width="full"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems='center'
              justifyContent="space-between"
            >
              <SimpleGrid
                flex={{ base: 1, md: 2 }}
                width='full'
                columns={{ base: 1, md: 2 }}
                gap={4}
                justifyContent="space-between"
                paddingTop="8px"
              >
                <GridItem>
                  <Menu
                    autoSelect={false}
                    computePositionOnMount
                    placement="bottom-start"
                  >
                    <VStack>
                      <MenuButton
                        width="full"
                        height="40px"
                        background="#fff"
                        borderRadius="999px"
                        padding="8px 12px"
                        fontWeight="bold"
                      >
                        <HStack justifyContent="space-between">
                          <HStack fontSize="md" alignItems="center">
                            <Text fontSize="2xl">
                              <IoPeople />
                            </Text>
                            <Text>
                              {guestInfo.length > 0
                                ? guestInfo.map(
                                  (guest) =>
                                    `${guest.title} x${guest.quantity} `
                                )
                                : "Select participant"}
                            </Text>
                          </HStack>
                          <TriangleDownIcon />
                        </HStack>
                      </MenuButton>
                    </VStack>
                    <MenuList minWidth="320px" padding="4px 10px">
                      {priceOptions &&
                        priceOptions
                          .filter((participant) => privateTour ? participant.participantsCategoryIdentifier === "Private" : !participant.participantsCategoryIdentifier)
                          .map((participant, index) => (
                            <MenuItem
                              key={index}
                              type={participant.title}
                              price={participant.value}
                              currency={tourDetail?.currency ?? ''}
                              setPrice={setPrice}
                              setType={setType}
                              setQuantity={setQuantity}
                            />
                          )
                          )
                      }
                    </MenuList>
                  </Menu>
                  <Text textAlign="center" color="red">
                    {!isMenuParticipant && "Please choose participants"}
                  </Text>
                </GridItem>
                <GridItem>
                  <Menu
                    autoSelect={false}
                    computePositionOnMount
                    placement="bottom-start"
                  >
                    <MenuButton
                      width="full"
                      height="40px"
                      background="#fff"
                      borderRadius="999px"
                      padding="8px 12px"
                      fontWeight="bold"
                    >
                      <HStack justifyContent="space-between">
                        <HStack fontSize="md" alignItems="center">
                          <Text fontSize="2xl">
                            <LuCalendarDays />
                          </Text>
                          <Text>
                            {!selectedDate ? "Select date" : `${showDate}`}
                          </Text>
                        </HStack>
                        <TriangleDownIcon />
                      </HStack>
                    </MenuButton>

                    <MenuList>
                      <HStack spacing={8}>
                        <CustomCalendar
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                        />
                      </HStack>
                    </MenuList>
                  </Menu>
                  <Text textAlign="center" color="red">
                    {!isMenuDatePick && "Please select date"}
                  </Text>
                </GridItem>

                {privateTour &&
                  <>
                    <GridItem>
                      <Menu
                        autoSelect={false}
                        computePositionOnMount
                        placement="bottom-start"
                      >
                        <MenuButton
                          width="full"
                          height="40px"
                          background="#fff"
                          borderRadius="999px"
                          padding="8px 12px"
                          fontWeight="bold"
                        >
                          <HStack justifyContent="space-between">
                            <HStack fontSize="md" alignItems="center">
                              <Text fontSize="2xl">
                                <FaHotel />
                              </Text>
                              <Text>
                                {hotel?.name !== '' ? hotel.name : 'Select hotel'}
                              </Text>
                            </HStack>
                            <TriangleDownIcon />
                          </HStack>
                        </MenuButton>
                        <MenuList>
                          <VStack spacing={2}>
                            {tourDetail?.hotels && tourDetail?.hotels.map((hotel, index) => (
                              <Button height={{ base: '70px' }} width={{ base: 'full' }} onClick={() => setPrivateOptions('hotel', hotel._id, hotel.name)}>
                                <PrivateOptions index={index} name={hotel.name} image={hotel.thumbnail} />
                              </Button>
                            ))}
                          </VStack>
                        </MenuList>
                      </Menu>
                      <Text textAlign="center" color="red">
                        {!isMenuHotel && "Please select hotel"}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Menu
                        autoSelect={false} computePositionOnMount placement="bottom-start" >
                        <MenuButton
                          width="full"
                          height="40px"
                          background="#fff"
                          borderRadius="999px"
                          padding="8px 12px"
                          fontWeight="bold"
                        >
                          <HStack justifyContent="space-between">
                            <HStack fontSize="md" alignItems="center">
                              <Text fontSize="2xl">
                                <FaBus />
                              </Text>
                              <Text>
                                {transport?.name !== '' ? transport.name : 'Select transportation'}
                              </Text>
                            </HStack>
                            <TriangleDownIcon />
                          </HStack>
                        </MenuButton>
                        <MenuList>
                          <VStack spacing={2}>
                            {tourDetail?.transports && tourDetail?.transports.map((transport, index) => (
                              <Button height={{ base: '70px' }} width={{ base: 'full' }} onClick={() => setPrivateOptions('transport', transport._id, transport.name)}>
                                <PrivateOptions index={index} name={transport.name} image={transport.image} />
                              </Button>
                            ))}
                          </VStack>
                        </MenuList>
                      </Menu>
                      <Text textAlign="center" color="red">
                        {!isMenuTransport && "Please select transport"}
                      </Text>
                    </GridItem>
                  </>
                }
              </SimpleGrid>
              <Button flex={{ base: 1 }} paddingY='10px' width='full' colorScheme="teal" borderRadius="80px" onClick={handleCheckAvailability} >
                Check availability
              </Button>
            </Stack>
          </Box>
          <Box
            width="full"
            height="fit-content"
            border="2px solid teal"
            borderRadius="15px"
            display={availability ? "block" : "none"}
          >
            <VStack align="flex-start">
              <VStack
                fontWeight='500'
                align="flex-start"
                width="full"
                padding="24px 24px 0px"
                _after={{
                  content: "''",
                  width: "full",
                  height: "2px",
                  marginTop: "10px",
                  color: "#ccc",
                  background: "#ccc",
                }}
              >
                <Text fontSize="2xl" fontWeight="bold">
                  {tourDetail?.title}{privateTour && ' (Private)'}
                </Text>
                <HStack>
                  <PiClockCountdownBold size="1.5rem" />
                  <Text fontSize="md">
                    Duration: {tourDetail?.duration} hours
                  </Text>
                </HStack>
                <HStack>
                  <FaLocationDot size="1.5rem" />
                  <Text fontSize="md">Meet at {startLocation?.address} </Text>
                </HStack>
                {privateTour &&
                  <>
                    {hotel.name !== '' &&
                      <HStack>
                        <FaHotel size="1.5rem" />
                        <Text fontSize="md"> {hotel.name} </Text>
                      </HStack>
                    }
                    {transport.name !== '' &&
                      <HStack>
                        <FaBus size="1.5rem" />
                        <Text fontSize="md"> {transport.name} </Text>
                      </HStack>
                    }
                  </>
                }
              </VStack>
              <VStack width="50%" align="flex-start" margin="16px 24px 24px">
                <Text fontSize="xl" fontWeight="bold">
                  Price breakdown
                </Text>
                {guestInfo.map((guest) => (
                  <HStack
                    key={guest.title}
                    width="100%"
                    justifyContent="space-between"
                  >
                    <Text fontWeight='500' fontSize="lg">
                      {guest.title} {guest.quantity} x{" "}
                      {formatCurrency(guest.price, tourDetail?.currency ?? '')}
                    </Text>
                    <Text fontWeight='500' fontSize="lg">{guest.price && formatCurrency(guest.price * guest.quantity, tourDetail?.currency ?? '')}</Text>
                  </HStack>
                ))}
              </VStack>
              <Box
                width="full"
                height="fit-content"
                background="#EBEEF1"
                padding="24px 20px"
                borderBottomRadius="15px"
              >
                <HStack justify="space-between" padding="4px 8px">
                  <VStack align="flex-start">
                    <Text fontSize="md" fontWeight="bold">
                      Total price
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {totalPrice !== 0 ? `${totalPrice && formatCurrency(totalPrice, tourDetail?.currency ?? '')}` : ""}
                    </Text>
                  </VStack>
                  <HStack>
                    <Button color='#fff' colorScheme="teal" onClick={handleAddToCart} isLoading={isLoading}>
                      Add to cart
                    </Button>
                    <Button color='#fff' colorScheme="teal" onClick={handleBookNow} isLoading={isLoading}>
                      Book now
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </VStack>
        <VStack alignSelf="flex-start" width="full" flex={1}>
          <VStack
            width="full"
            height="fit-content"
            spacing={4}
          >
            <VStack
              width="100%"
              align="flex-start"
              padding={4}
              border="3px solid #DCDFE4"
              borderTopColor="teal"
              borderRadius={2}
              spacing={0}
            >
              <SimpleGrid columns={{ base: 1, xl: 2 }} alignItems='center' width='full' spacing={2}>
                <GridItem>
                  <Text>From</Text>
                  <Text fontSize="xl" fontWeight={700} flex={2}>
                    {tourDetail?.regularPrice && formatCurrency(tourDetail?.regularPrice, tourDetail?.currency ?? '')}
                  </Text>
                  <Text>per person</Text>
                </GridItem>
                <GridItem width='full'>
                  <Button
                    colorScheme="teal"
                    borderRadius="80px"
                    display={{ base: 'none', lg: 'block' }}
                    textAlign='center'
                    width="full"
                    flex={1}
                    alignSelf='center'
                    marginTop='24px'
                    onClick={() => {
                      const el = document.getElementById('available_box');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Check availability
                  </Button>
                </GridItem>
              </SimpleGrid>
              <HStack marginTop="24px !important" spacing={6}>
                <Icon iconName="card.svg" size={40} />
                <Text fontSize="sm">
                  Reserve now & pay later to book your spot and pay nothing
                  today
                </Text>
              </HStack>
            </VStack>
            <VStack
              width="100%"
              padding={4}
              border="3px solid #DCDFE4"
              borderTopColor="teal"
              borderRadius={2}
              spacing={4}
            >
              {!userId ? (
                <Text fontSize="md" textAlign="center">
                  To view the 360 Tour, please login first, then click the button below.
                </Text>
              ) : (
                <Text fontSize="md" textAlign="center">
                  To view the 360 Tour, please click the button below.
                </Text>
              )}

              <Button
                colorScheme="teal"
                borderRadius="80px"
                padding={3}
                width="content"
                flex={1}
                alignSelf="center"
                isDisabled={!userId || !tourDetail?.virtualTours || tourDetail?.virtualTours.length === 0}
                onClick={() => {
                  if (tourDetail?.virtualTours && tourDetail?.virtualTours.length > 0) {
                    const previewUrl = window.open(routes.virtualTour.value(tourDetail?._id ?? '', '1'), '_blank')
                    if (previewUrl) {
                      previewUrl.focus()
                    }
                  }
                }}
              >
                <HStack spacing={2} align="center">
                  <Icon iconName="eye.svg" size={20} />
                  <Text>View 360 Tour</Text>
                </HStack>
              </Button>

            </VStack>
          </VStack>
        </VStack>
      </Stack>
      <Divider borderColor="#888" />
      <Title text='Customer reviews' />
      <TourReviews tourId={`${tourDetail?._id}`} ratingAverage={tourDetail?.ratingAverage ?? 0} numOfRating={tourDetail?.numOfRating ?? 0} />
      <ChatBot />
    </VStack>
  );
};

export default observer(TourDetailPage);
