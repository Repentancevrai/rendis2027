
document.addEventListener("DOMContentLoaded", () => {
  const people = [
    {
      name: "Atelier de création",
      sector: "Couture, mode et beauté",
      icon: "🧵",
      desc: "Exemple fictif d'atelier de confection et retouches."
    },
    {
      name: "Services Bâtiment",
      sector: "Bâtiment et immobilier",
      icon: "🏗️",
      desc: "Exemple fictif de professionnel du bâtiment."
    },
    {
      name: "Distribution locale",
      sector: "Commerce et distribution",
      icon: "🛍️",
      desc: "Exemple fictif de commerce et distribution."
    },
    {
      name: "Solutions numériques",
      sector: "Informatique et numérique",
      icon: "💻",
      desc: "Exemple fictif de services informatiques."
    },
    {
      name: "Cuisine et réception",
      sector: "Restauration et alimentation",
      icon: "🍲",
      desc: "Exemple fictif de service de restauration."
    },
    {
      name: "Transport Bassam",
      sector: "Transport et logistique",
      icon: "🚚",
      desc: "Exemple fictif de transport et livraison."
    }
  ];

  const list = document.getElementById("members-list");
  const search = document.getElementById("search-member");
  const form = document.getElementById("membership-form");
  const menu = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  function render(query = "") {
    if (!list) return;

    const term = query.toLocaleLowerCase("fr").trim();

    const found = people.filter(person =>
      (person.name + " " + person.sector + " " + person.desc)
        .toLocaleLowerCase("fr")
        .includes(term)
    );

    list.innerHTML = found.length
      ? found.map(person => `
          <article class="member">
            <div>${person.icon}</div>
            <strong>${person.name}</strong>
            <p><b>${person.sector}</b></p>
            <p>${person.desc}</p>
            <small>📍 Grand-Bassam</small>
          </article>
        `).join("")
      : "<p>Aucun résultat trouvé.</p>";
  }

  render();

  if (search) {
    search.addEventListener("input", event => {
      render(event.target.value);
    });
  }

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      let feedback = form.nextElementSibling;

      if (!feedback || !feedback.classList.contains("notice")) {
        feedback = document.createElement("p");
        feedback.className = "notice";
        form.after(feedback);
      }

      feedback.setAttribute("role", "status");
      feedback.textContent =
        "Merci ! Ceci est une démonstration : aucune demande réelle n'a été transmise ni enregistrée.";

      form.reset();
    });
  }

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }
});
