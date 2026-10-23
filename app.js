/* ===== Espace Manager — Lumen & Co ===== */
"use strict";

const STORAGE_KEY = "lumen-manager-faq-v1";
const AUTH_KEY = "lumen-manager-auth-v1";
const HASH_COACH = "2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea";
const HASH_MANAGER = "6ee4a469cd4e91053847f5d3fcb61dbcc91e8f0ef10be7748da4c4a1ba382d17";
let IS_MANAGER = false;

/* ---------- Accès : mot de passe équipe (2 niveaux) ---------- */
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function initAuth() {
  const unlock = () => {
    document.getElementById("loginScreen").classList.add("hidden");
    try { sessionStorage.setItem(AUTH_KEY, IS_MANAGER ? "manager" : "coach"); } catch (e) {}
  };
  const applyRole = () => {
    document.body.classList.toggle("role-manager", IS_MANAGER);
    document.body.classList.toggle("role-coach", !IS_MANAGER);
  };
  try {
    const saved = sessionStorage.getItem(AUTH_KEY);
    if (saved === "manager" || saved === "coach") {
      IS_MANAGER = saved === "manager";
      applyRole();
      unlock();
      return;
    }
  } catch (e) {}
  const attempt = async () => {
    const pass = document.getElementById("loginPass").value;
    const h = await sha256(pass);
    if (h === HASH_MANAGER) { IS_MANAGER = true; applyRole(); unlock(); }
    else if (h === HASH_COACH) { IS_MANAGER = false; applyRole(); unlock(); }
    else {
      document.getElementById("loginError").classList.remove("hidden");
      document.getElementById("loginPass").value = "";
      document.getElementById("loginPass").focus();
    }
  };
  document.getElementById("loginBtn").addEventListener("click", attempt);
  document.getElementById("loginPass").addEventListener("keydown", (e) => { if (e.key === "Enter") attempt(); });
}
initAuth();
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- FAQ par défaut, issue des guides Lumen & Co ---------- */
const DEFAULT_FAQ = [
  { id: "d19", category: "Carrière & Revenus", question: "Combien peut-on gagner en tant que démonstrateur ?", answer: "En moyenne : 2 démos/mois ≈ 300 €, 4 démos/mois ≈ 600 €, 10 démos/mois ≈ 1 400 €. Travailler depuis chez soi permet de plus de déduire une partie des charges du domicile des impôts.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d20", category: "Carrière & Revenus", question: "Comment fonctionne le kit de lancement ?", answer: "Le kit de lancement (valeur 300 €) est disponible à un prix préférentiel de 150 €, sans commission et non comptabilisé dans les challenges. Il doit être commandé au plus tard 30 jours avant la réunion d'annonce. Le kit devient définitivement vôtre après 2 990 € de ventes totales. Il existe aussi le challenge du kit complémentaire : 80 € le jour de la réunion d'annonce, et si vous réalisez au moins 1 940 € de ventes dans les 60 jours, vous remportez un bon d'achat de 225 €.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d21", category: "Carrière & Revenus", question: "Quelles sont les conditions pour bénéficier des bons d'achat mensuels ?", answer: "1) Avoir effectué au minimum une démonstration au cours du mois précédent. 2) Avoir laissé des avis sur les produits déjà reçus ou achetés avec le code LC50. 3) Envoyer la proposition de votre panier par e-mail à votre Manager, en respectant les priorités : d'abord la collection Lumen & Co, ensuite les produits à mettre en avant communiqués par la Manager, puis vos produits préférés de l'onglet « Cadeaux démonstrateur » (grandes pièces 1×/an, consommables 2×/an si active au moins 11 mois sur les 12 précédents ; choisir la variation avec le plus de stock). Le code est actif jusqu'au 14 à 23 h 59 dans « Mes codes promos » du Front Office.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d22", category: "Carrière & Revenus", question: "Quelles sont les évolutions de carrière possibles ?", answer: "Ambassadeur / marraine : bon d'achat de 60 € dès le 1er recrutement, 100 € au 2e, 140 € au 3e puis 140 € par recrutement subséquent (minimum 1 recrutement tous les 3 mois). démonstrateur Expert : un pourcentage sur les ventes de son équipe, avec le soutien de la manager. Manager : développer et coacher son équipe, avec accès aux informations de l'équipe dans le back office. Le Nouvel An Lumen & Co est accessible avec 10 000 € de CA ou 3 recrutements.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d23", category: "Démos", question: "Quels sont les types de démos Lumen & Co ?", answer: "En plus des ventes en ligne : 1) La présentation à domicile chez l'hôte — vous vous rendez chez votre hôtesse, accueillez ses amis et leur faites découvrir les produits dans un cadre convivial ; les commandes se font individuellement et dans une pièce à part pour garantir la confidentialité. 2) Les présentations virtuelles par visioconférence. 3) Les lives sur les réseaux sociaux.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d24", category: "Démos", question: "Comment bien démarrer son activité ?", answer: "Planifiez et datez 4 à 6 démonstrations pour démarrer, en incluant les deux premières en tant qu'hôtesse pour acquérir de l'expérience. Visez en moyenne 2 reprises de démos par démo (dont l'hôte) ; une porte ouverte par mois est possible. Définissez vos objectifs avec votre manager, participez aux formations, utilisez une liste de contacts à jour, communiquez régulièrement avec l'hôtesse avant l'atelier et photographiez votre table en début de présentation.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d25", category: "Démos", question: "Que trouve-t-on dans le Back Office ?", answer: "Le Back Office (backoffice.lumen-demo.example) centralise : l'onglet Commandes (suivi des commandes clientes, livraison et paiement), la Liste des démos (enregistrement, notes de suivi, liens et clôture), la Gestion démonstrateur (statistiques, objectifs et performances mensuelles) et l'onglet Commissions (statut et paiement). Le Front Office affiche le stock des produits en temps réel. Une fois Leader, vous accédez aussi aux informations de votre équipe pour le coaching.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d9", category: "Démos", question: "Je reçois une demande de démo transférée par Lumen & Co : quand dois-je contacter la cliente ?", answer: "Le jour du transfert si la demande est reçue avant 20 h, ou le lendemain au plus tard. Sans réponse à l'appel : envoyez un SMS et un e-mail ; toujours rien : un e-mail le lendemain au plus tard.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d10", category: "Démos", question: "Quel est le planning de suivi d'une démo ?", answer: "J-3 mois : appel + e-mail récapitulatif + message de motivation. J-2 mois : appel, conseils invitations, supports. J-1 mois : création du groupe avec l'hôtesse et tous les participants (présentation des produits, jeux, animations) et prévoir une pièce séparée pour les commandes. J-15 jours : lancement des préventes dans le groupe. J-7 jours : appel avec l'hôtesse, relance conviviale, vérification de la pièce. J-1 jour : encouragement, rappel de l'horaire, confirmation du déroulement.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d36", category: "Démos", question: "Quand et comment prévenir l'hôtesse par mail ?", answer: "Un rappel 15 jours avant la démo (le lien démo devient actif), une confirmation la veille (recommander d'envoyer le lien à ceux qui ne peuvent pas venir), un remerciement le lendemain, puis une proposition de nouvelle collaboration environ une semaine après. Tous ces modèles de mails sont disponibles dans l'onglet Contact & Modèles.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d13", category: "Démos", question: "La cliente ne peut pas tout prendre car elle n'a pas les moyens, que proposer ?", answer: "Proposez-lui une démo chez elle ! Elle pourra obtenir des produits en cadeaux grâce aux ventes réalisées, sans aucune obligation d'achat de sa part — juste un moment convivial entre amies. Donnez-lui le guide hôte et répondez à ses questions.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d14", category: "Produits", question: "Comment fixer une date pour une nouvelle démo ?", answer: "La technique en 3 étapes : 1) Quel mois te conviendrait ? 2) Plutôt au début ou à la fin du mois ? 3) Quel jour de la semaine te convient le mieux ?", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d16", category: "Événements", question: "Comment fonctionnent les forfaits animation pour anniversaire, EVJF/EVG ou baby shower ?", answer: "Le forfait animation est de 50 €, offert si le total des ventes atteint 350 €. Sinon, après la clôture de la démo, l'hôte commande une carte cadeau de 50 € sur la référence de la démonstrateur qui a réalisé l'animation. Dans tous les cas, l'hôte bénéficie de 10 % des ventes en cadeaux.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d17", category: "Événements", question: "Quelles sont les conditions du cadeau événement ?", answer: "Anniversaire : démo dans le mois avant ou après la date d'anniversaire + 350 € de ventes, justificatif = carte d'identité. EVJF/EVG : démo dans le mois avant le mariage + 350 € de ventes, justificatif = document prouvant le mariage (faire-part, réservation...). Baby shower : 350 € de ventes, justificatif = document prouvant la grossesse (échographie, certificat médical). Le cadeau est choisi dans le document interne et mentionné dans la note de la commande qui fait partir la démo.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d11", category: "Démos", question: "Comment se passe la clôture d'une démo selon son montant ?", answer: "Moins de 250 € : l'hôte commande dans la démo avec la note « Pour faire partir la démo – Réf. de la démo : ... » et choisit la livraison de la démo. Entre 250 € et 350 € : idem, plus un cadeau surprise ajouté automatiquement. Plus de 350 € : l'hôte clôture la démo, reçoit automatiquement un code promo et commande ses cadeaux sur l'e-boutique avec ce code, en ajoutant la note et en choisissant la livraison.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d12", category: "Démos", question: "Comment obtenir les cadeaux anniversaire, EVJF ou reprise ?", answer: "Remplir le formulaire de contact sur le site et joindre la preuve. Anniversaire : valable 1 mois avant ou après la date, preuve = carte d'identité. EVJF : faire-part, maximum 1 mois avant le mariage. Reprise : avoir déjà commandé dans une démo Lumen & Co depuis moins de 6 mois (ou moins d'1 an si vous étiez l'hôte), en indiquant la référence de la démo initiale dans la note de commande.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d1", category: "Commandes points", question: "Quelle est la deadline pour envoyer mon mail de commande points ?", answer: "Le mail doit être envoyé à Martine au plus tard le 12 du mois. Recommandation : l'envoyer pour le 10 afin qu'il puisse être traité sereinement.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d2", category: "Commandes points", question: "Que dois-je inclure dans mon mail de commande points ?", answer: "1) Les captures des commandes passées depuis votre dernière commande points (kit de départ si concerné, colis et tous les produits reçus) intégrées directement dans le corps du mail. 2) Tous les avis des produits reçus, dans le même ordre. 3) Votre panier souhaité en indiquant la formule choisie et en vérifiant le stock et les priorités.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d3", category: "Commandes points", question: "Quelle est la différence entre la formule 4 % et la formule 2 % ?", answer: "Formule 4 % : idéale pour compléter votre table de démonstration — 1 cosmétique par type de produit et par année (2×/an si 2 démos/mois sur les 12 derniers mois), 1 exemplaire par grande pièce. Formule 2 % : idéale quand votre table est déjà complète — possibilité de commander différents parfums ou couleurs d'un même produit (une fois par an et par parfum/couleur), 1 exemplaire par grande pièce.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d4", category: "Commandes points", question: "Faut-il toujours joindre les captures des avis produits ?", answer: "Non. Si vous avez une commande LCS0 d'un minimum de 150 € payée dans votre point 1, vous n'avez pas besoin de mettre les captures des avis. Sinon, les avis doivent être déposés dès réception de la commande.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d15", category: "Commandes points", question: "Puis-je utiliser les produits obtenus grâce aux points pour moi ?", answer: "Non. Ils sont exclusivement destinés à votre activité de démonstrateur : jamais à titre privé, ni offerts, ni revendus. Ils doivent impérativement rester présents sur votre table de démonstration et être présentés lors de toutes vos démonstrations jusqu'à leur retrait officiel du catalogue. Des vérifications régulières sont effectuées via les photos de tables.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d18", category: "Échanges & SAV", question: "Un client signale un produit défectueux : quelle est la procédure SAV ?", answer: "Le produit doit être déclaré défectueux dans les délais de garantie (voir CGV en vigueur). 1) Organiser au plus vite un rendez-vous en visio pour comprendre le problème, vérifier l'utilisation et identifier si le produit semble réellement défectueux. 2) S'il ne semble pas défectueux : expliquer les conseils d'utilisation ; si le problème persiste, une nouvelle analyse pourra être faite. 3) S'il semble défectueux : demander une vidéo montrant le défaut et faire compléter au client le formulaire SAV en ligne — vous recevez une copie par e-mail que vous transférez au bureau. 4) Organiser la récupération : en main propre (chez le client ou via une démonstrateur habitant plus proche) ou envoi par étiquette de retour (frais pris en charge par la démonstrateur, déductibles, inclus dans les 24,2 % à 36 % de commissions). Bien emballer le produit et conserver le numéro de suivi. 5) Le bureau analyse puis renvoie un produit neuf ou équivalent dans vos points si le défaut est confirmé.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d5", category: "Échanges & SAV", question: "Un client veut échanger un produit : quel est le délai ?", answer: "La demande doit être faite dans les 24 h après la livraison. Passé ce délai, aucun échange ni bon à valoir n'est possible.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d6", category: "Échanges & SAV", question: "Y a-t-il un remboursement possible en démo ?", answer: "Non, pas de remboursement en démo. Un bon à valoir est proposé, utilisable lors d'une prochaine commande selon les conditions en vigueur. Hors démo (commande classique), un remboursement est possible selon les conditions générales de vente.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d7", category: "Échanges & SAV", question: "Quelles sont les règles d'échange selon le type de produit ?", answer: "Électriques : si le scellé est retiré ou la boîte ouverte, plus d'échange possible (garantie constructeur). Cosmétiques d'entretien : si la pompe a été activée (même une fois), plus d'échange ; le produit doit être non ouvert et intact. Textiles : échange uniquement si non lavés et dans leur emballage d'origine, avec analyse à la réception. Autres produits : non utilisés, non ouverts, emballage d'origine.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d8", category: "Échanges & SAV", question: "Où le client doit-il renvoyer le produit ?", answer: "Le retour se fait aux frais du client vers l'un des deux points : le point relais Mondial Relais Déco Attitude de Corbais OU le distributeur Bpost Jaurdinia de Mont-Saint-Guibert. Une analyse est toujours faite à la réception.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d29", category: "Produits", question: "Quel entretien pour les articles en bois massif ?", answer: "Il est préférable d'utiliser une huile d'entretien naturelle : les produits siliconés peuvent endommager certains vernis. Commencez par dépoussiérer au chiffon doux, puis appliquez l'huile en petites quantités, en suivant le sens du bois ; laissez sécher avant la seconde couche. Nettoyez à l'eau tiède et au savon doux avant et après chaque entretien (ou avec le nettoyant Lumen & Co pour bois).", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d30", category: "Produits", question: "Comment utiliser les diffuseurs d'huiles essentielles ?", answer: "Les diffuseurs à ultrasons parfument et assainissent l'air intérieur, améliorent le confort de la maison et favorisent la détente. Remplissez le réservoir d'eau, ajoutez quelques gouttes d'huile essentielle, et choisissez la diffusion continue ou intermittente selon votre besoin. La version Lumen & Co propose 4 intensités et une lumière d'ambiance réglable.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d31", category: "Produits", question: "Comment fonctionne la mousse de massage crpitante ?", answer: "Secouez bien le flacon, déposez une petite quantité de mousse, appliquez en mouvements circulaires et massez doucement — la mousse hydrate et nourrit pendant le massage (pas de rinçage nécessaire). À utiliser sur tout le corps sauf les parties intimes. Elle n'est pas comestible. Faites un test sur une petite zone de peau en cas d'allergie ; en cas de réaction, cessez l'utilisation et consultez un professionnel de santé.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d32", category: "Produits", question: "Les stimulants effet chaud/frais sont-ils adaptés à tous ?", answer: "Les bougies à effet chaleureux diffusent une lumière tamisée apaisante, les diffuseurs à effet vif une fraîcheur vivifiante ; la lampe 3 en 1 combine les deux. Les effets (éclairage grâce aux LED chaudes) durent des heures selon le réglage. Faites un test sur une petite surface ; en cas de réaction, éloignez des rideaux. Compatible avec tous les supports (test préalable conseillé sur une petite zone).", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d33", category: "Produits", question: "Les pailles et moules en silicone sont-ils réutilisables ?", answer: "Oui : les bouteilles isothermes sont réutilisables (acier sans BPA) — bien les nettoyer entre chaque utilisation et éviter le lave-vaisselle pour les couvercles. Les bacs de rangement en silicone se nettoient à la main ou au lave-vaisselle à l'eau chaude avec du savon doux ; bien les sécher. Ils sont durables et réutilisables de nombreuses fois.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d34", category: "Produits", question: "Les jeux d'animation conviennent-ils aux débutants et à tous les publics ?", answer: "Oui, les jeux d'animation Lumen & Co sont conçus pour être inclusifs (tous âges et tous publics) et accessibles aux débutants — une introduction ludique aux produits. Parfaits pour les anniversaires, EVJF, soirées entre amis et événements festifs.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d26", category: "Recrutement", question: "Faut-il une expérience en vente pour rejoindre Lumen & Co ?", answer: "Non. Lumen & Co offre une formation complète à tous ses nouveaux démonstrateurs. Tout ce dont vous avez besoin, c'est de la motivation et de la passion pour les produits. Vous bénéficiez de formations continues, d'outils marketing, d'un kit de démarrage et d'une communauté de soutien — jamais seule dans l'aventure !", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d27", category: "Recrutement", question: "Quels sont les avantages du réseau de marraines ?", answer: "En tant qu'ambassadeur/marraine, chaque recrutement qualifié est récompensé : bon d'achat de 60 € dès le premier, 100 € pour le deuxième, 140 € pour le troisième puis 140 € pour chaque recrutement subséquent, tant qu'il y a un minimum d'un recrutement tous les trois mois.", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d28", category: "Recrutement", question: "Comment surmonter les objections lors d'un recrutement ?", answer: "Écoutez les préoccupations et répondez avec des informations claires et positives. Si la personne s'inquiète de son manque d'expérience, expliquez que la formation Lumen & Co la préparera. Si le temps est un problème, mettez en avant la flexibilité horaire (temps plein ou partiel, c'est elle qui décide).", created: "2024-01-01", updated: "2024-01-01" },
  { id: "d35", category: "Recrutement", question: "Comment promouvoir Lumen & Co sur les réseaux sociaux ?", answer: "Créez des profils professionnels complets (photo, bio, liens officiels), publiez 3 à 4 fois par semaine en variant les contenus (vidéos, tutoriels, témoignages, stories, sondages). Hashtags : #LumenEtCo #BienÊtre #SoinPersonnel #BeautéNaturelle. Répondez rapidement aux commentaires et MP, mesurez vos performances avec Facebook Insights / Instagram Analytics et ajustez votre stratégie.", created: "2024-01-01", updated: "2024-01-01" }
];

