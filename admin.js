const cfg = window.RENDIS_CONFIG || {};

const form = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const message = document.getElementById("adminMessage");

let supabaseClient = null;

// Vérification de la configuration Supabase
if (
  window.supabase &&
  cfg.SUPABASE_URL &&
  cfg.SUPABASE_ANON_KEY &&
  !cfg.SUPABASE_URL.startsWith("PASTE_") &&
  !cfg.SUPABASE_ANON_KEY.startsWith("PASTE_")
) {
  supabaseClient = window.supabase.createClient(
    cfg.SUPABASE_URL,
    cfg.SUPABASE_ANON_KEY
  );
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = "admin-message";

  if (type) {
    message.classList.add(type);
  }
}

// Connexion administrateur
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Veuillez remplir votre adresse e-mail et votre mot de passe.", "error");
    return;
  }

  if (!supabaseClient) {
    showMessage(
      "La connexion Supabase doit encore être configurée.",
      "error"
    );
    return;
  }

  showMessage("Connexion en cours...", "loading");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error(error);

    showMessage(
      "Impossible de se connecter. Vérifiez votre e-mail et votre mot de passe.",
      "error"
    );

    return;
  }

  if (data.user) {
    showMessage("Connexion réussie ! Bienvenue dans l'administration.", "success");

    // Pour l'instant, nous confirmons simplement la connexion.
    // La prochaine étape sera la création du tableau de bord administrateur.
    console.log("Administrateur connecté :", data.user.email);
  }
});
