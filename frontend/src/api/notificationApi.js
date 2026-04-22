// 알림 API
import client from './client';

export const getNotifications = async (unreadOnly = false) => {
  const res = await client.get('/api/notifications', {
    params: unreadOnly ? { unreadOnly: true } : {},
  });
  return res.data.data;
};

export const markAsRead = async (notificationId) => {
  await client.patch(`/api/notifications/${notificationId}/read`);
};

export const markAsReadByReference = async (referenceId) => {
  await client.patch(`/api/notifications/read-by-reference/${referenceId}`);
};
