(function () {
  "use strict";

  /*
   * RENDIS 2027 — NOUVEAUX GADGETS
   * T-shirt : 3 000 FCFA
   * Polo    : 5 000 FCFA
   * Sac     : 4 000 FCFA
   */

  const GADGETS = {
    tshirt: {
      name: "T-shirt RENDIS 2027",
      price: 3000,
      field: "tshirtQty",
      image: "images/tshirt-rendis-2027.jpg",
      alt: "T-shirt officiel RENDIS 2027",
      colors: "Blanc, bleu, Bordeaux, orange et vert"
    },

    polo: {
      name: "Polo RENDIS 2027",
      price: 5000,
      field: "poloQty",
      image: "images/polo-rendis-2027.jpg",
      alt: "Polo officiel RENDIS 2027",
      colors: "Blanc, bleu, Bordeaux, orange et vert"
    },

    sac: {
      name: "Sac RENDIS 2027",
      price: 4000,
      field: "sacQty",
      images: [
        "images/sac-rendis-2027-bleu.jpg",
        "images/sac-rendis-2027-vert.jpg"
      ],
      alt: "Sacs officiels RENDIS 2027 bleu et vert",
      colors: "Bleu et vert"
    }
  };

  /*
   * On rend les informations disponibles pour app.js
   * sans modifier les produits déjà validés.
   */
  window.RENDIS_GADGETS = GADGETS;

  function money(value) {
    return (
      new Intl.NumberFormat("fr-FR").format(
        Math.round(Number(value) || 0)
      ) + " FCFA"
    );
  }

  function createImage(src, alt) {
    const img = document.createElement("img");

    img.src = src;
    img.alt = alt;
    img.loading = "lazy";

    img.style.cssText =
      "width:100%;height:auto;display:block;object-fit:cover;border-radius:12px;";

    return img;
  }

  function createGadgetCard(gadget) {
    const card = document.createElement("article");

    card.className = "product-card rendis-gadget-card";

    const imageBox = document.createElement("div");

    imageBox.style.cssText =
      "display:grid;grid-template-columns:repeat(" +
      Math.min((gadget.images || [gadget.image]).length, 2) +
      ",1fr);gap:8px;";

    const images = gadget.images || [gadget.image];

    images.forEach(function (src) {
      imageBox.appendChild(
        createImage(src, gadget.alt)
      );
    });

    const body = document.createElement("div");

    body.className = "product-body";

    body.innerHTML = `
      <span class="eyebrow">GADGET OFFICIEL</span>

      <h3>${gadget.name}</h3>

      <p>
        <strong>${money(gadget.price)}</strong>
      </p>

      <p>
        Motif et couleurs du pagne officiel RENDIS 2027.
      </p>

      <p>
        <strong>Couleurs disponibles :</strong>
        ${gadget.colors}
      </p>
    `;

    card.appendChild(imageBox);
    card.appendChild(body);

    return card;
  }

  function addGadgetCards() {
    const shop = document.querySelector(
      "#precommandes .shop-grid"
    );

    if (!shop) return;

    if (
      document.querySelector(
        ".rendis-gadgets-block"
      )
    ) {
      return;
    }

    const block = document.createElement("div");

    block.className =
      "rendis-gadgets-block";

    block.style.cssText =
      "grid-column:1/-1;" +
      "display:grid;" +
      "grid-template-columns:repeat(auto-fit,minmax(240px,1fr));" +
      "gap:20px;" +
      "margin-top:20px;";

    Object.keys(GADGETS).forEach(function (key) {
      block.appendChild(
        createGadgetCard(GADGETS[key])
      );
    });

    shop.appendChild(block);
  }

  function createQuantityField(
    name,
    label,
    price,
    colors
  ) {
    const wrapper = document.createElement("label");

    wrapper.className =
      "rendis-gadget-quantity";

    wrapper.innerHTML = `
      <span>
        <strong>${label}</strong>
        — ${money(price)}
      </span>

      <input
        type="number"
        name="${name}"
        min="0"
        step="1"
        value="0"
        inputmode="numeric"
      >

      <small>
        ${colors}
      </small>
    `;

    return wrapper;
  }

  function addGadgetOrderFields() {
    const form =
      document.getElementById("orderForm");

    if (!form) return;

    if (
      form.querySelector(
        ".rendis-gadget-order-fields"
      )
    ) {
      return;
    }

    const fieldset =
      document.createElement("fieldset");

    fieldset.className =
      "rendis-gadget-order-fields";

    fieldset.style.cssText =
      "margin-top:20px;padding:16px;border-radius:14px;";

    const legend =
      document.createElement("legend");

    legend.textContent =
      "Gadgets officiels RENDIS 2027";

    fieldset.appendChild(legend);

    fieldset.appendChild(
      createQuantityField(
        GADGETS.tshirt.field,
        GADGETS.tshirt.name,
        GADGETS.tshirt.price,
        GADGETS.tshirt.colors
      )
    );

    fieldset.appendChild(
      createQuantityField(
        GADGETS.polo.field,
        GADGETS.polo.name,
        GADGETS.polo.price,
        GADGETS.polo.colors
      )
    );

    fieldset.appendChild(
      createQuantityField(
        GADGETS.sac.field,
        GADGETS.sac.name,
        GADGETS.sac.price,
        GADGETS.sac.colors
      )
    );

    const total =
      form.querySelector(".order-total");

    if (total) {
      total.insertAdjacentElement(
        "beforebegin",
        fieldset
      );
    } else {
      form.appendChild(fieldset);
    }
  }

  function apply() {
    addGadgetCards();
    addGadgetOrderFields();
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      apply,
      { once: true }
    );
  } else {
    apply();
  }

  window.addEventListener(
    "load",
    apply,
    { once: true }
  );
})();
