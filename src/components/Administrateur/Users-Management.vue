<template>
    <div class="users-management">
      <h1>Gestion des utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="editUser(user.id)">Modifier</button>
              <button @click="deleteUser(user.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "UsersManagement",
    data() {
      return {
        users: [
          { id: 1, name: "John Doe", email: "john@example.com", role: "étudiant" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "professeur" },
        ],
      };
    },
    methods: {
      editUser(id) {
        alert(`Modifier utilisateur ${id}`);
      },
      deleteUser(id) {
        alert(`Supprimer utilisateur ${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .users-management {
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
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