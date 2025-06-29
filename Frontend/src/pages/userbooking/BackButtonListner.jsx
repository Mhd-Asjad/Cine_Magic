import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";

function BackButtonListner() {
    const location = useLocation();
    const navigate = useNavigate();

  useEffect(() => {
    handlePopState = (event) => {
      console.log("Back or forward button was pressed");

    }
    window.addEventListener('popstate' , handlePopState)
    return () => {
      window.addEventListener('popstate' , handlePopState)

    }
  },[])
  return null;

}

export default BackButtonListner
