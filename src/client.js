const publicVapidKey = 'BB6b3GD1wulS5BXvcpdm93v2NIXHoEE2tszOX1iD1yLHoIpSVYOdyeW49UzuI8UWdKor62EcRs8lylUF-KW3Jns';

//check for service worker
if('serviceWorker' in navigator){
  send().catch(err => console.error(err));
}


//register Sw, Register Push, Send Push
async function send() {
  //Register service worker
  console.log('Registering service worker... ');
  const register = await navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  });
  console.log('Service worker registered... ');

  //register push
  console.log('registering push ...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('push registered....');



  //send push showNotification
  console.log('subscribing to push notifications....');
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => console.log('subscription successful', res));
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
