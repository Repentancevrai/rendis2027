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
      tshirtEnfantQty: 2000,
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
  if (!media || document.getElementById("rendisLocalVideos")) return;

  const section = document.createElement("section");
  section.id = "rendisLocalVideos";
  section.className = "container";
  section.style.cssText = "margin-top:20px;padding-bottom:40px;";

  section.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">TÉMOIGNAGES RENDIS 2027</p>
      <h2>Les témoignages de notre communauté</h2>
      <p>Des témoignages de frères de la communauté vivant à l'étranger.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">

      <article style="background:#fff;border-radius:18px;padding:14px;box-shadow:0 8px 25px rgba(0,0,0,.08);">
        <h3>Frère Blaise Pascal — 🇨🇦 Canada</h3>
        <video controls preload="metadata" style="width:100%;border-radius:14px;display:block;">
          <source src="images/frere-blaise-pascal.mp4" type="video/mp4">
        </video>
      </article>

      <article style="background:#fff;border-radius:18px;padding:14px;box-shadow:0 8px 25px rgba(0,0,0,.08);">
        <h3>Papa GNOTO — 🇺🇸 États-Unis</h3>
        <video controls preload="metadata" style="width:100%;border-radius:14px;display:block;">
          <source src="images/papa-gnoto-usa.mp4" type="video/mp4">
        </video>
      </article>

    </div>
  `;

  media.appendChild(section);
}  function apply() {
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
})();/* =========================================================
   RENDIS 2027 — MISSION 3 + MISSION 4
   Bloc commentaires + bannière informations imminentes
   ========================================================= */
(function () {

  /* =========================
     MISSION 3 — COMMENTAIRES
     ========================= */
  function addRendisComments() {
    const anchor = document.getElementById("precommandes");
    if (!anchor || document.getElementById("rendisComments")) return;

    const section = document.createElement("section");
    section.id = "rendisComments";
    section.className = "section section-soft";

    section.innerHTML = `
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">💬 ESPACE COMMUNAUTÉ</p>
          <h2>Vos commentaires</h2>
          <p>Partagez votre message, votre encouragement ou votre avis sur RENDIS 2027.</p>
        </div>

        <div style="max-width:760px;margin:0 auto;">

          <form id="rendisCommentForm"
                style="background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:18px;padding:20px;box-shadow:0 8px 25px rgba(0,0,0,.07);">

            <label style="display:block;margin-bottom:14px;font-weight:600;">
              Votre nom
              <input
                id="rendisCommentName"
                type="text"
                maxlength="80"
                required
                placeholder="Ex. Jean Kouassi"
                style="display:block;width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border:1px solid #d9dfdc;border-radius:10px;font:inherit;"
              >
            </label>

            <label style="display:block;margin-bottom:14px;font-weight:600;">
              Votre commentaire
              <textarea
                id="rendisCommentText"
                maxlength="500"
                rows="4"
                required
                placeholder="Écrivez votre commentaire..."
                style="display:block;width:100%;box-sizing:border-box;margin-top:7px;padding:12px;border:1px solid #d9dfdc;border-radius:10px;font:inherit;resize:vertical;"
              ></textarea>
            </label>

            <button class="btn" type="submit">
              Publier mon commentaire
            </button>

            <p
              id="rendisCommentStatus"
              class="form-message"
              role="status"
              style="margin-bottom:0;"
            ></p>
          </form>

          <div
            id="rendisCommentList"
            style="display:grid;gap:12px;margin-top:20px;"
          ></div>

        </div>
      </div>
    `;

    anchor.insertAdjacentElement("afterend", section);

    const storageKey = "rendis2027_comments_v1";
    const form = document.getElementById("rendisCommentForm");
    const list = document.getElementById("rendisCommentList");
    const status = document.getElementById("rendisCommentStatus");

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"
        }[char];
      });
    }

    function getComments() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch (error) {
        return [];
      }
    }

    function saveComments(comments) {
      localStorage.setItem(
        storageKey,
        JSON.stringify(comments.slice(0, 30))
      );
    }

    function renderComments() {
      const comments = getComments();

      if (!comments.length) {
        list.innerHTML = `
          <div style="background:#fff;border:1px dashed rgba(0,0,0,.15);border-radius:14px;padding:18px;text-align:center;opacity:.72;">
            Soyez le premier à laisser un commentaire.
          </div>
        `;
        return;
      }

      list.innerHTML = comments.map(function (item) {
        return `
          <article
            style="background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:15px 17px;box-shadow:0 5px 18px rgba(0,0,0,.05);"
          >
            <strong style="font-size:1rem;">
              ${escapeHtml(item.name)}
            </strong>

            <p style="margin:8px 0 0;white-space:pre-wrap;line-height:1.55;">
              ${escapeHtml(item.text)}
            </p>

            <small style="display:block;margin-top:9px;opacity:.55;">
              ${new Date(item.date).toLocaleDateString("fr-FR")}
            </small>
          </article>
        `;
      }).join("");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document
        .getElementById("rendisCommentName")
        .value
        .trim();

      const text = document
        .getElementById("rendisCommentText")
        .value
        .trim();

      if (!name || !text) return;

      const comments = getComments();

      comments.unshift({
        name: name,
        text: text,
        date: new Date().toISOString()
      });

      saveComments(comments);

      form.reset();

      status.textContent =
        "Votre commentaire a été ajouté. ✓";

      renderComments();
    });

    renderComments();
  }


  /* ==================================
     MISSION 4 — BANNIÈRE INFORMATIONS
     ================================== */
  function addRendisUrgentBanner() {
    if (document.getElementById("rendisUrgentBanner")) return;

    const main = document.querySelector("main");
    if (!main) return;

    const banner = document.createElement("section");
    banner.id = "rendisUrgentBanner";
    banner.setAttribute(
      "aria-label",
      "Informations imminentes RENDIS 2027"
    );

    banner.innerHTML = `
      <div style="max-width:1180px;margin:0 auto;padding:0 16px;">
        <div class="rendis-urgent-box">

          <div class="rendis-urgent-icon" aria-hidden="true">
            📢
          </div>

          <div style="flex:1;">
            <strong class="rendis-urgent-title">
              INFORMATIONS IMMINENTES
            </strong>

            <div class="rendis-urgent-events">

              <div class="rendis-urgent-event">
                <span class="rendis-urgent-pulse"></span>
                <span>
                  <b>04 OCTOBRE 2026</b> —
                  CULTE D'ENSEMBLE DU GRAND SUD
                </span>
              </div>

              <div class="rendis-urgent-event">
                <span class="rendis-urgent-pulse"></span>
                <span>
                  <b>06 DÉCEMBRE 2026</b> —
                  CULTE D'OFFRANDES DE RECONNAISSANCE
                  • OBJECTIF :
                  <b>3 000 000 FCFA</b>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    `;

    main.insertBefore(banner, main.firstElementChild);

    const style = document.createElement("style");

    style.textContent = `
      #rendisUrgentBanner {
        margin: 10px 0 18px;
      }

      .rendis-urgent-box {
        display:flex;
        align-items:center;
        gap:13px;
        padding:14px 16px;
        border-radius:16px;
        background:#fff7df;
        border:2px solid #d99a00;
        box-shadow:0 8px 24px rgba(0,0,0,.08);
        color:#3c2b00;
      }

      .rendis-urgent-icon {
        font-size:25px;
        flex:none;
      }

      .rendis-urgent-title {
        display:block;
        font-size:.78rem;
        letter-spacing:.08em;
        margin-bottom:6px;
      }

      .rendis-urgent-events {
        display:grid;
        gap:7px;
        font-size:.9rem;
        line-height:1.45;
      }

      .rendis-urgent-event {
        display:flex;
        align-items:flex-start;
        gap:8px;
      }

      .rendis-urgent-pulse {
        width:9px;
        height:9px;
        min-width:9px;
        margin-top:6px;
        border-radius:50%;
        background:#d21f3c;
        animation:rendisUrgentPulse 1.1s ease-in-out infinite;
      }

      @keyframes rendisUrgentPulse {
        0%,100% {
          opacity:1;
          transform:scale(1);
        }

        50% {
          opacity:.3;
          transform:scale(.7);
        }
      }

      @media(max-width:700px) {
        .rendis-urgent-box {
          align-items:flex-start;
          padding:12px;
        }

        .rendis-urgent-events {
          font-size:.82rem;
        }

        .rendis-urgent-icon {
          font-size:21px;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        .rendis-urgent-pulse {
          animation:none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ==========================
     LANCEMENT DES DEUX BLOCS
     ========================== */
  function applyRendisMission3And4() {
    // addRendisComments();
    addRendisUrgentBanner();
  }
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      applyRendisMission3And4,
      { once:true }
    );
  } else {
    applyRendisMission3And4();
  }
  window.addEventListener(
    "load",
    applyRendisMission3And4,
    { once:true }
  );

})();
