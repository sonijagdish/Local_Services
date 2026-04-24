import API from '../api/axios';

export const getNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data;
};

export const addNotification = async (userId, title, message) => {
  await API.post("/notifications", {
    user: userId,
    title,
    message
  });
  window.dispatchEvent(new Event('new-notification'));
};

export const markAllRead = async () => {
  await API.put("/notifications/read");
  window.dispatchEvent(new Event('new-notification'));
};

export const deleteNotification = async (id) => {
  await API.delete(`/notifications/${id}`);
  window.dispatchEvent(new Event('new-notification'));
};