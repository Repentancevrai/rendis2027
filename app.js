const cfg = window.RENDIS_CONFIG || {};
let supabaseClient = null;

const contributionForm = document.getElementById("contributionForm");
const contributionMessage = document.getElementById("formMessage");
const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");
const orderTotal = document.getElementById("orderTotal");
const ambassadorForm = document.getElementById("ambassadorForm");
const ambassadorMessage = document.getElementById("ambassadorMessage");
const aidForm = document.getElementById("aidForm");
const aidMessage = document.getElementById("aidMessage");

if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
    !String(cfg.SUPABASE_URL).startsWith("PASTE_") &&
    !String(cfg.SUPABASE_ANON_KEY).startsWith("PASTE_")) {
  supabaseClient = window.supabase.createClient(
    cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY
  );
  console.log("Supabase connecté.");
} else {
  console.warn("Supabase non configuré.");
}

function money(n) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(Number(n) || 0)) + " FCFA";
}

function clean(value) {
  return String(value || "").trim();
}

function paymentUrl(method) {
  if (method === "DJAMO_BUSINESS") return clean(cfg.DJAMO_BUSINESS_PAYMENT_LINK);
  if (method === "NOWPAYMENTS") {
    return clean(cfg.NOWPAYMENTS_PAYMENT_LINK || cfg.NOWPAYMENTS_PAYMENT_URL || cfg.NOWPAYMENTS_URL);
  }
  return "";
}

function isRealPaymentUrl(url) {
  return /^https?:\/\//i.test(url) && !url.includes("PASTE_");
}

function setMessage(element, text) {
  if (element) element.textContent = text;
}

function redirectToPayment(method) {
  const url = paymentUrl(method);
  if (!isRealPaymentUrl(url)) return false;
  window.location.href = url;
  return true;
}

// ==================== STATISTIQUES ====================

async function loadStats() {
  if (!supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from("contributions")
      .select("amount,status");

    if (error) throw error;

    let validated = 0;
    let pending = 0;
    let total = 0;

    for (const row of data || []) {
      const amount = Number(row.amount) || 0;
      const status = clean(row.status).toUpperCase();

      if (status === "A_VERIFIER" || status === "A_VERIFER") pending++;

      if (["VALIDE","VALIDEE","VERIFIED","VERIFIEE"].includes(status)) {
        validated++;
        total += amount;
      }
    }

    const validatedCount = document.getElementById("validatedCount");
    const pendingCount = document.getElementById("pendingCount");
    const amountRaised = document.getElementById("amountRaised");
    const progressBar = document.getElementById("progressBar");

    if (validatedCount) validatedCount.textContent = validated;
    if (pendingCount) pendingCount.textContent = pending;
    if (amountRaised) amountRaised.textContent = money(total);

    if (progressBar) {
      const goal = Number(cfg.GOAL_FCFA) || 60000000;
      progressBar.style.width = Math.min(100, (total / goal) * 100) + "%";
    }
  } catch (error) {
    console.error("Erreur statistiques Supabase :", error);
  }
}

// ==================== PRÉCOMMANDES ====================

const ORDER_PRICES = {
  basiqueQty: 10000,
  economiqueQty: 15000,
  premiumQty: 25000,
  pagnePieceQty: 7000,
  pagneCompletQty: 21000
};

const ORDER_LABELS = {
  basiqueQty: "Pin Basique",
  economiqueQty: "Pin Économique",
  premiumQty: "Pin Premium",
  pagnePieceQty: "Pagne 1 morceau",
  pagneCompletQty: "Pagne complet 3 morceaux"
};

function getOrderData() {
  if (!orderForm) return { total: 0, items: [] };

  const fd = new FormData(orderForm);
  const items = [];
  let total = 0;

  for (const [field, price] of Object.entries(ORDER_PRICES)) {
    const quantity = Math.max(0, Number(fd.get(field)) || 0);
    if (quantity > 0) {
      total += quantity * price;
      items.push(`${ORDER_LABELS[field]} x${quantity}`);
    }
  }

  return { total, items };
}

