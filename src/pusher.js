import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import Ably from "ably";

window.Pusher = Pusher;
window.Ably = Ably;


window.Echo = new Echo({
  // ========================= GENERAL =========================
  broadcaster: 'pusher',
  // ========================= PUSHER =========================
  key: 'c328570d0ba8235df248', // pusher
  cluster: 'us2',// pusher
  forceTLS: true, // pusher
  // ========================= ABLY =========================
  // key: "QnWqUQ.ZzBzlQ:ALEpcqSV8npza2IAZFHU5crPcd2MvkBq6MDGownBTsc", // ably
  // wsPort: 443, // ably
  // encrypted: true, // ably
  // disableStats: true, // ably
  // wsHost: "realtime-pusher.ably.io", // ably
})
