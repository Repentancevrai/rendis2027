// RENDIS 2027 — Hommage à Bénié Richmond Alex
(function () {
  function addTribute() {
    const media = document.getElementById("media");
    if (!media || document.getElementById("rendisTribute")) return;

    const section = document.createElement("section");
    section.id = "rendisTribute";
    section.style.cssText =
      "margin:45px 0 55px;padding:10px 0;";

    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">HOMMAGE</p>
        <h2>HOMMAGE À UN SERVITEUR DÉVOUÉ</h2>
        <p>À Bénié Richmond Alex, PCO de l'Église du Christ de Grand-Bassam.</p>
      </div>

      <div style="background:#fff;border:1px solid rgba(18,33,58,.10);border-radius:22px;overflow:hidden;box-shadow:0 12px 35px rgba(18,33,58,.08);">

        <img
          src="images/benie-richmond-alex-nouvelle.jpg"
          alt="Bénié Richmond Alex et son épouse"
          loading="lazy"
          style="width:100%;max-height:520px;object-fit:cover;display:block;"
        >

        <div style="padding:24px;">
          <p style="font-size:12px;letter-spacing:.08em;font-weight:700;margin:0 0 8px;opacity:.7;">
            PCO — ÉGLISE DU CHRIST DE GRAND-BASSAM
          </p>

          <h3 style="margin:0 0 14px;font-size:26px;">
            Bénié Richmond Alex
          </h3>

          <p style="margin:0;line-height:1.75;">
            Nous rendons hommage à Bénié Richmond Alex, homme à tout faire
            et serviteur profondément dévoué à l'œuvre de l'Église.
            Avec son épouse à ses côtés, il se distingue par sa disponibilité,
            son engagement et son attachement à l'Église du Christ de
            Grand-Bassam. Que Dieu bénisse leur dévouement et leur service fidèle.
          </p>
        </div>
      </div>
    `;

    media.appendChild(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addTribute, { once: true });
  } else {
    addTribute();
  }

  window.addEventListener("load", addTribute, { once: true });
})();
