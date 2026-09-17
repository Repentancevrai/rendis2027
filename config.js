// RENDIS 2027 GRAND-BASSAM — configuration
window.RENDIS_CONFIG = {
  SUPABASE_URL: "https://colewahriqfeubfneseq.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_BSb8y-lBZlMLPaT6mWyiDQ_1ZyIi4La",
  GOAL_FCFA: 60000000,
  DJAMO_BUSINESS_PAYMENT_LINK: "https://pay.djamo.com/y0olu",
  ORANGE_MONEY_NUMBER: "+225 07 48 96 16 24",
  WAVE_NUMBER: "+225 07 48 96 16 24"
};

window.addEventListener("load", function () {
  if (document.querySelector('script[data-rendis-fixes="1"]')) return;
  var s = document.createElement("script");
  s.src = "rendis-fixes.js";
  s.dataset.rendisFixes = "1";
  s.defer = true;
  document.head.appendChild(s);
}, { once: true });
window.addEventListener("load", function () {
  if (document.querySelector('script[data-benie-hommage="1"]')) return;

  var s = document.createElement("script");
  s.src = "hommage-benie-richmond.js";
  s.dataset.benieHommage = "1";
  s.defer = true;

  document.head.appendChild(s);
}, { once: true });
window.addEventListener("load", function () {
  if (document.querySelector('script[data-rendis-gadgets="1"]')) return;

  var s = document.createElement("script");
  s.src = "rendis-gadgets.js";
  s.dataset.rendisGadgets = "1";
  s.defer = true;

  document.head.appendChild(s);
}, { once: true });
