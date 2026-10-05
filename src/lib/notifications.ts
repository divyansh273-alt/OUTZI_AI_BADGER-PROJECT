export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showLocalNotification(title: string, options?: NotificationOptions): boolean {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
    return true;
  } catch (err) {
    console.warn('Failed to trigger notification:', err);
    return false;
  }
}
