import { logout } from "../userauth/AuthService";
import { resetUser } from "@/redux/features/UserSlice";
import { clearNotifications } from "@/redux/features/notificationSlice";



export const performLogout = (dispatch, navigate , userType) => {
  logout();
  dispatch(resetUser());
  dispatch(clearNotifications());
  let redirectPath; 
  if (!userType || userType === 'user') {
    redirectPath = '/';
  } else {
    redirectPath = `/${userType}/login`;
  }  
  navigate(redirectPath);
};