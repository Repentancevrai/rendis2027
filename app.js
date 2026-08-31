const cfg = window.RENDIS_CONFIG || {};

const form = document.getElementById("contributionForm");
const message = document.getElementById("formMessage");

let supabaseClient = null;


// ==========================================
// CONNEXION SUPABASE
// ==========================================

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

  console.log("Supabase connecté.");

} else {

  console.warn("Supabase non configuré.");

}


// ==========================================
// FORMAT ARGENT
// ==========================================

function money(n) {

  return new Intl.NumberFormat("fr-FR").format(
    Math.round(n || 0)
  ) + " FCFA";

}


// ==========================================
// CHARGER LES STATISTIQUES
// ==========================================

async function loadStats() {

  if (!supabaseClient) {
    console.warn("Impossible de charger les statistiques.");
    return;
  }

  try {

    const { data, error } = await supabaseClient
      .from("contributions")
      .select("amount,status");

    if (error) throw error;


    let validated = 0;
    let pending = 0;
    let total = 0;


    for (const row of (data || [])) {

      const amount = Number(row.amount) || 0;

      const status = String(
        row.status || ""
      ).toUpperCase();


      // Contributions en attente

      if (
        status === "A_VERIFIER" ||
        status === "A_VERIFER"
      ) {

        pending += 1;

      }


      // Contributions validées

      if (
        status === "VALIDE" ||
        status === "VALIDEE" ||
        status === "VERIFIED" ||
        status === "VERIFIEE"
      ) {

        validated += 1;

        total += amount;

      }

    }


    // Mettre à jour les chiffres

    const validatedCount =
      document.getElementById("validatedCount");

    const pendingCount =
      document.getElementById("pendingCount");

    const amountCollected =
      document.getElementById("amountCollected");

    const progressBar =
      document.getElementById("progressBar");


    if (validatedCount) {

      validatedCount.textContent = validated;

    }


    if (pendingCount) {

      pendingCount.textContent = pending;

    }


    if (amountCollected) {

      amountCollected.textContent = money(total);

    }


    if (progressBar) {

      const goal =
        cfg.GOAL_FCFA || 60000000;

      const percentage =
        Math.min(
          100,
          (total / goal) * 100
        );

      progressBar.style.width =
        percentage + "%";

    }


  } catch (error) {

    console.error(
      "Erreur statistiques Supabase :",
      error
    );

  }

}


// ==========================================
// ENREGISTRER UNE CONTRIBUTION
// ==========================================

if (form) {

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      if (message) {

        message.textContent = "";

      }


      const fd =
        new FormData(form);


      const payload = {

        name:
          String(
            fd.get("name") || ""
          ).trim(),

        phone:
          String(
            fd.get("phone") || ""
          ).trim(),

        amount:
          Number(
            fd.get("amount") || 0
          ),

        reference:
          String(
            fd.get("reference") || ""
          ).trim() || null,

        message:
          String(
            fd.get("message") || ""
          ).trim() || null,

        status:
          "A_VERIFIER"

      };


      // Vérification

      if (
        !payload.name ||
        !payload.phone ||
        !payload.amount ||
        payload.amount <= 0
      ) {

        if (message) {

          message.textContent =
            "Veuillez remplir correctement les champs obligatoires.";

        }

        return;

      }


      // Vérifier Supabase

      if (!supabaseClient) {

        if (message) {

          message.textContent =
            "La connexion Supabase doit encore être configurée.";

        }

        return;

      }


      try {

        if (message) {

          message.textContent =
            "Enregistrement en cours...";

        }


        const { error } =
          await supabaseClient
            .from("contributions")
            .insert(payload);


        if (error) throw error;


        // Réinitialiser formulaire

        form.reset();


        if (message) {

          message.textContent =
            "Merci ! Votre contribution a été enregistrée et sera vérifiée par l'équipe.";

        }


        // Actualiser statistiques

        loadStats();


      } catch (error) {

        console.error(
          "Erreur contribution :",
          error
        );


        if (message) {

          message.textContent =
            "Impossible d'enregistrer la contribution. Vérifiez la connexion Supabase.";

        }

      }

    }
  );

}


// ==========================================
// DEMARRAGE
// ==========================================

loadStats();
