const cfg = window.RENDIS_CONFIG || {};
let supabaseClient = null;
if (
  window.supabase &&
  cfg.SUPABASE_URL &&
  cfg.SUPABASE_ANON_KEY &&
  !String(cfg.SUPABASE_URL).startsWith("PASTE_") &&
  !String(cfg.SUPABASE_ANON_KEY).startsWith("PASTE_")
) {
  supabaseClient = window.supabase.createClient(
    cfg.SUPABASE_URL,
    cfg.SUPABASE_ANON_KEY
  );
}

function money(n) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(Number(n) || 0)) + " FCFA";
}

function clean(value) {
  return String(value || "").trim();
}const ORANGE_MONEY = clean(cfg.ORANGE_MONEY_NUMBER);
const WAVE = clean(cfg.WAVE_NUMBER);

const ORDER_PRICES = {
  economiqueQty: 10000,
  premiumQty: 20000,
  pagnePieceQty: 6000,
  tshirtQty: 4000,
  tshirtEnfantQty: 2000,
  poloQty: 5000,
  sacQty: 4000
};

const ORDER_LABELS = {
  economiqueQty: "Pin Économique",
  premiumQty: "Pin Premium",
  pagnePieceQty: "Pagne officiel — 1 morceau",
  tshirtQty: "T-shirt RENDIS 2027 — Adulte",
  tshirtEnfantQty: "T-shirt RENDIS 2027 — Enfant",
  poloQty: "Polo RENDIS 2027",
  sacQty: "Sac RENDIS 2027"
};
function setText(selector, text) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = text;
  });
}

function getOrderData(orderForm) {
  if (!orderForm) return { total: 0, items: [] };

  const fd = new FormData(orderForm);
  const items = [];
  let total = 0;

  Object.entries(ORDER_PRICES).forEach(([field, price]) => {
    const quantity = Math.max(0, Number(fd.get(field)) || 0);
    if (quantity > 0) {
      total += quantity * price;
      items.push(`${ORDER_LABELS[field]} x${quantity}`);
    }
  });
  
  return { total, items };
}

function updateOrderTotal(orderForm) {
  const totalEl = document.getElementById("orderTotal");
  if (!totalEl) return;
  totalEl.textContent = money(getOrderData(orderForm).total);
}

function paymentInstruction(method, total) {
  if (method === "ORANGE_MONEY") {
    return `Envoyez ${money(total)} par Orange Money au ${ORANGE_MONEY}, puis conservez la référence du transfert.`;
  }
  if (method === "WAVE") {
    return `Envoyez ${money(total)} par Wave au ${WAVE}, puis conservez la référence du transfert.`;
  }
if (method === "DJAMO_BUSINESS") {
  return `Sur la page Djamo, saisissez le montant affiché par RENDIS (${money(total)}), puis ajoutez les frais affichés par Djamo. Après le paiement, envoyez votre capture d'écran sur WhatsApp avec votre nom complet, l'article commandé, la couleur, la taille et votre numéro de téléphone.`;
}
  return "";
}

function redirectDjamo() {
  const url = clean(cfg.DJAMO_BUSINESS_PAYMENT_LINK);
  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }
  return false;
}

