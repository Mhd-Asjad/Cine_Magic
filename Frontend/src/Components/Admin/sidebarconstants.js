import { Calendar, Theater , Inbox, Search, Settings } from "lucide-react";

export const sidebarItems = [
    { id : 'theatres', title: "Theatres", url: "showtheatres", icon: Theater },
    { id : 'customers' , title: "customers", url: "customers", icon: Inbox },
    { id : 'movies' , title: "Movies", url: "movies", icon: Calendar },
    { id : 'bookings' , title: "bookings", url: "bookings", icon: Search },
    { id : 'settings' , title: "Settings", url: "#", icon: Settings },

]; 
export const subMenus  = {
    theatres : ['showtheatres' , 'pending-theatres' ],
    customers : [ 'customers' ,"enquery" ],
    movies : [ "movies" , "add-movies"   ] ,
}
