console.log('I am a serviceworker');
 

self.addEventListener('push', (event) => {
  console.log('Push Message', event);
  const data = event.data.json();
  console.log('push received...');
  self.registration.showNotification(data.title, {
    body: 'Notified by Bianca',
    icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png'
  });
});
