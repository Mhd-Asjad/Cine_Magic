import React from 'react'
import { PayPalButtons , usePayPalScriptReducer } from '@paypal/react-paypal-js'
import apiBooking from '@/axios/Bookingapi';
import {toast} from 'sonner';

function Paypalcomponet({ amount , onPaymentSuccess }) {
    const styles = {
        color : 'blue'
    }
  return (
    <PayPalButtons
        createOrder={(data , actions) => {
            return actions.order.create({
                purchase_units : [{ amount : {value : amount}}]
            });

    
        }}  
        onApprove={(data , actions) => {
            return actions.order.capture().then(function(details){
                return apiBooking.post('process-payment/', {
                    'orderId' : data.orderID,
                    'payerId' : data.payerID,
                    'paymentDetails' : details
                },{
                    withCredentials:true
                })
                .then(response=> {
                    console.log(JSON.stringify(response.data))
                    if (onPaymentSuccess) {
                        onPaymentSuccess(details)
                    }
                })
                .catch(error=>{
                    console.error('JSON.stringify(error?.response?.data )', JSON.stringify(error?.response?.data));
                    toast('payment verification failed' , {
                        icon: '🚫',
                        description: error?.response?.data?.error || 'Payment verification failed'
                    });
                })
            })
        }}
        style={styles}
    >

    </PayPalButtons>
  )
}


export default Paypalcomponet
