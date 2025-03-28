<template>
    <div class="students-management">
      <h1>Gestion des étudiants</h1>
      <table>
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Filière</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.matricule }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.program }}</td>
            <td>
              <button @click="editStudent(student.id)">Modifier</button>
              <button @click="deleteStudent(student.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentsManagement",
    data() {
      return {
        students: [
          { id: 1, matricule: "S001", name: "John Doe", email: "john@example.com", program: "Informatique" },
          { id: 2, matricule: "S002", name: "Jane Smith", email: "jane@example.com", program: "Mathématiques" },
        ],
      };
    },
    methods: {
      editStudent(id) {
        alert(`Modifier étudiant ${id}`);
      },
      deleteStudent(id) {
        alert(`Supprimer étudiant ${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .students-management {
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