function updateOrderTotal() {
  const { total } = getOrderData();
  if (orderTotal) orderTotal.textContent = money(total);
}

if (orderForm) {
  orderForm.addEventListener("input", updateOrderTotal);
  orderForm.addEventListener("change", updateOrderTotal);

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage(orderMessage, "");

    const fd = new FormData(orderForm);
    const name = clean(fd.get("name"));
    const phone = clean(fd.get("phone"));
    const city = clean(fd.get("city"));
    const paymentMethod = clean(fd.get("paymentMethod"));
    const reference = clean(fd.get("reference")) || null;
    const comment = clean(fd.get("message"));
    const { total, items } = getOrderData();

    if (!name || !phone || total <= 0 || !items.length) {
      setMessage(orderMessage, "Veuillez remplir votre nom, votre téléphone et choisir au moins un article.");
      return;
    }

    if (!paymentMethod) {
      setMessage(orderMessage, "Veuillez choisir votre moyen de paiement : NOWPayments ou Djamo Business.");
      return;
    }

    if (!supabaseClient) {
      setMessage(orderMessage, "La connexion Supabase doit encore être configurée.");
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
      reference,
      message: details,
      status: "A_VERIFIER"
    };

    try {
      setMessage(orderMessage, "Précommande en cours d'enregistrement...");

      const { error } = await supabaseClient
        .from("contributions")
        .insert(payload);

      if (error) throw error;

      loadStats();

      if (redirectToPayment(paymentMethod)) return;

      if (paymentMethod === "NOWPAYMENTS") {
        setMessage(orderMessage,
          "Précommande enregistrée. Le lien NOWPayments n'est pas encore configuré ; votre demande est conservée pour vérification."
        );
      } else {
        setMessage(orderMessage,
          "Précommande enregistrée. Le lien de paiement sélectionné n'est pas encore configuré."
        );
      }
    } catch (error) {
      console.error("Erreur précommande :", error);

      const code = clean(error?.code);
      const message = clean(error?.message);
      const details = clean(error?.details);
      const hint = clean(error?.hint);

      const diagnostic = [
        "Erreur Supabase détectée.",
        code ? `Code: ${code}` : "",
        message ? `Message: ${message}` : "",
        details ? `Détails: ${details}` : "",
        hint ? `Conseil: ${hint}` : ""
      ].filter(Boolean).join(" | ");

      setMessage(orderMessage, diagnostic || "Erreur inconnue lors de l'enregistrement.");
    }
  });

  updateOrderTotal();
}

// ==================== BOUTONS DE PAIEMENT ====================

document.querySelectorAll(".payment-link").forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.payment || "";

    if (redirectToPayment(method)) return;

    if (method === "DJAMO_BUSINESS") {
      alert("Le lien Djamo Business n'est pas encore configuré.");
    } else if (method === "NOWPAYMENTS") {
      alert("Le lien NOWPayments n'est pas encore configuré.");
    } else {
      alert("Moyen de paiement non configuré.");
    }
  });
});

// ==================== CONTRIBUTION FINANCIÈRE ====================