/* ---------- État ---------- */
let faqs = load();
let editingId = null;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length) return data;
    }
  } catch (e) { /* fallback défaut */ }
  return [...DEFAULT_FAQ];
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs)); }
  catch (e) { toast("Impossible d'enregistrer (stockage plein ?)"); }
}

/* ---------- Onglets ---------- */
document.querySelectorAll("#tabs .tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#tabs .tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    $("#view-" + btn.dataset.view).classList.add("active");
  });
});

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Rendu FAQ ---------- */
const CATEGORY_ORDER = ["Général", "Commandes points", "Démos", "Échanges & SAV", "Événements", "Produits", "Recrutement", "Carrière & Revenus"];

function uniqueCategories() {
  const set = new Set(faqs.map((f) => f.category || "Général"));
  CATEGORY_ORDER.forEach((c) => set.add(c));
  return [...set];
}

function renderCategoryFilter() {
  const sel = $("#faqCategory");
  const current = sel.value;
  sel.innerHTML = '<option value="">Toutes catégories</option>' +
    uniqueCategories().map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  sel.value = current;
}

function matches(f) {
  const q = $("#faqSearch").value.trim().toLowerCase();
  const cat = $("#faqCategory").value;
  if (cat && (f.category || "Général") !== cat) return false;
  if (!q) return true;
  return (f.question + " " + f.answer).toLowerCase().includes(q);
}

