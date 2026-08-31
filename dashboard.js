// ==========================================
// RENDIS 2027 - TABLEAU DE BORD ADMIN
// ==========================================

// Vérification de la configuration Supabase
if (typeof supabaseClient === "undefined") {
    console.error("Supabase n'est pas configuré correctement.");
}

// Éléments de la page
const adminWelcome = document.getElementById("adminWelcome");
const totalAmount = document.getElementById("totalAmount");
const totalContributions = document.getElementById("totalContributions");
const pendingContributions = document.getElementById("pendingContributions");
const contributionsList = document.getElementById("contributionsList");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// INITIALISATION DU TABLEAU DE BORD
// ==========================================

async function initDashboard() {

    try {

        // Vérifier si un administrateur est connecté
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();

        if (error || !session) {
            window.location.href = "admin.html";
            return;
        }

        // Afficher l'adresse de l'administrateur connecté
        if (adminWelcome) {
            adminWelcome.textContent =
                `Connecté en tant que : ${session.user.email}`;
        }

        // Charger les statistiques
        await loadDashboardStats();

        // Charger les contributions
        await loadRecentContributions();

    } catch (error) {

        console.error("Erreur tableau de bord :", error);

        if (adminWelcome) {
            adminWelcome.textContent =
                "Erreur de chargement du tableau de bord.";
        }

    }

}


// ==========================================
// CHARGER LES STATISTIQUES
// ==========================================

async function loadDashboardStats() {

    try {

        const { data, error } = await supabaseClient
            .from("contributions")
            .select("*");

        if (error) {
            throw error;
        }

        const contributions = data || [];

        // Nombre total de contributions
        const total = contributions.length;

        // Montant total
        const amount = contributions.reduce((sum, contribution) => {

            const contributionAmount =
                Number(contribution.amount) || 0;

            return sum + contributionAmount;

        }, 0);


        // Contributions en attente
        const pending = contributions.filter(contribution => {

            return contribution.status === "A_VERIFIER";

        }).length;


        // Affichage
        if (totalAmount) {

            totalAmount.textContent =
                amount.toLocaleString("fr-FR") + " FCFA";

        }


        if (totalContributions) {

            totalContributions.textContent = total;

        }


        if (pendingContributions) {

            pendingContributions.textContent = pending;

        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement des statistiques :",
            error
        );

    }

}


// ==========================================
// CHARGER LES CONTRIBUTIONS RECENTES
// ==========================================

async function loadRecentContributions() {

    try {

        const { data, error } = await supabaseClient
            .from("contributions")
            .select("*")
            .order("created_at", {
                ascending: false
            })
            .limit(10);


        if (error) {
            throw error;
        }


        if (!contributionsList) {
            return;
        }


        // Aucune contribution
        if (!data || data.length === 0) {

            contributionsList.innerHTML = `
                <p class="loading-text">
                    Aucune contribution enregistrée pour le moment.
                </p>
            `;

            return;

        }


        // Générer la liste
        contributionsList.innerHTML = data.map(contribution => {

            const name =
                contribution.name ||
                contribution.full_name ||
                contribution.contributor_name ||
                "Contributeur";

            const amount =
                Number(contribution.amount || 0)
                    .toLocaleString("fr-FR");

            const status =
                contribution.status || "A_VERIFIER";

            const date = contribution.created_at
                ? new Date(contribution.created_at)
                    .toLocaleDateString("fr-FR")
                : "";


            return `

                <div class="contribution-item">

                    <div class="contribution-info">

                        <strong>${name}</strong>

                        <span>
                            ${date}
                        </span>

                    </div>


                    <div class="contribution-amount">

                        ${amount} FCFA

                    </div>


                    <div class="contribution-status">

                        ${status}

                    </div>

                </div>

            `;

        }).join("");

    } catch (error) {

        console.error(
            "Erreur lors du chargement des contributions :",
            error
        );


        if (contributionsList) {

            contributionsList.innerHTML = `

                <p class="loading-text">

                    Impossible de charger les contributions.

                </p>

            `;

        }

    }

}


// ==========================================
// DECONNEXION
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await supabaseClient.auth.signOut();

            window.location.href = "admin.html";

        } catch (error) {

            console.error(
                "Erreur lors de la déconnexion :",
                error
            );

        }

    });

}


// ==========================================
// LANCEMENT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
