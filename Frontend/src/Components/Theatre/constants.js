import { Calendar, Home, Inbox, Settings , Armchair } from "lucide-react";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

export const items = [
  { title: "Home", url: "dashboard", icon: Home },
  { title: "confirm theatre", url: "theatre-confimation", icon: Inbox},
  { title: "Add show", url: "list-theatre", icon: Calendar },
  { title: "Seats", url: "seats-layout", icon: Armchair },
  { title: "Settings", url: "#", icon: Settings },
];