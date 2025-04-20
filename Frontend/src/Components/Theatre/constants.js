import { Calendar, Home, Inbox, Settings , Armchair } from "lucide-react";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

export const items = [
  {id : 'Home' , title: "Home", url: "dashboard", icon: Home },
  {id : 'confirm theatre' , title: "confirm theatre", url: "theatre-confimation", icon: Inbox},
  { id : 'theatres' , title: "theatres", url: "list-theatre", icon: Calendar },
  { id : 'Seats' , title: "Seats", url: "seats-layout", icon: Armchair },
  { id : 'settings' , title: "Settings", url: "#", icon: Settings },
];