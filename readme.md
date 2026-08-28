# RENDIS 2027 — version indépendante de Bolt

Cette version est volontairement indépendante de Bolt.

## Contenu
- `index.html` : site public
- `styles.css` : design
- `app.js` : formulaire + lecture des statistiques Supabase
- `config.js` : configuration Supabase
- `assets/` : dossier pour les images/logo

## Configuration
Dans `config.js`, remplacer :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Utiliser uniquement la clé **anon/public** de Supabase. Ne jamais mettre `service_role`.

## Paiement CinetPay
Aucune fausse clé n'est incluse. L'intégration CinetPay sera ajoutée après création du compte CinetPay et obtention des identifiants officiels.

## Important
Le champ `status` est envoyé avec la valeur `A_VERIFIER`, conformément à la policy Supabase observée dans le projet RENDIS-2027-GRAND-BASSAM.