function renderFaq() {
  renderCategoryFilter();
  const list = $("#faqList");
  list.innerHTML = "";
  const visible = faqs.filter(matches);
  $("#faqEmpty").style.display = visible.length ? "none" : "block";
  visible.forEach((f) => {
    const item = document.createElement("div");
    item.className = "faq-item" + (editingId === f.id ? " editing" : "");
    item.dataset.id = f.id;
    const date = f.updated ? "Modifié le " + f.updated : "Ajouté le " + (f.created || "");
    const isCustom = String(f.id || "").startsWith("f");
    const newBadge = isCustom ? ' <span class="badge badge-new">Nouveau</span>' : "";
    item.innerHTML = `
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false">
        <span class="faq-cat">${esc(f.category || "Général")}</span>
        <h4>${esc(f.question)}${newBadge}</h4>
        <span class="chev">▶</span>
      </div>
      <div class="faq-a">
        <div class="faq-a-inner">
          <div>${esc(f.answer)}</div>
          <div class="faq-meta">
            <span class="date">${esc(date)}</span>
            <button class="icon-btn edit-btn" title="Modifier">✏️ Modifier</button>
            <button class="icon-btn del-btn" title="Supprimer">🗑 Supprimer</button>
          </div>
        </div>
      </div>`;
    const head = item.querySelector(".faq-q");
    const toggle = () => {
      const panel = item.querySelector(".faq-a");
      const open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", open);
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0";
    };
    head.addEventListener("click", (e) => {
      if (e.target.closest(".icon-btn")) return;
      toggle();
    });
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
    item.querySelector(".edit-btn").addEventListener("click", () => startEdit(f));
    item.querySelector(".del-btn").addEventListener("click", () => {
      if (confirm("Supprimer cette question ?")) {
        faqs = faqs.filter((x) => x.id !== f.id);
        if (editingId === f.id) resetForm();
        save();
        renderFaq();
        toast("Question supprimée");
      }
    });
    list.appendChild(item);
  });
}

