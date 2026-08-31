// ==========================================
// RENDIS 2027 - TABLEAU DE BORD ADMIN
// ==========================================


// ==========================================
// CONFIGURATION SUPABASE
// ==========================================

const cfg = window.RENDIS_CONFIG || {};

let supabaseClient = null;

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


// ==========================================
// ELEMENTS DE LA PAGE
// ==========================================

const adminWelcome =
    document.getElementById("adminWelcome");

const totalAmount =
    document.getElementById("totalAmount");

const totalContributions =
    document.getElementById("totalContributions");

const pendingContributions =
    document.getElementById("pendingContributions");

const contributionsList =
    document.getElementById("contributionsList");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// INITIALISATION DU TABLEAU DE BORD
// ==========================================

async function initDashboard() {

    try {

        // Vérifier la configuration Supabase
        if (!supabaseClient) {

            if (adminWelcome) {

                adminWelcome.textContent =
                    "Erreur : configuration Supabase introuvable.";

            }

            return;

        }


        // Vérifier si un administrateur est connecté
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();


        if (error || !session) {

            window.location.href = "admin.html";

            return;

        }


        // ==========================================
        // VERIFICATION DE L'ADMINISTRATEUR AUTORISE
        // ==========================================

        const ADMIN_EMAIL =
            "rendis2027bassam@gmail.com";


        if (
            session.user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            await supabaseClient.auth.signOut();

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

        console.error(
            "Erreur tableau de bord :",
            error
        );


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



const contributions = données || [];

// Contributions validées uniquement
const contributionsValidees = contributions.filter(
    contribution => contribution.statut === "VALIDE"
);

// Nombre de contributions validées
const total = contributionsValidees.length;

// Montant total des contributions validées
const montant = contributionsValidees.reduce(
    (somme, contribution) => {
        return somme + Number(contribution.montant || 0);
    },
    0
);

// Contributions à vérifier
const enAttente = contributions.filter(
    contribution => contribution.statut === "A_VERIFIER"
).length;


        // Affichage du montant total
        if (totalAmount) {

            totalAmount.textContent =
                montant.toLocaleString("fr-FR") +
                " FCFA";

        }


        // Affichage du nombre total
        if (totalContributions) {

            totalContributions.textContent =
                total;

        }


        // Affichage du nombre à vérifier
        if (pendingContributions) {

            pendingContributions.textContent =
           enAttente;

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
            .order(
                "created_at",
                {
                    ascending: false
                }
            )
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
        contributionsList.innerHTML =
            data.map(
                contribution => {

                    const name =
                        contribution.name ||
                        contribution.full_name ||
                        contribution.contributor_name ||
                        "Contributeur";


                    const amount =
                        Number(
                            contribution.amount || 0
                        ).toLocaleString("fr-FR");


                    const status =
                        contribution.status ||
                        "A_VERIFIER";


                    const date =
                        contribution.created_at
                            ? new Date(
                                contribution.created_at
                            ).toLocaleDateString(
                                "fr-FR"
                            )
                            : "";


                    // Actions administrateur
                    let actions = "";


                    if (status === "A_VERIFIER") {

                        actions = `

                            <div class="contribution-actions">

                                <button
                                    class="validate-btn"
                                    onclick="updateContributionStatus('${contribution.id}', 'VALIDEE')"
                                >
                                    ✓ Valider
                                </button>


                                <button
                                    class="reject-btn"
                                    onclick="updateContributionStatus('${contribution.id}', 'REJETEE')"
                                >
                                    ✕ Rejeter
                                </button>

                            </div>

                        `;

                    }


                    return `

                        <div class="contribution-item">

                            <div class="contribution-info">

                                <strong>
                                    ${name}
                                </strong>

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


                            ${actions}

                        </div>

                    `;

                }
            ).join("");

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
// VALIDER OU REJETER UNE CONTRIBUTION
// ==========================================

async function updateContributionStatus(
    contributionId,
    newStatus
) {

    try {

        // Vérification Supabase
        if (!supabaseClient) {

            alert(
                "Erreur : Supabase n'est pas configuré."
            );

            return;

        }


        // Demander confirmation
        const confirmation =
            confirm(

                newStatus === "VALIDEE"

                    ? "Voulez-vous vraiment valider cette contribution ?"

                    : "Voulez-vous vraiment rejeter cette contribution ?"

            );


        if (!confirmation) {

            return;

        }


        // Mise à jour dans Supabase
        const { error } =
            await supabaseClient
                .from("contributions")
                .update({

                    status: newStatus

                })
                .eq(
                    "id",
                    contributionId
                );


        if (error) {

            throw error;

        }


        // Message de confirmation
        alert(

            newStatus === "VALIDEE"

                ? "Contribution validée avec succès."

                : "Contribution rejetée."

        );


        // Actualiser les statistiques
        await loadDashboardStats();


        // Actualiser la liste
        await loadRecentContributions();


    } catch (error) {

        console.error(
            "Erreur lors de la mise à jour :",
            error
        );


        alert(
            "Impossible de mettre à jour cette contribution."
        );

    }

}


// Rendre la fonction accessible aux boutons HTML
window.updateContributionStatus =
    updateContributionStatus;


// ==========================================
// DECONNEXION
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                if (supabaseClient) {

                    await supabaseClient
                        .auth
                        .signOut();

                }


                window.location.href =
                    "admin.html";


            } catch (error) {

                console.error(
                    "Erreur lors de la déconnexion :",
                    error
                );

            }

        }
    );

}


// ==========================================
// LANCEMENT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
