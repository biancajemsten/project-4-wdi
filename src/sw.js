self.addEventListener('push', (event) => {
  console.log('WTF IS SELF!', self);
  console.log('Push Message', event);
  const data = event.data.json();
  console.log('push received...');
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png'
  });
});
