import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import  {AppSidebar} from "./AppSidebar";

export default function Layout({ children }) {
    return (
      <SidebarProvider>
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 p-4 ">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  }
  