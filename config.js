// RENDIS 2027 GRAND-BASSAM — configuration
window.RENDIS_CONFIG = {
  SUPABASE_URL: "https://colewahriqfeubfneseq.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_BSb8y-lBZlMLPaT6mWyiDQ_1ZyIi4La",
  GOAL_FCFA: 60000000,
  DJAMO_BUSINESS_PAYMENT_LINK: "https://pay.djamo.com/y0olu"
};

window.addEventListener("load", function () {
  if (document.querySelector('script[data-rendis-fixes="T"]')) return;

  var s = document.createElement("script");
  s.src = "rendis-fixes.js";
  s.dataset.rendisFixes = "T";
  s.defer = true;

  document.head.appendChild(s);
}, { once: true });

window.addEventListener("load", function () {
  if (document.querySelector('script[data-benie-hommage="T"]')) return;

  var s = document.createElement("script");
  s.src = "hommage-benie-richmond.js";
  s.dataset.benieHommage = "T";
  s.defer = true;

  document.head.appendChild(s);
}, { once: true });

window.addEventListener("load", function () {
  if (document.querySelector('script[data-rendis-gadgets="T"]')) return;

  var s = document.createElement("script");
  s.src = "rendis-gadgets.js";
  s.dataset.rendisGadgets = "T";
  s.defer = true;

  document.head.appendChild(s);
}, { once: true });
