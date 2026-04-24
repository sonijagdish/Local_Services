import { loadState, saveState } from "../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import { addNotification } from "../../utils/notification";

const getBookings = () => {
  return loadState("bookings") || [];
};

const addBooking = (bookingData) => {
  const bookings = loadState("bookings") || [];
  const services = loadState("services") || [];
  
  const newBooking = {
    id: uuidv4(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...bookingData,
  };
  
  const service = services.find(s => s.id === bookingData.serviceId);
  if (service && service.providerId) {
      addNotification(
          service.providerId,
          "New Booking Request",
          `A new request for "${service.title}" has been received. Check your dashboard.`
      );
  }
  
  bookings.push(newBooking);
  saveState("bookings", bookings);
  return newBooking;
};

const updateBookingStatus = (id, status) => {
  const bookings = loadState("bookings") || [];
  const services = loadState("services") || [];
  const users = loadState("users") || [];

  const updatedBookings = bookings.map((b) => {
    if (b.id === id) {
      const service = services.find((s) => s.id === b.serviceId);
      
      // Notify user about status change
      addNotification(
          b.userId,
          "Booking Update",
          `Your booking for "${service?.title || 'service'}" is now ${status.toUpperCase()}.`
      );

      // Logic for wallet update when booking is completed
      if (status === "completed" && b.status !== "completed") {
        if (service && service.providerId && service.providerId !== 'admin') {
          const providerIndex = users.findIndex((u) => u.id === service.providerId);
          if (providerIndex !== -1) {
            const commissionPercent = Number(localStorage.getItem('commission_rate')) || 10;
            const commissionAmount = (Number(service.price) * (commissionPercent / 100));
            const netPayout = Number(service.price) - commissionAmount;

            users[providerIndex].wallet = (Number(users[providerIndex].wallet) || 0) + Number(netPayout.toFixed(2));
            
            // Log it in a simple system revenue log?
            const platformRevenueLog = loadState("platform_revenue_log") || [];
            platformRevenueLog.push({
                type: 'commission',
                amount: commissionAmount,
                bookingId: id,
                date: new Date().toISOString()
            });
            saveState("platform_revenue_log", platformRevenueLog);
            saveState("users", users);
          }
        }
      }
      return { ...b, status };
    }
    return b;
  });

  saveState("bookings", updatedBookings);
  return updatedBookings;
};

const deleteBooking = (id) => {
  const bookings = loadState("bookings") || [];
  const updatedBookings = bookings.filter((b) => b.id !== id);
  saveState("bookings", updatedBookings);
  return updatedBookings;
};

export default { getBookings, addBooking, updateBookingStatus, deleteBooking };