import { Calendar, Theater , Inbox, Search, ScrollText } from "lucide-react";

export const sidebarItems = [
    { id : 'theatres', title: "Theatres", url: "showtheatres", icon: Theater },
    { id : 'customers' , title: "customers", url: "customers", icon: Inbox },
    { id : 'movies' , title: "Movies", url: "movies", icon: Calendar },
    { id : 'bookings' , title: "bookings", url: "bookings", icon: Search },
    { id : 'Complaints' , title: "Complaints", url: "complaints", icon: ScrollText },

]; 
export const subMenus  = {
    theatres : ['showtheatres' , 'pending-theatres' ],
    customers : [ 'customers' ,"enquery" ],
    movies : [ "movies" , "add-movies"   ] ,
}
