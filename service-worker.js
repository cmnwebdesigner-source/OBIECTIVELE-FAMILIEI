self.addEventListener('push', (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: 'Obiectivele Familiei',
      body: event.data ? event.data.text() : 'Ai o notificare nouă.'
    };
  }

  const title = data.title || 'Obiectivele Familiei';

  const options = {
    body: data.body || 'Ai o notificare nouă.',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    // Un singur loc pentru notificările aplicației:
    // nu se adună notificări peste notificări.
    tag: data.tag || 'familie-notificare',
    // Dar fiecare notificare nouă trebuie să aprindă iar bannerul/sunetul.
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          return;
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
