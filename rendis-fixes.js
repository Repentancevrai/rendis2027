// RENDIS 2027 — correctifs boutique, communauté et vidéos
(function () {
  function money(value) {
    return new Intl.NumberFormat("fr-FR").format(Math.round(Number(value) || 0)) + " FCFA";
  }

  function getTotal() {
    const form = document.getElementById("orderForm");
    if (!form) return 0;
    const prices = {
  
economiqueQty: 10000,
premiumQty: 20000,
pagnePieceQty: 6000,
      tshirtQty: 4000,
  poloQty: 5000,
  sacQty: 4000
};
    const data = new FormData(form);
    return Object.entries(prices).reduce((sum, [name, price]) =>
      sum + Math.max(0, Number(data.get(name)) || 0) * price, 0);
  }

  function fixPinPhoto() {
    const card = document.querySelector("#precommandes .shop-grid .product-card");
    if (!card) return;
    const old = card.querySelector("img");
    if (!old || old.dataset.rendisPinsFixed === "1") return;

old.src = "images/WA_1789714650198.jpeg";
    old.alt = "Les deux modèles officiels de pins RENDIS 2027 :Économique et Premium";
    old.loading = "lazy";
    old.style.cssText = "width:100%;height:auto;object-fit:contain;display:block;";
    old.dataset.rendisPinsFixed = "1";
  }

  function showDjamoConfirmation(total) {
    document.getElementById("rendisDjamoConfirm")?.remove();
    const modal = document.createElement("div");
    modal.id = "rendisDjamoConfirm";
    modal.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.58);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;";
    modal.innerHTML = `
      <div style="width:min(420px,100%);background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.3);font-family:inherit;color:#12213a;text-align:center;">
        <div style="font-size:13px;letter-spacing:.08em;font-weight:700;opacity:.7;margin-bottom:8px;">PAIEMENT DJAMO BUSINESS</div>
        <div style="font-size:17px;margin-bottom:6px;">Montant total de votre commande</div>
        <div style="font-size:30px;font-weight:800;margin:8px 0 20px;">${money(total)}</div>
        <div style="font-size:13px;line-height:1.5;opacity:.75;margin-bottom:18px;">Vérifiez le montant avant de continuer vers le paiement Djamo.</div>
        <div style="display:flex;gap:10px;justify-content:center;">
          <button id="rendisDjamoCancel" type="button" style="flex:1;padding:12px 14px;border:1px solid #ddd;border-radius:12px;background:#f5f5f5;font-weight:700;">Annuler</button>
          <button id="rendisDjamoContinue" type="button" style="flex:1;padding:12px 14px;border:0;border-radius:12px;background:#087f6d;color:#fff;font-weight:700;">Continuer vers Djamo</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#rendisDjamoCancel").onclick = () => modal.remove();
    modal.querySelector("#rendisDjamoContinue").onclick = () => {
      const url = String(window.RENDIS_CONFIG?.DJAMO_BUSINESS_PAYMENT_LINK || "").trim();
      modal.remove();
      if (/^https?:\/\//i.test(url)) window.open(url, "_blank", "noopener,noreferrer");
      else alert("Le lien Djamo Business n'est pas configuré.");
    };
  }

  function fixDjamo() {
    const original = window.redirectDjamo;
    if (typeof original !== "function" || original.__rendisFixed) return;
    function wrappedDjamo() {
      const total = getTotal();
      if (total > 0) {
        showDjamoConfirmation(total);
        return true;
      }
      return original();
    }
    wrappedDjamo.__rendisFixed = true;
    window.redirectDjamo = wrappedDjamo;
  }

  function addFamilyGallery() {
    const media = document.getElementById("media");
    if (!media || document.getElementById("rendisFamilyGallery")) return;
    const section = document.createElement("section");
    section.id = "rendisFamilyGallery";
    section.className = "container";
    section.style.cssText = "margin-top:40px;padding-bottom:40px;";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">VIE DE L'ÉGLISE</p>
        <h2>Notre communauté en images</h2>
        <p>Quelques moments de vie, de partage et de communion de la communauté de Grand-Bassam.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
        ${[
          ["01-communaute-rendis.jpg","Communauté de Grand-Bassam réunie"],
          ["127996.jpg","Moment de vie de la communauté"],
          ["127997.jpg","Communauté réunie devant le bâtiment"],
          ["127993.jpg","Communauté de Grand-Bassam"],
          ["127992.jpg","Moment de communion de la communauté"],
          
        ].map(([file, alt]) => `
          <figure style="margin:0;">
            <img src="images/${file}" alt="${alt}" loading="lazy" style="width:100%;height:240px;object-fit:cover;border-radius:16px;display:block;">
          </figure>`).join("")}
      </div>`;
    media.appendChild(section);
  }

  function addFacebookVideos() {
    const media = document.getElementById("media");
    if (!media || document.getElementById("rendisFacebookVideos")) return;

    const links = [
      "https://www.facebook.com/share/v/1FN5yy7yB7/",
      "https://www.facebook.com/share/v/1Jra6Notjq/",
      "https://www.facebook.com/share/v/1CitgeW9vY/",
      "https://www.facebook.com/share/v/1Db9Uk3He5/",
      "https://www.facebook.com/share/v/1Juv3TQ5jR/",
      "https://www.facebook.com/share/v/1DcYRqUAtF/",
      "https://www.facebook.com/share/v/19USZVtYZj/"
    ];

    const section = document.createElement("section");
    section.id = "rendisFacebookVideos";
    section.className = "container";
    section.style.cssText = "margin-top:20px;padding-bottom:50px;";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">VIDÉOS FACEBOOK</p>
        <h2>Nos vidéos de la communauté</h2>
        <p>Retrouvez les vidéos officielles partagées sur Facebook.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
        ${links.map((url, i) => `
          <a href="${url}" target="_blank" rel="noopener noreferrer"
             style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-radius:16px;text-decoration:none;background:#f4f7f6;color:#12213a;font-weight:700;border:1px solid rgba(0,0,0,.08);">
            <span>▶ Vidéo Facebook ${i + 1}</span><span aria-hidden="true">↗</span>
          </a>`).join("")}
      </div>`;
    media.appendChild(section);
  }

  function addLocalVideo() {
    const media = document.getElementById("media");
    if (!media || document.getElementById("rendisLocalVideo")) return;
    const section = document.createElement("section");
    section.id = "rendisLocalVideo";
    section.className = "container";
    section.style.cssText = "margin-top:20px;padding-bottom:30px;";
    section.innerHTML = `
      <div class="section-heading">
        <p class="eyebrow">VIDÉO RENDIS 2027</p>
        <h2>Ensemble, on avance</h2>
      </div>
      <video controls preload="metadata" style="width:100%;max-width:900px;border-radius:16px;display:block;">
        <source src="RENDIS_2027_Ensemble_On_Avance.mp4" type="video/mp4">
      </video>`;
    media.appendChild(section);
  }

  function apply() {
    fixPinPhoto();
    fixDjamo();
    addFamilyGallery();
    addFacebookVideos();
    addLocalVideo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
  window.addEventListener("load", apply, { once: true });
})();
