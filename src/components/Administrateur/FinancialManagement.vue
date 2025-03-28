<template>
    <div class="financial-management">
      <h1>Gestion financière</h1>
  
      <!-- Section des paiements des étudiants -->
      <section class="payments-section">
        <h2>Paiements des étudiants</h2>
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Montant payé</th>
              <th>Date de paiement</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.matricule }}</td>
              <td>{{ payment.name }}</td>
              <td>{{ payment.amount }} €</td>
              <td>{{ formatDate(payment.date) }}</td>
              <td :class="payment.status">{{ payment.status }}</td>
              <td>
                <button @click="viewPaymentDetails(payment.id)">Détails</button>
                <button @click="updatePaymentStatus(payment.id)">Modifier statut</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
  
      <!-- Section des bourses -->
      <section class="scholarships-section">
        <h2>Bourses et aides</h2>
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Type de bourse</th>
              <th>Montant</th>
              <th>Date d'attribution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="scholarship in scholarships" :key="scholarship.id">
              <td>{{ scholarship.studentName }}</td>
              <td>{{ scholarship.type }}</td>
              <td>{{ scholarship.amount }} €</td>
              <td>{{ formatDate(scholarship.date) }}</td>
              <td>
                <button @click="editScholarship(scholarship.id)">Modifier</button>
                <button @click="deleteScholarship(scholarship.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: "FinancialManagement",
    data() {
      return {
        // Données simulées pour les paiements
        payments: [
          {
            id: 1,
            matricule: "S001",
            name: "John Doe",
            amount: 500,
            date: new Date("2023-09-15"),
            status: "payé",
          },
          {
            id: 2,
            matricule: "S002",
            name: "Jane Smith",
            amount: 300,
            date: new Date("2023-09-16"),
            status: "en attente",
          },
        ],
        // Données simulées pour les bourses
        scholarships: [
          {
            id: 1,
            studentName: "Alice Johnson",
            type: "Bourse académique",
            amount: 800,
            date: new Date("2023-08-01"),
          },
          {
            id: 2,
            studentName: "Bob Brown",
            type: "Aide sociale",
            amount: 400,
            date: new Date("2023-07-15"),
          },
        ],
      };
    },
    methods: {
      // Méthode pour formater les dates
      formatDate(date) {
        return new Intl.DateTimeFormat("fr-FR").format(date);
      },
      // Actions pour les paiements
      viewPaymentDetails(id) {
        alert(`Voir les détails du paiement ${id}`);
      },
      updatePaymentStatus(id) {
        alert(`Mettre à jour le statut du paiement ${id}`);
      },
      // Actions pour les bourses
      editScholarship(id) {
        alert(`Modifier la bourse ${id}`);
      },
      deleteScholarship(id) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette bourse ?`)) {
          alert(`Bourse ${id} supprimée`);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .financial-management {
    padding: 20px;
  }
  
  section {
    margin-bottom: 30px;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  th {
    background-color: #003366; /* Bleu foncé */
    color: white;
  }
  
  td.payé {
    color: green;
  }
  
  td.en_attente {
    color: orange;
  }
  
  button {
    margin: 5px;
    padding: 5px 10px;
    background-color: #ffcc00; /* Jaune */
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #e6b800;
  }
  </style>