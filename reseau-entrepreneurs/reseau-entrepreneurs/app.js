(() => {
const people=[
{name:"Atelier de création",sector:"Couture, mode et beauté",icon:"🧵",desc:"Exemple fictif d'atelier de confection et retouches."},
{name:"Services Bâtiment",sector:"Bâtiment et immobilier",icon:"🏗️",desc:"Exemple fictif de professionnel du bâtiment."},
{name:"Distribution locale",sector:"Commerce et distribution",icon:"🛍️",desc:"Exemple fictif de commerce et distribution."},
{name:"Solutions numériques",sector:"Informatique et numérique",icon:"💻",desc:"Exemple fictif de services informatiques."},
{name:"Cuisine & réception",sector:"Restauration et alimentation",icon:"🍲",desc:"Exemple fictif de restauration."},
{name:"Transport Bassam",sector:"Transport et logistique",icon:"🚚",desc:"Exemple fictif de transport et livraison."}
];
const list=document.getElementById('members'),search=document.getElementById('search'),form=document.getElementById('form'),feedback=document.getElementById('feedback'),nav=document.getElementById('nav');
function render(q=''){const s=q.toLocaleLowerCase('fr').trim();const found=people.filter(p=>(p.name+' '+p.sector+' '+p.desc).toLocaleLowerCase('fr').includes(s));list.innerHTML=found.length?found.map(p=>`<article class="member"><div>${p.icon}</div><strong>${p.name}</strong><p><b>${p.sector}</b></p><p>${p.desc}</p><small>📍 Grand-Bassam</small></article>`).join(''):'<p>Aucun résultat.</p>';}
search.addEventListener('input',e=>render(e.target.value));
form.addEventListener('submit',e=>{e.preventDefault();feedback.textContent="Merci. Ceci est une démonstration : aucune demande n'a été envoyée ni enregistrée.";form.reset();});
document.getElementById('menu').addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));render();
})();
