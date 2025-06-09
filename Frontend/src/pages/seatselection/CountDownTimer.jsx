import React, { useEffect, useState } from 'react'

function CountDownTimer({ onExpiresAT , onExpire }) {
    const calculateTimeLeft = () => {
        const difference = new Date( onExpiresAT ) - new Date();
        return difference > 0 ? Math.floor(difference / 1000) : 0;
        };
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
        useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearInterval(interval);
        }, [onExpiresAT]);
    
        useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
        }
        }, [timeLeft, onExpire]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className='flex justify-end text-red-600 font-bold text-sm mb-4 pr-[10%]'  >

        session Expire : {minutes} : {seconds}
      
    </div>
  )
}

export default CountDownTimer
