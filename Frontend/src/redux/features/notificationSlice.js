import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name : 'notifications',
    initialState : {
        notifications : [],
        counts : {
            booking_count: 0,
            complaint_count: 0,
            unread_count: 0,
            unread_complaint_count: 0 
        },
        loading: true,
    },
    
    reducers : {
      setNotifications(state, action) {
        const notifications = action.payload;

        state.notifications = notifications;

        state.counts = {
            booking_count: notifications.filter(n =>
                ['Booking', 'Cancelled'].includes(n.notification_type)).length,
            complaint_count: notifications.filter(n =>
                n.notification_type?.toLowerCase() === 'complaint').length,
            unread_count: notifications.filter(n =>
                !n.is_read).length,
            unread_complaint_count: notifications.filter(n =>
                !n.is_read && n.notification_type?.toLowerCase() === 'complaint').length,
        };

        state.loading = false;
      },

      addNotification(state, action) {
        state.notifications.unshift(action.payload);
        
        state.counts = {
            booking_count: state.notifications.filter(n =>
                ['Booking', 'Cancelled'].includes(n.notification_type)).length,
            complaint_count: state.notifications.filter(n =>
                n.notification_type?.toLowerCase() === 'complaint').length,
            unread_count: state.notifications.filter(n =>
                !n.is_read).length,
            unread_complaint_count: state.notifications.filter(n =>
                !n.is_read && n.notification_type?.toLowerCase() === 'complaint').length, // ➕
        };
      },

      updateUnreadCount(state , action ) {
          state.counts.unread_count = action.payload
      },
      setLoading(state, action) {
        state.loading = action.payload;
      },
      clearNotifications(state) {
        state.notifications = [];
        state.counts = {
          booking_count: 0,
          complaint_count: 0,
          unread_count: 0,
        };
      },

  },

})

export const { setNotifications , addNotification, updateUnreadCount, setLoading , clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;