function prepareProductImages() {
  const shop = document.querySelector("#precommandes .shop-grid");
  if (!shop) return;

  const cards = shop.querySelectorAll(".product-card");
  if (cards.length >= 1) {
    const pinImage = cards[0].querySelector("img");
    if (pinImage) {
      pinImage.src = "images/pins-rendis-2027-nouveau.png";
      pinImage.alt = "Les deux modèles officiels de pins RENDIS 2027 : Économique et Premium";
    }
  }

  if (cards.length >= 2) {
    const pagneCard = cards[1];
    
const oldImages = pagneCard.querySelectorAll("img");if (oldImages.length) {
  oldImages[0].src = "images/pagne-rendis-officiel.jpg";
  oldImages[0].alt = "Pagne officiel RENDIS 2027 — modèle 1";

  if (oldImages[1]) {
    oldImages[1].src = "images/pagne-rendis-officiel-2.jpg";
    oldImages[1].alt = "Pagne officiel RENDIS 2027 — modèle 2";
  } else {
    const secondImg = document.createElement("img");
    secondImg.src = "images/pagne-rendis-officiel-2.jpg";
    secondImg.alt = "Pagne officiel RENDIS 2027 — modèle 2";
    secondImg.loading = "lazy";
    oldImages[0].insertAdjacentElement("afterend", secondImg);
  }
} else {
  const body = pagneCard.querySelector(".product-body") || pagneCard;

  const img1 = document.createElement("img");
  img1.src = "images/pagne-rendis-officiel.jpg";
  img1.alt = "Pagne officiel RENDIS 2027 — modèle 1";
  img1.loading = "lazy";

  const img2 = document.createElement("img");
  img2.src = "images/pagne-rendis-officiel-2.jpg";
  img2.alt = "Pagne officiel RENDIS 2027 — modèle 2";
  img2.loading = "lazy";

  pagneCard.insertBefore(img1, body);
  pagneCard.insertBefore(img2, body);
}
    pagneCard.querySelectorAll("strong").forEach((el) => {
      if (/7\s*000|21\s*000/.test(el.textContent)) el.textContent = "6 000 FCFA";
    });
  }

  // Le prix affiché du pagne doit être 6 000 FCFA partout dans la boutique.
  document.querySelectorAll("#precommandes *").forEach((el) => {
    if (el.children.length === 0 && /Pagne/.test(el.textContent)) {
      el.textContent = el.textContent
        .replace(/7\s*000\s*FCFA/g, "6 000 FCFA")
        .replace(/21\s*000\s*FCFA/g, "6 000 FCFA");
    }
  });
}

