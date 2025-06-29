import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Check, CheckCheck, Settings, RefreshCw } from 'lucide-react';
import Nav from '@/components/navbar/Nav';
import apiBooking from '@/axios/Bookingapi';
import { setNotifications , setLoading } from '@/redux/features/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import useBookingWebSocket from '@/contexts/useNotificationSocket';
const UserNotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('General');
    const { notifications, counts, loading } = useSelector((state) => state.notifications);
    const user = useSelector(state => (state.user))
    const dispatch = useDispatch();
    useBookingWebSocket(user?.id);

    useEffect(() => {
      fetchNotifications();
    }, []);
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            
            const res = await apiBooking.get('notifications/')
            dispatch(setNotifications(res.data.notifications));

        
      } catch (error) {
      console.error('Error fetching notifications:', error);

    } finally {
      setLoading(false);
    }
  };


  const getFilteredNotifications = () => {
    if (activeTab === 'General') {
      return notifications.filter(n => n.notification_type !== 'complaint');
    }
    if (activeTab === 'Complaints') {
      return notifications.filter(n => n.notification_type === 'complaint');
    }
    return notifications;
  };

  const handleNotificationAction = async (notificationId , action) => {
    try {

        const res = await apiBooking.post(`notification-actions/${notificationId}/`, {
            'action':action
        })
        console.log(res.data.message);
    }catch(error) {
        console.log(error , 'error while notification actions')
    }finally{
        fetchNotifications()
    }
  }

  const handleMarkAllAsRead = async() => {
    try {
        const res = apiBooking.post('markall-asread/');
        console.log(res.data)
    }catch(error){
        console.log('error while mark all as read')
    }finally{
        fetchNotifications()
    }
  }


  const getNotificationIcon = (type, isRead) => {
    switch (type) {
      case 'complaint':
        return <AlertCircle className={`w-5 h-5 ${isRead ? 'text-red-400' : 'text-red-500'}`} />;
      case 'booking':
        return <CheckCircle className={`w-5 h-5 ${isRead ? 'text-blue-400' : 'text-blue-500'}`} />;
      default:
        return <Bell className={`w-5 h-5 ${isRead ? 'text-gray-400' : 'text-blue-500'}`} />;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-blue-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>

        <Nav/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-blue-100 z-10 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
                <p className="text-sm text-gray-500">Manage your system alerts</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                {counts.unread_count > 0 && (
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {counts.unread_count} unread
                    </span>
                    <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium"
                    >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                    </button>
                </div>
                )}
                
                <button
                onClick={fetchNotifications}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh notifications"
                >
                <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
                
        
            </div>
            </div>

            <div className="flex border-b border-blue-100">
            {[
                { name: 'General', count: counts.booking_count },
                { name: 'Complaints', count: counts.complaint_count }
            ].map((tab) => (
                <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-1 py-4 text-sm font-medium relative transition-all duration-200 ${
                    activeTab === tab.name
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                >
                <div className="flex items-center justify-center gap-2">
                    {tab.name}
                    {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.name
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                        {tab.count}
                    </span>
                    )}
                </div>
                {activeTab === tab.name && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                )}
                </button>
            ))}
            </div>
        </div>

    \      <div className="px-6 py-4">
            {getFilteredNotifications().length === 0 ? (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                {activeTab === 'General' 
                    ? 'General notifications will appear here when available.'
                    : 'Customer complaints will be shown here when reported.'
                }
                </p>
            </div>
            ) : (
            <div className="space-y-3">
                {getFilteredNotifications().map((notification) => (
                <div
                    key={notification.id}
                    className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-md ${
                    !notification.is_read 
                        ? 'border-blue-200 shadow-sm ring-1 ring-blue-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="p-5">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        !notification.is_read ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                        {getNotificationIcon(notification.notification_type, notification.is_read)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${
                                !notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}>
                                {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3">
                                <p className="text-xs text-gray-500">
                                {getTimeAgo(notification.created)}
                                </p>
                                
                                {notification.booking_id && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Booking: {notification.booking_id}
                                </span>
                                )}
                                
                                {notification.complaint_id && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    Complaint: {notification.complaint_id}
                                </span>
                                )}
                            </div>
                            </div>

                            {/* Mark as read button */}
                            {!notification.is_read ? (
                            <button
                                onClick={() => handleNotificationAction(notification.id , 'mark_read')}
                                className="opacity-0 group-hover:opacity-100 ml-4 p-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Mark as read"
                            >
                               <Check className="w-4 h-4 text-blue-500" /> 
                            </button>
                            ):(
                                <div className='ml-4 p-2'>

                                    <CheckCheck className='w-4 h-4'/>
                                </div>
                            )}
                        </div>
                        </div>

                        {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </div>
  );
};

export default UserNotificationsPage;