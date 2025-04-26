<template>
  <div class="timer-container">
    <div class="mode-selector mb-4 flex justify-center space-x-2">
      <button 
        @click="store.setMode('work')" 
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          store.mode === 'work' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        工作模式
      </button>
      <button 
        @click="store.setMode('shortBreak')" 
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          store.mode === 'shortBreak' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        短休息
      </button>
      <button 
        @click="store.setMode('longBreak')" 
        :class="[
          'px-4 py-2 rounded-lg transition-colors',
          store.mode === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
        ]"
      >
        长休息
      </button>
    </div>

    <div 
      class="timer-display text-8xl font-bold mb-8 p-8 rounded-full w-64 h-64 flex items-center justify-center mx-auto"
      :class="store.modeConfig.color"
    >
      {{ store.formattedTimeLeft }}
    </div>

    <div class="timer-controls flex justify-center space-x-4">
      <button 
        @click="store.isActive ? store.pauseTimer() : store.startTimer()" 
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ store.isActive ? '暂停' : '开始' }}
      </button>
      <button 
        @click="store.resetTimer()" 
        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        重置
      </button>
    </div>

    <div class="completed-pomodoros mt-6 text-center">
      <p class="text-lg">已完成番茄钟: <span class="font-bold">{{ store.completedPomodoros }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { usePomodoroStore } from '../store';

const store = usePomodoroStore();
</script>

<style scoped>
.timer-container {
  max-width: 500px;
  margin: 0 auto;
}

.timer-display {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}
</style>
