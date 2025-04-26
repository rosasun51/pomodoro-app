<template>
  <div class="app-container min-h-screen flex flex-col items-center justify-center p-4">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-2">番茄钟应用</h1>
      <p class="text-gray-600">提高专注力，高效管理时间</p>
    </header>
    
    <main class="w-full max-w-2xl">
      <Timer class="mb-10" />
      <TaskList />
    </main>
    
    <footer class="mt-auto pt-8 text-center text-gray-500 text-sm">
      <p>© {{ new Date().getFullYear() }} 番茄钟应用 - 基于 Vue 3 + Vite</p>
    </footer>
  </div>
</template>

<script setup>
import Timer from './components/Timer.vue';
import TaskList from './components/TaskList.vue';
</script>

<style>
.app-container {
  transition: all 0.3s ease;
}
</style>
