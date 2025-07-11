import { useEffect } from 'react';
import { addNotification , updateUnreadCount } from '@/redux/features/notificationSlice';
import { useDispatch } from 'react-redux';
import {toast} from 'sonner'
import { CircleCheckBig } from 'lucide-react';

const WebSocketManager = (() => {
  let socket = null;
  let reconnectTimeout = null;
  let isConnecting = false;

  const connect = (userId, dispatch) => {
    if (!userId || isConnecting) return;
    if (socket && socket.readyState === WebSocket.OPEN) return;

    isConnecting = true;
    const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.cine-magic.fun';
    socket = new WebSocket(`${WS_URL}/ws/notifications/${userId}/`);

    socket.onopen = () => {
      console.log('✅ Booking WebSocket connected');
      isConnecting = false;
      // clearTimeout(reconnectTimeout);
      // setInterval(() => {
      //   if (socket.readyState === WebSocket.OPEN) {
      //     socket.send(JSON.stringify({ type: 'ping' }));
      //   }
      // }, 30000);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📦 Booking Notification:', data);
        const eventType = data.type.replace(/"/g, '');
        if (eventType === 'booking_confirmed' || eventType === 'booking_cancelled') {
          dispatch(addNotification(data.notification));
          dispatch(updateUnreadCount(data.unread_count))
          toast(data.notification.message, {
            icon: <CircleCheckBig/>
          });
        } else if (eventType === 'unread_count_update') {
          dispatch(updateUnreadCount(data.unread_count));
        } else {
          dispatch(addNotification(data.notification))
          dispatch(updateUnreadCount(data.unread_count))
          toast(data.notification.message ,{
            icon: <CircleCheckBig/>
          })
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log(`🔌 Booking WebSocket disconnected: ${event.code} ${event.reason}`);
      socket = null;
      isConnecting = false;
      if (!event.wasClean) {
        console.log('🔄 Attempting to reconnect in 5 seconds...');
        reconnectTimeout = setTimeout(() => connect(userId, dispatch), 5000);
      }
    };

    socket.onerror = (error) => {
      console.error('Booking WebSocket error:', error);
      socket.close();
    };
  };

  const disconnect = () => {
    if (socket) {
      socket.close(1000, 'Application shutdown');
      socket = null;
      clearTimeout(reconnectTimeout);
    }
  };

  return { connect, disconnect };
})();


const useBookingWebSocket = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId ) {
      WebSocketManager.connect(userId, dispatch);
    }
    return () => {
    };
  }, [userId]);
};

export default useBookingWebSocket;