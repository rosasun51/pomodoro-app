import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usePomodoroStore = defineStore('pomodoro', () => {
  // 状态
  const mode = ref('work'); // 'work', 'shortBreak', 'longBreak'
  const timeLeft = ref(25 * 60); // 默认25分钟，以秒为单位
  const isActive = ref(false);
  const completedPomodoros = ref(0);
  const pomodoroSequence = ref(0);
  const tasks = ref([]);
  const intervalId = ref(null);
  
  // 任务分类和筛选
  const categories = ref([
    { id: 1, name: '工作' },
    { id: 2, name: '学习' },
    { id: 3, name: '个人' },
    { id: 4, name: '其他' }
  ]);
  
  const priorities = ref([
    { id: 'high', name: '高', color: 'border-red-500' },
    { id: 'medium', name: '中', color: 'border-yellow-500' },
    { id: 'low', name: '低', color: 'border-green-500' }
  ]);
  
  const activeFilters = ref({
    priority: null,
    category: null,
    showCompleted: true
  });

  // 计算属性
  const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const modeConfig = computed(() => {
    switch (mode.value) {
      case 'work':
        return { 
          duration: 25 * 60, 
          label: '工作模式',
          color: 'bg-red-500'
        };
      case 'shortBreak':
        return { 
          duration: 5 * 60, 
          label: '短休息',
          color: 'bg-green-500'
        };
      case 'longBreak':
        return { 
          duration: 15 * 60, 
          label: '长休息',
          color: 'bg-blue-500'
        };
      default:
        return { 
          duration: 25 * 60, 
          label: '工作模式',
          color: 'bg-red-500'
        };
    }
  });
  
  // 过滤后的任务列表
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      // 根据完成状态筛选
      if (!activeFilters.value.showCompleted && task.completed) {
        return false;
      }
      
      // 根据优先级筛选
      if (activeFilters.value.priority && task.priority !== activeFilters.value.priority) {
        return false;
      }
      
      // 根据分类筛选
      if (activeFilters.value.category && !task.categories.includes(activeFilters.value.category)) {
        return false;
      }
      
      return true;
    });
  });

  // 方法
  function setMode(newMode) {
    mode.value = newMode;
    resetTimer();
  }

  function startTimer() {
    if (!isActive.value) {
      isActive.value = true;
      intervalId.value = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          completeTimer();
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    if (isActive.value) {
      isActive.value = false;
      clearInterval(intervalId.value);
    }
  }

  function resetTimer() {
    pauseTimer();
    timeLeft.value = modeConfig.value.duration;
  }

  function completeTimer() {
    // 使用基础路径访问通知音频文件
    const audio = new Audio(import.meta.env.BASE_URL + 'notification.mp3');
    audio.play().catch(error => console.error('播放通知音频失败:', error));
    
    pauseTimer();
    
    if (mode.value === 'work') {
      completedPomodoros.value++;
      pomodoroSequence.value++;
      
      if (pomodoroSequence.value >= 4) {
        pomodoroSequence.value = 0;
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
    
    startTimer(); // 自动开始下一个计时
  }

  function addTask(taskData) {
    tasks.value.push({
      id: Date.now(),
      name: taskData.name,
      priority: taskData.priority || 'medium', // 默认中优先级
      categories: taskData.categories || [], // 默认无分类
      completed: false,
      pomodoros: 0,
      createdAt: new Date()
    });
  }

  function toggleTaskCompletion(taskId) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }

  function deleteTask(taskId) {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
  }

  function incrementTaskPomodoro(taskId) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.pomodoros++;
    }
  }
  
  function updateTaskPriority(taskId, priority) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.priority = priority;
    }
  }
  
  function addTaskCategory(taskId, categoryId) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task && !task.categories.includes(categoryId)) {
      task.categories.push(categoryId);
    }
  }
  
  function removeTaskCategory(taskId, categoryId) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.categories = task.categories.filter(id => id !== categoryId);
    }
  }
  
  function setFilter(filterType, value) {
    activeFilters.value[filterType] = value;
  }
  
  function resetFilters() {
    activeFilters.value = {
      priority: null,
      category: null,
      showCompleted: true
    };
  }
  
  function addCategory(name) {
    const maxId = Math.max(0, ...categories.value.map(c => c.id));
    categories.value.push({
      id: maxId + 1,
      name
    });
  }

  return {
    mode,
    timeLeft,
    isActive,
    completedPomodoros,
    tasks,
    categories,
    priorities,
    activeFilters,
    filteredTasks,
    formattedTimeLeft,
    modeConfig,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    incrementTaskPomodoro,
    updateTaskPriority,
    addTaskCategory,
    removeTaskCategory,
    setFilter,
    resetFilters,
    addCategory
  };
});