/* ---------- Formulaire ---------- */
function resetForm() {
  editingId = null;
  $("#newQuestion").value = "";
  $("#newAnswer").value = "";
  $("#newCategory").value = "Général";
  $("#faqFormTitle").textContent = "➕ Ajouter une question";
  $("#cancelEdit").classList.add("hidden");
}

function startEdit(f) {
  editingId = f.id;
  $("#newQuestion").value = f.question;
  $("#newAnswer").value = f.answer;
  $("#newCategory").value = f.category || "Général";
  $("#faqFormTitle").textContent = "✏️ Modifier la question";
  $("#cancelEdit").classList.remove("hidden");
  document.getElementById("view-faq").scrollIntoView({ behavior: "smooth" });
  renderFaq();
}

$("#saveFaq").addEventListener("click", () => {
  const question = $("#newQuestion").value.trim();
  const answer = $("#newAnswer").value.trim();
  const category = $("#newCategory").value;
  if (!question || !answer) { toast("Question et réponse obligatoires"); return; }
  const today = new Date().toISOString().slice(0, 10);
  if (editingId) {
    const f = faqs.find((x) => x.id === editingId);
    if (f) { Object.assign(f, { question, answer, category, updated: today }); }
    toast("Question mise à jour");
  } else {
    faqs.push({ id: "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), question, answer, category, created: today, updated: "" });
    toast("Question ajoutée");
  }
  resetForm();
  save();
  renderFaq();
});

$("#cancelEdit").addEventListener("click", () => { resetForm(); renderFaq(); });
$("#faqSearch").addEventListener("input", renderFaq);
$("#faqCategory").addEventListener("change", renderFaq);

/* ---------- Export / Import ---------- */
$("#exportFaq").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(faqs, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "soft-love-faq.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

$("#importFaq").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data) || !data.every((d) => d.question && d.answer)) throw new Error("format");
      const existing = new Set(faqs.map((f) => (f.question + "|" + f.answer).toLowerCase()));
      let added = 0;
      data.forEach((d) => {
        const key = (d.question + "|" + d.answer).toLowerCase();
        if (!existing.has(key)) {
          faqs.unshift({ id: "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), question: d.question, answer: d.answer, category: d.category || "Général", created: d.created || new Date().toISOString().slice(0, 10), updated: d.updated || "" });
          added++;
        }
      });
      save();
      renderFaq();
      toast(added + " question(s) importée(s)");
    } catch (err) {
      toast("Fichier invalide");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

/* ---------- Copier les modèles ---------- */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.closest(".tpl").querySelector("pre").textContent;
    try {
      await navigator.clipboard.writeText(text);
      toast("Modèle copié !");
    } catch (err) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Modèle copié !");
    }
  });
});

/* ---------- Init ---------- */
renderFaq();