if (contributionForm) {
  contributionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage(contributionMessage, "");

    const fd = new FormData(contributionForm);
    const city = clean(fd.get("city"));
    const method = clean(fd.get("paymentMethod"));
    const comment = clean(fd.get("message"));

    const payload = {
      name: clean(fd.get("name")),
      phone: clean(fd.get("phone")),
      amount: Number(fd.get("amount")) || 0,
      reference: clean(fd.get("reference")) || null,
      message: [
        "[CONTRIBUTION]",
        city ? `Ville: ${city}` : "",
        method ? `Moyen: ${method}` : "",
        comment ? `Commentaire: ${comment}` : ""
      ].filter(Boolean).join(" | "),
      status: "A_VERIFIER"
    };

    if (!payload.name || !payload.phone || payload.amount <= 0) {
      setMessage(contributionMessage, "Veuillez remplir correctement les champs obligatoires.");
      return;
    }

    if (!supabaseClient) {
      setMessage(contributionMessage, "La connexion Supabase doit encore être configurée.");
      return;
    }

    try {
      setMessage(contributionMessage, "Enregistrement en cours...");

      const { error } = await supabaseClient
        .from("contributions")
        .insert(payload);

      if (error) throw error;

      contributionForm.reset();
      setMessage(contributionMessage,
        "Merci ! Votre contribution a été enregistrée et sera vérifiée par l'équipe."
      );
      loadStats();
    } catch (error) {
      console.error("Erreur contribution :", error);

      const code = clean(error?.code);
      const message = clean(error?.message);
      const details = clean(error?.details);
      const hint = clean(error?.hint);

      const diagnostic = [
        "Erreur Supabase détectée.",
        code ? `Code: ${code}` : "",
        message ? `Message: ${message}` : "",
        details ? `Détails: ${details}` : "",
        hint ? `Conseil: ${hint}` : ""
      ].filter(Boolean).join(" | ");

      setMessage(contributionMessage, diagnostic || "Erreur inconnue lors de l'enregistrement.");
    }
  });
}

// ==================== AMBASSADEURS ====================

if (ambassadorForm) {
  ambassadorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage(ambassadorMessage, "");

    const fd = new FormData(ambassadorForm);
    const payload = {
      name: clean(fd.get("name")),
      phone: clean(fd.get("phone")),
      amount: 0,
      reference: null,
      message: [
        "[AMBASSADEUR]",
        clean(fd.get("city")) ? `Ville / pays: ${clean(fd.get("city"))}` : "",
        clean(fd.get("message"))
      ].filter(Boolean).join(" | "),
      status: "A_VERIFIER"
    };

    if (!payload.name || !payload.phone) {
      setMessage(ambassadorMessage, "Veuillez remplir votre nom et votre téléphone.");
      return;
    }

    if (!supabaseClient) {
      setMessage(ambassadorMessage, "La connexion Supabase doit encore être configurée.");
      return;
    }

    try {
      setMessage(ambassadorMessage, "Enregistrement en cours...");

      const { error } = await supabaseClient
        .from("contributions")
        .insert(payload);

      if (error) throw error;

      ambassadorForm.reset();
      setMessage(ambassadorMessage,
        "Merci ! Votre demande d'ambassadeur a été enregistrée."
      );
    } catch (error) {
      console.error("Erreur ambassadeur :", error);
      setMessage(ambassadorMessage,
        "Impossible d'enregistrer votre demande pour le moment."
      );
    }
  });
}

// ==================== AUTRES AIDES ====================

if (aidForm) {
  aidForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMessage(aidMessage, "");

    const fd = new FormData(aidForm);
    const aidType = clean(fd.get("aidType"));
    const description = clean(fd.get("message"));

    const payload = {
      name: clean(fd.get("name")),
      phone: clean(fd.get("phone")),
      amount: 0,
      reference: null,
      message: [
        "[AIDE_NON_FINANCIERE]",
        aidType ? `Type: ${aidType}` : "",
        description
      ].filter(Boolean).join(" | "),
      status: "A_VERIFIER"
    };

    if (!payload.name || !payload.phone || !aidType || !description) {
      setMessage(aidMessage, "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!supabaseClient) {
      setMessage(aidMessage, "La connexion Supabase doit encore être configurée.");
      return;
    }

    try {
      setMessage(aidMessage, "Enregistrement en cours...");

      const { error } = await supabaseClient
        .from("contributions")
        .insert(payload);

      if (error) throw error;

      aidForm.reset();
      setMessage(aidMessage,
        "Merci ! Votre proposition d'aide a été enregistrée."
      );
    } catch (error) {
      console.error("Erreur aide :", error);
      setMessage(aidMessage,
        "Impossible d'enregistrer votre proposition pour le moment."
      );
    }
  });
}

// ==================== DÉMARRAGE ====================

loadStats();
