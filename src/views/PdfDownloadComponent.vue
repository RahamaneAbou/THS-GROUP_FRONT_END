<template>
    <div>
      <button @click="generatePdf">Télécharger le Bulletin</button>
    </div>
  </template>
  
  <script>
  import { jsPDF } from "jspdf";
  import axios from "axios";
  
  export default {
    name: "PdfDownloadComponent",
    props: {
      id: {
        type: String, // L'ID de l'étudiant passé via les paramètres de route
        required: true,
      },
    },
    data() {
      return {
        etudiant: null,
        notes: [],
      };
    },
    async created() {
      // Récupérer les données de l'étudiant et ses notes depuis l'API
      await this.fetchEtudiantData();
    },
    methods: {
      async fetchEtudiantData() {
        try {
          // Récupérer les informations de l'étudiant
          const etudiantResponse = await axios.get(`/THS-GROUP/etudiants/${this.id}`);
          this.etudiant = etudiantResponse.data;
  
          // Récupérer les notes de l'étudiant
          const notesResponse = await axios.get(`/THS-GROUP/notes/etudiant/${this.id}`);
          this.notes = notesResponse.data;
        } catch (error) {
          console.error("Erreur lors de la récupération des données de l'étudiant :", error);
        }
      },
      generatePdf() {
        if (!this.etudiant || !this.notes) {
          alert("Données de l'étudiant non disponibles.");
          return;
        }
  
        const doc = new jsPDF();
  
        // Ajouter un titre
        doc.setFontSize(20);
        doc.text("Bulletin de Notes", 10, 10);
  
        // Ajouter les informations de l'étudiant
        let yPos = 20;
        doc.setFontSize(14);
        doc.text(`Nom : ${this.etudiant.nom}`, 10, yPos);
        yPos += 10;
        doc.text(`Prénom : ${this.etudiant.prenom}`, 10, yPos);
        yPos += 10;
        doc.text(`Numéro Matricule : ${this.etudiant.numMatricule}`, 10, yPos);
        yPos += 15;
  
        // Ajouter un tableau des notes
        doc.setFontSize(12);
        doc.text("Liste des Notes :", 10, yPos);
        yPos += 10;
  
        const tableHeaders = ["Cours", "Note", "Date Attribution"];
        const tableData = this.notes.map((note) => [
          note.cours.nom,
          note.valeur,
          new Date(note.dateAttribution).toLocaleDateString(),
        ]);
  
        function drawTable(headers, data, startX, startY) {
          let x = startX;
          let y = startY;
          const cellWidth = 60;
          const cellHeight = 10;
  
          // Dessiner les en-têtes
          headers.forEach((header, index) => {
            doc.rect(x, y, cellWidth, cellHeight);
            doc.text(header, x + 5, y + cellHeight - 2);
            x += cellWidth;
          });
          y += cellHeight;
  
          // Dessiner les données
          data.forEach((row) => {
            x = startX;
            row.forEach((cell) => {
              doc.rect(x, y, cellWidth, cellHeight);
              doc.text(cell.toString(), x + 5, y + cellHeight - 2);
              x += cellWidth;
            });
            y += cellHeight;
          });
  
          return y; // Retourner la position finale du curseur Y
        }
  
        // Dessiner le tableau
        yPos = drawTable(tableHeaders, tableData, 10, yPos);
  
        // Sauvegarder le PDF
        doc.save(`${this.etudiant.numMatricule}_bulletin.pdf`);
      },
    },
  };
  </script>