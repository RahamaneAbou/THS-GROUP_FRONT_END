<template>
    <div class="courses-management">
      <h1>Gestion des cours</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Professeur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.title }}</td>
            <td>{{ course.teacher }}</td>
            <td>
              <button @click="editCourse(course.id)">Modifier</button>
              <button @click="deleteCourse(course.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "CoursesManagement",
    data() {
      return {
        courses: [
          { id: 1, title: "Algèbre", teacher: "Prof A" },
          { id: 2, title: "Analyse", teacher: "Prof B" },
        ],
      };
    },
    methods: {
      editCourse(id) {
        alert(`Modifier cours ${id}`);
      },
      deleteCourse(id) {
        alert(`Supprimer cours ${id}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .courses-management {
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