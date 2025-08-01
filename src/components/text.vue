<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <h1 class="title">🎯 Système d'Attribution de Projets</h1>
        <p class="subtitle">Attribution aléatoire de 3 projets par étudiant</p>
      </header>

      <div class="content">
        <div class="section">
          <h2 class="section-title">👥 Étudiants ({{ etudiants.length }})</h2>
          <div class="students-grid">
            <div v-for="etudiant in etudiants" :key="etudiant" class="student-card">
              {{ etudiant }}
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">📚 Projets Disponibles ({{ projets.length }})</h2>
          <div class="projects-list">
            <div v-for="projet in projets" :key="projet.id" class="project-card">
              <h3 class="project-title">{{ projet.nom }}</h3>
              <div class="project-details">
                <div class="detail-item">
                  <span class="detail-label">Collections:</span>
                  <span class="detail-value">{{ projet.collections.join(', ') }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Spécificités:</span>
                  <span class="detail-value">{{ projet.specificites }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Rôles:</span>
                  <span class="detail-value">{{ projet.roles.join(', ') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <button 
            @click="effectuerTirage" 
            class="tirage-btn"
            :disabled="tirageEnCours"
          >
            <span v-if="!tirageEnCours">🎲 Effectuer le Tirage</span>
            <span v-else>⏳ Tirage en cours...</span>
          </button>
        </div>

        <div v-if="attributions.length > 0" class="results-section">
          <h2 class="section-title">🎉 Résultats du Tirage</h2>
          <div class="results-grid">
            <div v-for="attribution in attributions" :key="attribution.etudiant" class="result-card">
              <h3 class="student-name">{{ attribution.etudiant }}</h3>
              <div class="assigned-projects">
                <div v-for="projet in attribution.projets" :key="projet" class="assigned-project">
                  {{ projet }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="export-section">
            <button @click="exporterResultats" class="export-btn">
              📄 Exporter les Résultats
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TirageProjets',
  data() {
    return {
      tirageEnCours: false,
      etudiants: [
        'ABOU-BAKARI', 'esther_1', 'esther_2', 'KOKOUVI', 'henock', 
        'edmond', 'nabik', 'eric', 'epkai', 'niane', 'abalo', 
        'julie', 'kam','MELIND','PAKA'
      ],
projets: [
  {
    id: 1,
    nom: 'Marketplace de Livres',
    collections: ['users', 'books', 'orders', 'reviews', 'categories'],
    specificites: 'Système de notation, recherche avancée, gestion stock',
    roles: ['client', 'vendeur', 'admin']
  },
  {
    id: 2,
    nom: 'Plateforme de Vêtements',
    collections: ['users', 'products', 'orders', 'cart', 'sizes', 'colors'],
    specificites: 'Variantes produits, wishlist, promotions',
    roles: ['client', 'vendeur', 'admin']
  },
  {
    id: 3,
    nom: 'Épicerie en Ligne',
    collections: ['users', 'products', 'orders', 'categories', 'suppliers'],
    specificites: 'Gestion péremption, livraison par zones',
    roles: ['client', 'gérant', 'livreur', 'admin']
  },
  {
    id: 4,
    nom: 'Marketplace Électronique',
    collections: ['users', 'products', 'orders', 'warranties', 'brands'],
    specificites: 'Garanties, comparaisons, spécifications techniques',
    roles: ['client', 'vendeur', 'technicien', 'admin']
  },
  {
    id: 5,
    nom: 'Boutique d\'Art et Artisanat',
    collections: ['users', 'artworks', 'orders', 'artists', 'exhibitions'],
    specificites: 'Galerie virtuelle, commandes personnalisées',
    roles: ['client', 'artiste', 'curateur', 'admin']
  },
  {
    id: 6,
    nom: 'Plateforme de Livraison de Repas',
    collections: ['users', 'restaurants', 'orders', 'dishes', 'deliveries'],
    specificites: 'Géolocalisation, temps de livraison, notation',
    roles: ['client', 'restaurant', 'livreur', 'admin']
  },
  {
    id: 7,
    nom: 'Réservation de Restaurants',
    collections: ['users', 'restaurants', 'reservations', 'tables', 'menus'],
    specificites: 'Disponibilités, préférences alimentaires',
    roles: ['client', 'restaurant', 'serveur', 'admin']
  },
  {
    id: 8,
    nom: 'Commande de Café/Boulangerie',
    collections: ['users', 'products', 'orders', 'stores', 'loyalty'],
    specificites: 'Programme fidélité, commande à l\'avance',
    roles: ['client', 'barista', 'gérant', 'admin']
  },
  {
    id: 9,
    nom: 'Plateforme de Recettes',
    collections: ['users', 'recipes', 'ingredients', 'comments', 'favorites'],
    specificites: 'Nutrition, temps de préparation, difficulté',
    roles: ['utilisateur', 'chef', 'nutritionniste', 'admin']
  },
  {
    id: 10,
    nom: 'Service de Traiteur',
    collections: ['users', 'events', 'menus', 'orders', 'staff'],
    specificites: 'Événements, devis, planning',
    roles: ['client', 'traiteur', 'serveur', 'admin']
  },
  {
    id: 11,
    nom: 'Gestion de Cabinet Médical',
    collections: ['users', 'patients', 'appointments', 'doctors', 'prescriptions'],
    specificites: 'Dossiers médicaux, planning, rappels',
    roles: ['patient', 'médecin', 'secrétaire', 'admin']
  },
  {
    id: 12,
    nom: 'Plateforme de Fitness',
    collections: ['users', 'workouts', 'exercises', 'progress', 'trainers'],
    specificites: 'Programmes personnalisés, suivi progression',
    roles: ['membre', 'coach', 'nutritionniste', 'admin']
  },
  {
    id: 13,
    nom: 'Pharmacie en Ligne',
    collections: ['users', 'medicines', 'orders', 'prescriptions', 'inventory'],
    specificites: 'Ordonnances, interactions médicamenteuses',
    roles: ['client', 'pharmacien', 'médecin', 'admin']
  },
  {
    id: 14,
    nom: 'Plateforme de Téléconsultation',
    collections: ['users', 'consultations', 'doctors', 'payments', 'reports'],
    specificites: 'Vidéoconférence, dossiers patients',
    roles: ['patient', 'médecin', 'admin']
  },
  {
    id: 15,
    nom: 'Gestion de Spa/Wellness',
    collections: ['users', 'services', 'appointments', 'therapists', 'packages'],
    specificites: 'Forfaits, disponibilités, préférences',
    roles: ['client', 'thérapeute', 'réceptionniste', 'admin']
  },
  {
    id: 16,
    nom: 'Plateforme E-learning',
    collections: ['users', 'courses', 'lessons', 'enrollments', 'progress'],
    specificites: 'Vidéos, quiz, certificats, progression',
    roles: ['étudiant', 'instructeur', 'admin']
  },
  {
    id: 17,
    nom: 'Gestion d\'École/Université',
    collections: ['users', 'students', 'courses', 'grades', 'schedules'],
    specificites: 'Notes, emplois du temps, absences',
    roles: ['étudiant', 'professeur', 'admin']
  },
  {
    id: 18,
    nom: 'Bibliothèque Numérique',
    collections: ['users', 'books', 'loans', 'reservations', 'fines'],
    specificites: 'Emprunts, réservations, amendes',
    roles: ['lecteur', 'bibliothécaire', 'admin']
  },
  {
    id: 19,
    nom: 'Plateforme de Tutorat',
    collections: ['users', 'sessions', 'subjects', 'payments', 'reviews'],
    specificites: 'Matching étudiant-tuteur, planning',
    roles: ['étudiant', 'tuteur', 'admin']
  },
  {
    id: 20,
    nom: 'Formation Professionnelle',
    collections: ['users', 'trainings', 'certifications', 'companies', 'evaluations'],
    specificites: 'Compétences, certifications, évaluations',
    roles: ['apprenant', 'formateur', 'entreprise', 'admin']
  },
  {
    id: 21,
    nom: 'Plateforme Immobilière',
    collections: ['users', 'properties', 'visits', 'contracts', 'agents'],
    specificites: 'Recherche multicritères, visites virtuelles',
    roles: ['client', 'agent', 'propriétaire', 'admin']
  },
  {
    id: 22,
    nom: 'Location de Véhicules',
    collections: ['users', 'vehicles', 'rentals', 'payments', 'maintenance'],
    specificites: 'Disponibilités, assurances, entretien',
    roles: ['client', 'agent', 'mécanicien', 'admin']
  },
  {
    id: 23,
    nom: 'Services à Domicile',
    collections: ['users', 'services', 'bookings', 'providers', 'reviews'],
    specificites: 'Géolocalisation, disponibilités, évaluations',
    roles: ['client', 'prestataire', 'admin']
  },
  {
    id: 24,
    nom: 'Covoiturage',
    collections: ['users', 'trips', 'bookings', 'vehicles', 'payments'],
    specificites: 'Itinéraires, partage coûts, évaluations',
    roles: ['conducteur', 'passager', 'admin']
  },
  {
    id: 25,
    nom: 'Gestion Hôtelière',
    collections: ['users', 'rooms', 'bookings', 'services', 'payments'],
    specificites: 'Disponibilités, services additionnels',
    roles: ['client', 'réceptionniste', 'femme de chambre', 'admin']
  },
  {
    id: 26,
    nom: 'Plateforme de Streaming Vidéo',
    collections: ['users', 'videos', 'playlists', 'subscriptions', 'views'],
    specificites: 'Recommandations, historique, abonnements',
    roles: ['viewer', 'creator', 'moderator', 'admin']
  },
  {
    id: 27,
    nom: 'Réseau Social',
    collections: ['users', 'posts', 'comments', 'friends', 'messages'],
    specificites: 'Timeline, notifications, messagerie',
    roles: ['utilisateur', 'modérateur', 'admin']
  },
  {
    id: 28,
    nom: 'Plateforme de Jeux',
    collections: ['users', 'games', 'scores', 'tournaments', 'achievements'],
    specificites: 'Classements, tournois, succès',
    roles: ['joueur', 'organisateur', 'admin']
  },
  {
    id: 29,
    nom: 'Billetterie Événements',
    collections: ['users', 'events', 'tickets', 'venues', 'payments'],
    specificites: 'Places numérotées, catégories, promotions',
    roles: ['client', 'organisateur', 'contrôleur', 'admin']
  },
  {
    id: 30,
    nom: 'Plateforme de Musique',
    collections: ['users', 'songs', 'albums', 'playlists', 'artists'],
    specificites: 'Streaming, playlists, découverte',
    roles: ['auditeur', 'artiste', 'label', 'admin']
  },
  {
    id: 31,
    nom: 'CRM d\'Entreprise',
    collections: ['users', 'clients', 'leads', 'opportunities', 'activities'],
    specificites: 'Pipeline ventes, suivi prospects',
    roles: ['commercial', 'manager', 'admin']
  },
  {
    id: 32,
    nom: 'Gestion de Projets',
    collections: ['users', 'projects', 'tasks', 'teams', 'timesheets'],
    specificites: 'Gantt, collaboration, suivi temps',
    roles: ['membre', 'chef projet', 'admin']
  },
  {
    id: 33,
    nom: 'Plateforme Freelance',
    collections: ['users', 'projects', 'proposals', 'contracts', 'payments'],
    specificites: 'Matching compétences, évaluations',
    roles: ['client', 'freelance', 'admin']
  },
  {
    id: 34,
    nom: 'Gestion d\'Inventaire',
    collections: ['users', 'products', 'stocks', 'movements', 'suppliers'],
    specificites: 'Alertes stock, commandes automatiques',
    roles: ['gestionnaire', 'acheteur', 'admin']
  },
  {
    id: 35,
    nom: 'Plateforme de Facturation',
    collections: ['users', 'invoices', 'clients', 'products', 'payments'],
    specificites: 'Devis, factures, relances',
    roles: ['comptable', 'commercial', 'admin']
  },
  {
    id: 36,
    nom: 'Marketplace Produits Bio',
    collections: ['users', 'products', 'orders', 'producers', 'certifications'],
    specificites: 'Labels bio, traçabilité, circuits courts',
    roles: ['consommateur', 'producteur', 'certificateur', 'admin']
  },
  {
    id: 37,
    nom: 'Plateforme de Recyclage',
    collections: ['users', 'items', 'collections', 'centers', 'rewards'],
    specificites: 'Points fidélité, géolocalisation centres',
    roles: ['citoyen', 'centre recyclage', 'admin']
  },
  {
    id: 38,
    nom: 'Covoiturage Écologique',
    collections: ['users', 'trips', 'vehicles', 'emissions', 'rewards'],
    specificites: 'Calcul empreinte carbone, récompenses',
    roles: ['conducteur', 'passager', 'admin']
  },
  {
    id: 39,
    nom: 'Plateforme d\'Énergie Verte',
    collections: ['users', 'installations', 'productions', 'consumptions', 'contracts'],
    specificites: 'Suivi production solaire, revente énergie',
    roles: ['producteur', 'consommateur', 'admin']
  },
  {
    id: 40,
    nom: 'Jardinage Communautaire',
    collections: ['users', 'gardens', 'plots', 'plants', 'harvests'],
    specificites: 'Gestion parcelles, conseils jardinage',
    roles: ['jardinier', 'expert', 'admin']
  },
  {
    id: 41,
    nom: 'Gestion de Flotte de Transport Public',
    collections: ['users', 'vehicles', 'routes', 'schedules', 'maintenance_logs'],
    specificites: 'Suivi GPS, alertes pannes, planification horaire',
    roles: ['conducteur', 'superviseur', 'agent maintenance', 'admin']
  },
  {
    id: 42,
    nom: 'Plateforme de Covoiturage Local',
    collections: ['users', 'rides', 'vehicles', 'reservations', 'reviews'],
    specificites: 'Géolocalisation, notation des trajets, suggestion intelligente',
    roles: ['conducteur', 'passager', 'modérateur', 'admin']
  },
  {
    id: 43,
    nom: 'Gestion de Livraisons Urbaines',
    collections: ['users', 'deliveries', 'couriers', 'routes', 'packages'],
    specificites: 'Suivi en temps réel, preuve de livraison, optimisation de trajets',
    roles: ['livreur', 'client', 'planificateur', 'admin']
  },
  {
    id: 44,
    nom: 'Application de Stationnement Intelligent',
    collections: ['users', 'parkings', 'reservations', 'tarifs', 'historiques'],
    specificites: 'Paiement mobile, disponibilité en temps réel, QR code',
    roles: ['usager', 'opérateur parking', 'gestionnaire', 'admin']
  },
  {
    id: 45,
    nom: 'Portail d’Actualités Personnalisées',
    collections: ['users', 'articles', 'categories', 'sources', 'bookmarks'],
    specificites: 'Recommandation IA, filtrage par intérêt, veille personnalisée',
    roles: ['lecteur', 'rédacteur', 'éditeur', 'admin']
  },
  {
    id: 46,
    nom: 'Plateforme de Fact-checking Collaboratif',
    collections: ['users', 'claims', 'sources', 'verifications', 'votes'],
    specificites: 'Système de vote, niveau de fiabilité, historique des sources',
    roles: ['utilisateur', 'analyste', 'vérificateur', 'admin']
  },
  {
    id: 47,
    nom: 'Journal Participatif Communautaire',
    collections: ['users', 'articles', 'commentaires', 'tags', 'réactions'],
    specificites: 'Rédaction ouverte, modération collaborative, sections locales',
    roles: ['contributeur', 'modérateur', 'lecteur', 'admin']
  },
  {
    id: 48,
    nom: 'Agrégateur d’Infos de Transport en Temps Réel',
    collections: ['users', 'lines', 'incidents', 'alerts', 'subscriptions'],
    specificites: 'Alertes trafic, notifications personnalisées, API des réseaux urbains',
    roles: ['voyageur', 'opérateur', 'analyste', 'admin']
  }
]
,
      attributions: []
    }
  },
  methods: {
    async effectuerTirage() {
      this.tirageEnCours = true;
      
      // Simulation d'un délai pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer une liste de projets répétés pour avoir assez d'attributions
      const projetsRepetes = [];
      const nombreAttributionsNecessaires = this.etudiants.length * 3;
      
      // Répéter les projets jusqu'à avoir assez d'attributions
      while (projetsRepetes.length < nombreAttributionsNecessaires) {
        this.projets.forEach(projet => {
          if (projetsRepetes.length < nombreAttributionsNecessaires) {
            projetsRepetes.push(projet.nom);
          }
        });
      }
      
      // Mélanger la liste des projets
      const projetsMelanges = this.melangerTableau([...projetsRepetes]);
      
      // Attribuer 3 projets à chaque étudiant
      this.attributions = [];
      for (let i = 0; i < this.etudiants.length; i++) {
        const projetsEtudiant = projetsMelanges.slice(i * 3, (i + 1) * 3);
        this.attributions.push({
          etudiant: this.etudiants[i],
          projets: projetsEtudiant
        });
      }
      
      this.tirageEnCours = false;
    },
    
    melangerTableau(tableau) {
      const nouveauTableau = [...tableau];
      for (let i = nouveauTableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nouveauTableau[i], nouveauTableau[j]] = [nouveauTableau[j], nouveauTableau[i]];
      }
      return nouveauTableau;
    },
    
    exporterResultats() {
      let contenu = 'RÉSULTATS DU TIRAGE DE PROJETS\n';
      contenu += '================================\n\n';
      
      this.attributions.forEach((attribution, index) => {
        contenu += `${index + 1}. ${attribution.etudiant}\n`;
        attribution.projets.forEach((projet, i) => {
          contenu += `   ${i + 1}. ${projet}\n`;
        });
        contenu += '\n';
      });
      
      const blob = new Blob([contenu], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tirage-projets.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  font-weight: 300;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #f1f5f9;
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.student-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.student-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.projects-list {
  display: grid;
  gap: 1.5rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1rem;
}

.project-details {
  display: grid;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-label {
  font-weight: 600;
  color: #94a3b8;
  min-width: 100px;
}

.detail-value {
  color: #e2e8f0;
  flex: 1;
}

.action-section {
  text-align: center;
  margin: 3rem 0;
}

.tirage-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.tirage-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.tirage-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.results-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-card {
  background: rgba(102, 126, 234, 0.1);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.result-card:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.student-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 1rem;
  text-align: center;
}

.assigned-projects {
  display: grid;
  gap: 0.75rem;
}

.assigned-project {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  border-left: 3px solid #667eea;
}

.export-section {
  text-align: center;
}

.export-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .students-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    min-width: auto;
  }
}
</style>