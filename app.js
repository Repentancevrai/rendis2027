const cfg = window.RENDIS_CONFIG || {};
const form = document.getElementById("contributionForm");
const message = document.getElementById("formMessage");
let supabaseClient = null;

if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.startsWith("PASTE_") && !cfg.SUPABASE_ANON_KEY.startsWith("PASTE_")) {
  supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
}

function money(n){ return new Intl.NumberFormat("fr-FR").format(Math.round(n || 0)) + " FCFA"; }

async function loadStats(){
  if(!supabaseClient) return;
  try{
    const { data, error } = await supabaseClient
      .from("contributions")
      .select("amount,status");
    if(error) throw error;
    let validated=0,pending=0,total=0;
    for(const row of (data||[])){
      const amount=Number(row.amount)||0;
      if(row.status === "A_VERIFIER" || row.status === "a_verifier") pending += 1;
      if(["VALIDE","VALIDEE","VERIFIED","VERIFIEE"].includes(String(row.status||"").toUpperCase())){
        validated += 1; total += amount;
      }
    }
    document.getElementById("validatedCount").textContent=validated;
    document.getElementById("pendingCount").textContent=pending;
    document.getElementById("amountRaised").textContent=money(total);
    document.getElementById("progressBar").style.width=Math.min(100,total/(cfg.GOAL_FCFA||60000000)*100)+"%";
  }catch(e){ console.warn("Stats unavailable:",e); }
}

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  message.textContent="";
  const fd = new FormData(form);
  const payload = {
    name: String(fd.get("name")||"").trim(),
    phone: String(fd.get("phone")||"").trim(),
    amount: Number(fd.get("amount")||0),
    reference: String(fd.get("reference")||"").trim() || null,
    message: String(fd.get("message")||"").trim() || null,
    status: "A_VERIFIER"
  };
  if(!payload.name || !payload.phone || !payload.amount){
    message.textContent="Veuillez remplir les champs obligatoires.";
    return;
  }
  if(!supabaseClient){
    message.textContent="La connexion Supabase doit encore être configurée.";
    return;
  }
  try{
    const { error } = await supabaseClient.from("contributions").insert(payload);
    if(error) throw error;
    form.reset();
    message.textContent="Merci ! Votre contribution a été enregistrée et sera vérifiée par l'équipe.";
    loadStats();
  }catch(err){
    console.error(err);
    message.textContent="Impossible d'enregistrer la contribution pour le moment. Vérifiez la configuration Supabase.";
  }
});

loadStats();
