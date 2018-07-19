self.addEventListener('push', (event) => {
  console.log('Push Message', event);
  const data = event.data.json();
  console.log('push received...');
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/assets/images/checklogo.png',
    data: {
      click_url: data.url
    }
  });
});
