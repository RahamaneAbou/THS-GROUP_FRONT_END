<template>
    <div class="promotions-management">
      <h1>Gestion des promotions/filieres</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Nombre d'étudiants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="promotion in promotions" :key="promotion.id">
            <td>{{ promotion.id }}</td>
            <td>{{ promotion.name }}</td>
            <td>{{ promotion.studentCount }}</td>
            <td>
              <button @click="editPromotion(promotion.id)">Modifier</button>
              <button @click="deletePromotion(promotion.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "PromotionsManagement",
    data() {
      return {
        promotions: [
          { id: 1, name: "Filière A", studentCount: 50 },
          { id: 2, name: "Filière B", studentCount: 30 },
        ],
      };
    },
    methods: {
      editPromotion(id) {
        alert(`Modifier promotion ${id}`);
      },
      deletePromotion(id) {
        alert(`Supprimer promotion ${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .promotions-management {
    padding: 20px;
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