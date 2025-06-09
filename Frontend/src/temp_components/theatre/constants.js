import { Calendar, Home, Inbox , Theater, Armchair } from "lucide-react";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

export const items = [
  {id : 'Home' , title: "Home", url: "dashboard", icon: Home },
  {id : 'confirm theatre' , title: "confirm theatre", url: "theatre-confimation", icon: Inbox},
  { id : 'theatres' , title: "theatres", url: "list-theatre", icon: Calendar },
  { id : 'Seats' , title: "Seats", url: "seats-layout", icon: Armchair },
  { id : 'booking' , title: "booking", url: "theatres/bookings", icon: Theater },
];