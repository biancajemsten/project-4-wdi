const publicVapidKey = 'BB6b3GD1wulS5BXvcpdm93v2NIXHoEE2tszOX1iD1yLHoIpSVYOdyeW49UzuI8UWdKor62EcRs8lylUF-KW3Jns';
import Auth from './Auth';

class Push {
  //register Sw, Register Push, Send Push
  static register() {
    //Register service worker
    console.log('Registering service worker... ');
    return navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
      .then(register => {
        return register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey)
        });
      })
      .then(subscription => {
        return fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${Auth.getToken()}`
          }
        });
      });
  }

  static urlBase64ToUint8Array(base64String) {
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
}

export default Push;
