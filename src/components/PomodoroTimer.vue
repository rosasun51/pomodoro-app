<template>
  <div class="pomodoro-container">
    <div class="mode-selector">
      <button 
        v-for="(mode, index) in modes" 
        :key="index" 
        @click="selectMode(index)"
        :class="{ active: currentModeIndex === index }">
        {{ mode.name }}
      </button>
    </div>

    <div class="timer">
      <div class="time-display">{{ formatTime }}</div>
      <div class="controls">
        <button @click="toggleTimer">{{ isRunning ? '暂停' : '开始' }}</button>
        <button @click="resetTimer">重置</button>
      </div>
    </div>

    <div class="stats">
      <p>已完成番茄钟: {{ completedPomodoros }}</p>
      <p>当前模式: {{ modes[currentModeIndex].name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// 定义番茄钟模式
const modes = [
  { name: '工作模式', duration: 25 * 60 }, // 25分钟
  { name: '短休息', duration: 5 * 60 },    // 5分钟
  { name: '长休息', duration: 15 * 60 }    // 15分钟
];

// 状态变量
const currentModeIndex = ref(0);
const timeRemaining = ref(modes[0].duration);
const isRunning = ref(false);
const completedPomodoros = ref(0);
const pomodoroSequence = ref(0);
const timerInterval = ref(null);
const audio = ref(null);

// 格式化时间显示
const formatTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// 选择模式
const selectMode = (index) => {
  if (isRunning.value) {
    stopTimer();
  }
  currentModeIndex.value = index;
  timeRemaining.value = modes[index].duration;
};

// 开始/暂停计时器
const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

// 开始计时器
const startTimer = () => {
  isRunning.value = true;
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      completeTimer();
    }
  }, 1000);
};

// 停止计时器
const stopTimer = () => {
  isRunning.value = false;
  clearInterval(timerInterval.value);
};

// 重置计时器
const resetTimer = () => {
  stopTimer();
  timeRemaining.value = modes[currentModeIndex.value].duration;
};

// 完成当前计时
const completeTimer = () => {
  stopTimer();
  playNotification();
  
  // 如果完成的是工作模式
  if (currentModeIndex.value === 0) {
    completedPomodoros.value++;
    pomodoroSequence.value++;
    
    // 每完成4个番茄钟后进入长休息
    if (pomodoroSequence.value >= 4) {
      currentModeIndex.value = 2; // 长休息
      pomodoroSequence.value = 0;
    } else {
      currentModeIndex.value = 1; // 短休息
    }
  } else {
    // 休息结束后回到工作模式
    currentModeIndex.value = 0;
  }
  
  // 重置时间并自动开始下一个模式
  timeRemaining.value = modes[currentModeIndex.value].duration;
  startTimer();
};

// 播放提示音
const playNotification = () => {
  if (audio.value) {
    audio.value.currentTime = 0;
    audio.value.play();
  }
};

// 组件挂载时初始化音频
onMounted(() => {
  audio.value = new Audio('/notification.mp3');
});

// 组件卸载时清理
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.pomodoro-container {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.mode-selector button {
  background-color: #f1f1f1;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-selector button.active {
  background-color: #e74c3c;
  color: white;
}

.timer {
  margin-bottom: 20px;
}

.time-display {
  font-size: 4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.controls button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.controls button:hover {
  background-color: #2980b9;
}

.stats {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .time-display {
    font-size: 3rem;
  }
  
  .mode-selector {
    flex-direction: column;
  }
  
  .mode-selector button {
    margin: 5px 0;
  }
  
  .controls button {
    padding: 8px 15px;
    margin: 0 5px;
  }
}
</style>
