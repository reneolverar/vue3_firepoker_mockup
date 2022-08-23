<template>
  <router-link
      class="card-link"
      :to="{name: 'GameView', params: {id: game.id}}"
    >
    <div class="card -shadow">
      <div>
        <h4 class="title">{{ game.name }}</h4>
        <span>{{ game.description }}</span>
        <p>{{ game.participants.length }} participant(s)</p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
  import { defineProps } from "vue";

  const props = defineProps({
      game: {
          type: Object,
          required: true,
      }
  })
</script>

<style scoped>
.card {
  padding: 20px;
  width: 200px;
  height: 120px;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}

.card-link {
  color: #2c3e50;
  text-decoration: none;
}
</style>