function prepareOrderForm() {
  const orderForm = document.getElementById("orderForm");
  if (!orderForm) return null;

  // Pagne : 6 000 FCFA.
  const pagneInput = orderForm.elements.pagnePieceQty;
  if (pagneInput) {
    const label = pagneInput.closest("label");
    if (label) {
      const text = Array.from(label.childNodes)
        .find((node) => node.nodeType === Node.TEXT_NODE);
      if (text) text.textContent = "Pagne — 1 morceau (6 000 FCFA)";
    }
  }

  // Moyen de paiement : un seul champ avec Djamo Business et les 2 liens WhatsApp.
const fieldset = orderForm.querySelector(".payment-methods");
if (fieldset) {
  fieldset.innerHTML = `
    <legend>Choisissez votre moyen de paiement</legend>

    <label class="radio-card">
      <input type="radio" name="paymentMethod" value="DJAMO_BUSINESS" required>
      <span>
        <b>Djamo Business</b>
        <small>Paiement via le lien professionnel officiel de RENDIS 2027.</small>
      </span>
    </label>

    <div style="margin-top:12px;">
      <p style="margin:0 0 8px;">
        Pour TapTap Send, Western Union, MoneyGram, Wave ou Orange Money,
        utilisez l’un des deux liens WhatsApp :
      </p>

      <a
        class="btn btn-ghost"
        href="https://wa.me/22541089295?text=Bonjour%2C%20S%27il%20vous%20je%20veux%20faire%20mon%20don%20RENDIS%202027%20BASSAM%20via%20TapTap%20Send%20%2C%20western.%20Union%2C%20MoneyGram%20ou%20Djamo%20Business%20%20%2C%20Wave%20%26%20orange%20Money."
        target="_blank"
        rel="noopener noreferrer"
      >WhatsApp RENDIS — lien 1</a>

      <a
        class="btn btn-ghost"
        href="https://wa.me/2250748961624?text=Bonjour%2C%20S%27il%20vous%20je%20veux%20faire%20mon%20don%20RENDIS%202027%20BASSAM%20via%20TapTap%20Send%20%2C%20western.%20Union%2C%20MoneyGram%20ou%20Djamo%20Business%20%20%2C%20Wave%20%26%20orange%20Money."
        target="_blank"
        rel="noopener noreferrer"
      >WhatsApp RENDIS — lien 2</a>
    </div>
  `;
}

  orderForm.addEventListener("input", (event) => {
  if (event.target?.matches('input[name$="Qty"]')) {
    updateOrderTotal(orderForm);
  }
});

orderForm.addEventListener("change", (event) => {
  if (event.target?.matches('input[name$="Qty"]')) {
    updateOrderTotal(orderForm);
  }
});

  orderForm.addEventListener("change", (event) => {
    if (event.target?.name === "paymentMethod") {
      const method = event.target.value;
      const note = document.getElementById("paymentInstruction");
      if (note) note.textContent = paymentInstruction(method, getOrderData(orderForm).total);
    }
  });

  const submit = orderForm.querySelector('button[type="submit"]');
  if (submit) submit.textContent = "Enregistrer ma commande";

  let instruction = document.getElementById("paymentInstruction");
  if (!instruction) {
    instruction = document.createElement("p");
    instruction.id = "paymentInstruction";
    instruction.className = "form-message";
    instruction.setAttribute("role", "status");
    const fieldsetEnd = fieldset || orderForm.querySelector(".order-total");
    if (fieldsetEnd) fieldsetEnd.insertAdjacentElement("afterend", instruction);
  }

  orderForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("orderMessage");
    if (message) message.textContent = "";

    const fd = new FormData(orderForm);
    const name = clean(fd.get("name"));
    const phone = clean(fd.get("phone"));
    const city = clean(fd.get("city"));
    const paymentMethod = clean(fd.get("paymentMethod"));
    const comment = clean(fd.get("message"));
    const { total, items } = getOrderData(orderForm);

    if (!name || !phone || total <= 0 || !items.length) {
      if (message) message.textContent = "Veuillez remplir votre nom, votre téléphone et choisir au moins un article.";
      return;
    }

    if (!paymentMethod) {
      if (message) message.textContent = "Veuillez choisir Djamo Business.";
      return;
    }

    if (!supabaseClient) {
      if (message) message.textContent = "La connexion Supabase doit encore être configurée.";
      return;
    }

    const details = [
      "[PRECOMMANDE]",
      `Articles: ${items.join(", ")}`,
      `Moyen de paiement: ${paymentMethod}`,
      city ? `Ville / secteur: ${city}` : "",
      comment ? `Commentaire: ${comment}` : ""
    ].filter(Boolean).join(" | ");

    const payload = {
      name,
      phone,
      amount: total,
      message: details,
      status: "A_VERIFIER"
    };

    const submitButton = orderForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enregistrement…";
    }

    try {
      if (message) message.textContent = "Commande en cours d'enregistrement…";

      const { error } = await supabaseClient
        .from("contributions")
        .insert(payload);

      if (error) throw error;

      if (paymentMethod === "DJAMO_BUSINESS") {
        redirectDjamo();
        if (message) message.textContent = "Commande enregistrée ✓ Ouverture de Djamo Business…";
      } else {
        if (message) {
          message.textContent =
            `Commande enregistrée ✓ ${paymentInstruction(paymentMethod, total)} Référence du transfert à conserver pour la vérification.`;
        }
      }

      orderForm.reset();
      updateOrderTotal(orderForm);
    } catch (error) {
      console.error("Erreur précommande :", error);
      if (message) {
        message.textContent = "Impossible d'enregistrer la commande pour le moment. Vérifiez la connexion Supabase.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Enregistrer ma commande";
      }
    }
  });

  updateOrderTotal(orderForm);
  return orderForm;
}

function replacePaymentSection() {
  const section = document.getElementById("paiements");
  if (section) {
    section.innerHTML = "";
  }
}

