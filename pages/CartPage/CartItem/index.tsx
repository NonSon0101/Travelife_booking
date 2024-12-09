import {
  HStack,
  VStack,
  Text,
  Image,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Checkbox,

} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { TfiTicket } from "react-icons/tfi";
import { IoPeople, IoTimerOutline } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { FaBus, FaHotel, FaRegCheckCircle } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { FaTrashAlt } from "react-icons/fa";
import {
  IDeleteCart,
  IParticipants,
  ITourCart,
  IUpdateToCart,
} from "interfaces/cart";
import { useEffect, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { TriangleDownIcon } from "@chakra-ui/icons";
import { FaCheckSquare } from "react-icons/fa";
import { useStores } from "hooks";
import CustomCalendar from "components/Layout/WebLayout/components/Calendar";
import MenuItem from "components/Layout/WebLayout/components/MenuItem";
import { PLATFORM } from "enums/common";
import { ISelectedCart } from "interfaces/checkout";
import { formatCurrency } from "utils/common";
import PrivateOptions from "components/Layout/WebLayout/components/privateOptions";
import { toast } from "react-toastify";

interface ICartItem {
  tour: ITourCart;
  idCart: string;
  currentCurrency: string;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CartItem = (props: ICartItem) => {
  const { tour, idCart, currentCurrency } = props;
  const route = useRouter()
  const [convertDate, setConvertDate] = useState<string>();
  const [tourPrice, setTourPrice] = useState<number>(0);
  const [prevPrice, setPrevPrice] = useState<number>(0);
  const [editTour, setEditTour] = useState<boolean>(false);
  const [guestInfo, setGuestInfo] = useState<IParticipants[]>([]);
  const [selectedDate, setSelectedDate] = useState<Value>(null);
  const [showDate, setShowDate] = useState<string[]>([]);
  const [updateDate, setUpdateDate] = useState<string>(tour.startDate);

  const [type, setType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [initialMount, setInitialMount] = useState(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [hotel, setHotel] = useState<{ id: string, name: string }>(
    tour.hotels && tour.hotels.length > 0
      ? { id: tour.hotels[0]._id, name: tour.hotels[0].name }
      : { id: '', name: '' }
  );
  const [transport, setTransport] = useState<{ id: string, name: string }>(
    tour.transports && tour.transports.length > 0
      ? { id: tour.transports[0]._id, name: tour.transports[0].name }
      : { id: '', name: '' }
  );


  const { cartStore, tourStore } = useStores();
  const { listCart } = cartStore;
  const { tourDetail } = tourStore

  useEffect(() => {
    tourStore.fetchTourDetail(tour.tour._id)
  }, [tour.tour._id])

  useEffect(() => {
    const filteredTours = tour.participants.map((tour) => ({
      title: tour.title,
      quantity: tour.quantity,
      price: tour.price,
    }));
    setGuestInfo(filteredTours);
  }, [tour.participants]);

  useEffect(() => {
    const timeStamp: string = tour.startDate;
    const date: Date = new Date(timeStamp);
    const formattedDate: string = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setConvertDate(formattedDate);
  }, [tour.startDate]);

  useEffect(() => {
    let totalPrice = 0;

    tour.participants.forEach((tour) => {
      totalPrice += tour.price * tour.quantity;
    });

    setTourPrice(totalPrice);
  }, [tour.participants]);

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
    setUpdateDate(formattedDate.toString());
  }, [selectedDate]);

  function handleEditTour() {
    setEditTour((prev) => !prev);
  }

  function handleCommand() {
    const userId = localStorage.getItem(`${PLATFORM.WEBSITE}UserId`);
    if (userId) {
      if (editTour) {
        const data: IUpdateToCart = {
          user: userId,
          tour: {
            itemId: tour._id,
            startDate: updateDate,
            startTime: "7h00",
            participants: guestInfo,
          },
        };
        if (tour.isPrivate) {
          data.tour = {
            ...data.tour,
            isPrivate: true,
            transports: [transport.id],
            hotels: [hotel.id]
          }
        }
        cartStore.updateCart(data);
        handleEditTour();
      } else {
        const data: IDeleteCart = {
          cart: listCart._id,
          itemId: idCart,
        };
        cartStore.deleteCart(data);
        route.refresh()
      }
    }
  }

  const setSelected = (): void => {
    const data: ISelectedCart = {
      tour: tour.tour._id,
      startDate: tour.startDate,
    };

    cartStore.setSelectedCart(data);
  };

  const notSetSelected = (): void => {
    cartStore.unSetSelectedCart(tour._id);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      setSelected();
    } else {
      notSetSelected();
    }
  };

  function setPrivateOptions(type: string, id: string, value: string) {
    if (type === 'hotel')
      setHotel({ id: id, name: value })
    else
      setTransport({ id: id, name: value })
  }

  return (
    <HStack
      height="full"
      position="relative"
      justifyContent="space-between"
      spacing={9}
      onClick={() => handleCheckboxChange}
    >
      <VStack
        height="full"
        _before={{
          position: "absolute",
          content: "''",
          width: "14px",
          borderRadius: "2px",
          top: 3,
          height: "42%",
          background: checked ? "#38A59F" : "#c4c4c4",
        }}
        _after={{
          position: "absolute",
          content: "''",
          width: "14px",
          borderRadius: "2px",
          bottom: 3,
          height: "42%",
          background: checked ? "#38A59F" : "#c4c4c4",
        }}
      >
        <Checkbox
          size="lg"
          isChecked={checked}
          onChange={handleCheckboxChange}
        />
      </VStack>
      <VStack align="flex-start" minWidth="740px">
        <Text textAlign="start" fontSize="xl" fontWeight="500" color={checked ? "#38A59F" : "#636A80"}>
          {convertDate}
        </Text>
        <HStack
          width="full"
          bg="#fff"
          minWidth="600px"
          height="fit-content"
          boxShadow="xl"
          padding="18px 20px"
          border="2px solid #ccc"
          borderColor={checked ? "#38A59F" : "#ccc"}
          borderRadius="8px"
        >
          <VStack alignSelf="flex-start">
            <Image
              borderRadius="8px"
              width="200px"
              src={`${tour?.tour?.thumbnail}`}
              alt="img"
            />
          </VStack>
          <VStack
            align="self-start"
            flex="1"
            paddingLeft="8px"
            fontSize="md"
            fontWeight="600"
          >
            <Link
              href={`/tour-detail/${tour.tour._id}`}
              _hover={{ textDecoration: "none" }}
            >
              <Text fontSize="xl" fontWeight="bold">
                {tour.tour.title}{tour.isPrivate ? ' (Private)' : ''}
              </Text>
            </Link>
            <HStack>
              <TfiTicket />
              <Text> Sunrise or Sunset Jeep Tour</Text>
            </HStack>
            <HStack width='full'>
              {!editTour ? (
                <HStack width='full' justifyContent='space-between'>
                  <HStack>
                    <IoTimerOutline />
                    <Text>
                      {convertDate} {tour.startTime}
                    </Text>
                  </HStack>
                  {tour.isPrivate &&
                    <HStack>
                      <FaHotel />
                      <Text>
                        {tour.hotels[0].name}
                      </Text>
                    </HStack>
                  }
                </HStack>

              ) : (
                <VStack width='full'>
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
                      <HStack>
                        <HStack alignItems="center">
                          <Text fontSize="xl">
                            <LuCalendarDays />
                          </Text>
                          <Text fontSize="md">
                            {!selectedDate ? `${convertDate}` : `${showDate}`}
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
                  {tour.isPrivate &&
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
                        <HStack>
                          <HStack alignItems="center">
                            <Text fontSize="xl">
                              <FaHotel />
                            </Text>
                            <Text fontSize="md">
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
                  }
                </VStack>
              )}
            </HStack>
            <HStack width='full'>
              {!editTour ? (
                <HStack width='full' justifyContent='space-between'>
                  <HStack>
                    <MdPeopleAlt />
                    {tour.participants.map((participant) => (
                      <Text key={participant.title}>
                        {participant.quantity} {participant.title}
                      </Text>
                    ))}
                  </HStack>
                  {tour.isPrivate &&
                    <HStack>
                      <FaBus />
                      <Text>
                        {tour.transports[0].name}
                      </Text>
                    </HStack>
                  }
                </HStack>
              ) : (
                <VStack width='full' alignItems='start'>
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
                        <HStack>
                          <HStack>
                            <Text fontSize="xl">
                              <IoPeople />
                            </Text>
                            <Text fontSize="md">
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
                      {tourDetail?.priceOptions?.filter((participant) => tour.isPrivate ? participant.participantsCategoryIdentifier === "Private" : !participant.participantsCategoryIdentifier)
                        .map((participant, index) => {
                          const foundParticipant = tour.participants.filter(p => p.title === participant.title);
                          const quantity = foundParticipant[0]?.quantity ?? 0
                          return (
                            <MenuItem
                              quantity={quantity}
                              key={index}
                              type={participant.title}
                              price={participant.value}
                              setPrice={setPrice}
                              setType={setType}
                              setQuantity={setQuantity}
                            />
                          );
                        })}
                    </MenuList>
                  </Menu>
                  {tour.isPrivate &&
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
                        <HStack>
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
                  }
                </VStack>
              )}
            </HStack>
            <HStack>
              <FaRegCheckCircle />
              <Text>Free cancellation</Text>
            </HStack>
            <HStack width="full" justifyContent="space-between">
              <HStack>
                <Button borderRadius="full" onClick={handleEditTour}>
                  {!editTour ? (
                    <>
                      <GoPencil />
                      <Text>Edit</Text>
                    </>
                  ) : (
                    "Cancel"
                  )}
                </Button>
                <Button borderRadius="full" onClick={handleCommand}>
                  {!editTour ? (
                    <FaTrashAlt color="red" />
                  ) : (
                    <FaCheckSquare color="green" />
                  )}
                </Button>
              </HStack>
              <Text fontSize="xl" fontWeight="600">
                {formatCurrency(tourPrice, currentCurrency)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default observer(CartItem);
