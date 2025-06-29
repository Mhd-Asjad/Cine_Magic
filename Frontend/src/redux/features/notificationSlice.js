import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
    name : 'notifications',
    initialState : {
        notifications : [],
        counts : {
            booking_count: 0,
            complaint_count: 0,
            unread_count: 0
        },
        loading: true,
    },
    
    reducers : {
        setNotifications(state,action) {
            state.notifications = action.payload;
            state.counts = {
                booking_count : action.payload.filter(n => ['Booking' , 'Cancelled'].includes(n.notification_type)).length,
                complaint_count: action.payload.filter(n => n.notification_type === 'complaint').length,
                unread_count: action.payload.filter(n => !n.is_read).length,

            };
            state.loading = false;
        },
        addNotification(state, action) {
            state.notifications.unshift(action.payload);
            state.counts = {
                booking_count: state.notifications.filter(n => ['Booking', 'Cancelled'].includes(n.notification_type)).length,
                complaint_count: state.notifications.filter(n => n.notification_type === 'complaint').length,
                unread_count: state.notifications.filter(n => !n.is_read).length,
      };
    },
    updateUnreadCount(state , action ) {
        state.counts.unread_count = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },

  },

})

export const { setNotifications , addNotification, updateUnreadCount, setLoading } = notificationsSlice.actions;
export default notificationsSlice.reducer;