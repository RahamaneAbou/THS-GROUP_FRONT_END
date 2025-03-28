<template>
    <div class="teachers-management">
      <h1>Gestion des professeurs</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Spécialité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td>{{ teacher.id }}</td>
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.email }}</td>
            <td>{{ teacher.specialty }}</td>
            <td>
              <button @click="editTeacher(teacher.id)">Modifier</button>
              <button @click="deleteTeacher(teacher.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeachersManagement",
    data() {
      return {
        teachers: [
          { id: 1, name: "Prof A", email: "profA@example.com", specialty: "Mathématiques" },
          { id: 2, name: "Prof B", email: "profB@example.com", specialty: "Physique" },
        ],
      };
    },
    methods: {
      editTeacher(id) {
        alert(`Modifier professeur ${id}`);
      },
      deleteTeacher(id) {
        alert(`Supprimer professeur ${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .teachers-management {
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