function removeCollectionAndDonationSections() {
["contribuer", "mobilisation", "aides", "impact", "projet"].forEach((id) => {
    document.getElementById(id)?.remove();
  });

  document.querySelectorAll("a[href='#contribuer'], a[href='#mobilisation'], a[href='#aides'], a[href='#impact']")
    .forEach((link) => link.remove());

  // Supprimer les formulaires de collecte s'ils existent encore ailleurs.
  document.querySelectorAll("#contributionForm, #ambassadorForm, #aidForm")
    .forEach((form) => form.closest("section")?.remove());

  // La vidéo existante est retirée de l'affichage, sans toucher aux chansons.
  document.querySelectorAll("video").forEach((video) => {
    video.closest("article, figure, .media-feature, .media-slot")?.remove() || video.remove();
  });
}

function prepareMedia() {
  const media = document.getElementById("media");
  if (!media) return;

  // On conserve la rubrique média, les photos existantes et les deux chansons du dépôt.
  media.innerHTML = `
    <div class="container">
      <div class="section-heading">
        <p class="eyebrow">ESPACE MÉDIA</p>
        <h2>RENDIS 2027 — MUSIQUE & VIE DE L'ÉGLISE</h2>
        <p>Les deux chansons officielles restent disponibles ici. La vidéo existante a été retirée.</p>
      </div>
      <div class="media-grid">
        <article class="media-slot music-slot">
          <span>♫</span>
          <h3>Rendis 2027 — « Ensemble, on avance »</h3>
          <audio controls preload="metadata">
            <source src="Rendis%202027%20%281%29.m4a" type="audio/mp4">
          </audio>
        </article>
        <article class="media-slot music-slot">
          <span>♫</span>
          <h3>« On est ensemble »</h3>
          <audio controls preload="metadata">
            <source src="ON%20EST%20ENSEMBLE%20(4).mp3" type="audio/mpeg">
          </audio>
        </article>
      </div>
    </div>
  `;
}

function orientSiteAsBoutique() {
  // Conserver la première photo/hero existante : aucune image de #accueil n'est supprimée.
  const heroImage = document.querySelector("#accueil img");
  if (heroImage) heroImage.style.display = "";

  // Remplacer le message de collecte par un positionnement boutique + Église.
  const lead = document.querySelector("#accueil .lead");
  if (lead) {
    lead.innerHTML =
      "RENDIS 2027 GRAND-BASSAM est la boutique officielle et l'espace d'information de l'Église du Christ. Retrouvez le pagne officiel, les pins et les gadgets de l'Église.";
  }

  document.querySelectorAll("#accueil .hero-actions a").forEach((link) => {
    if (link.getAttribute("href") === "#contribuer") {
      link.href = "#precommandes";
      link.textContent = "Voir la boutique";
    }
  });

  const heroCard = document.querySelector("#accueil .hero-card");
  if (heroCard) {
    heroCard.innerHTML = `
      <div class="star">✦</div>
      <p>BOUTIQUE OFFICIELLE</p>
      <strong>RENDIS 2027</strong>
      <div class="progress-label"><span>Pagne • Pins • Gadgets</span></div>
      <small>Commandes et précommandes officielles de l'Église du Christ de Grand-Bassam.</small>
    `;
  }

  // Prix affiché du pagne.
  document.querySelectorAll("#precommandes").forEach((section) => {
    section.querySelectorAll("strong, b, label, p, span").forEach((el) => {
      if (el.children.length === 0) {
        el.textContent = el.textContent
          .replace(/7\s*000\s*FCFA/g, "6 000 FCFA")
          .replace(/21\s*000\s*FCFA/g, "6 000 FCFA");
      }
    });
  });
}

function boot() {
  orientSiteAsBoutique();
  prepareProductImages();
  const orderForm = prepareOrderForm();
  replacePaymentSection();
  removeCollectionAndDonationSections();
  prepareMedia();

  // L'anniversaire de 20 ans reste volontairement intact.
  const anniversary = document.querySelector(".anniversary-banner");
  if (anniversary) anniversary.style.display = "";

  // Prix pagne dans le formulaire après toute transformation DOM.
  if (orderForm) updateOrderTotal(orderForm);
}

boot();
window.addEventListener("load", () => {
  if (typeof window.RENDIS_GADGETS_APPLY === "function") {
    window.RENDIS_GADGETS_APPLY();
  }
}, { once: true });
