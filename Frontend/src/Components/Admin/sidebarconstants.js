import { Calendar, Theater , Inbox, Search, Settings } from "lucide-react";

export const sidebarItems = [
    { id : 'theatres', title: "Theatres", url: "showtheatres", icon: Theater },
    { id : 'customers' , title: "customers", url: "customers", icon: Inbox },
    { id : 'movies' , title: "Movies", url: "movies", icon: Calendar },
    { id : 'search' , title: "Search", url: "#", icon: Search },
    { id : 'settings' , title: "Settings", url: "#", icon: Settings },

]; 
export const subMenus  = {
    customers : [ 'customers' ,"enquery" ],
    Movies : ["AddMovies" ] ,
}
