<template>
    <div>
      <p>Bonjour</p>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "text",
    props: ["message"],
  };
  </script>
  