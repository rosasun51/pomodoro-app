<template>
  <div class="task-manager">
    <h2>任务管理</h2>
    
    <div class="task-form">
      <input 
        type="text" 
        v-model="newTask" 
        @keyup.enter="addTask" 
        placeholder="添加新任务..." 
      />
      <button @click="addTask">添加</button>
    </div>
    
    <div class="task-list" v-if="tasks.length > 0">
      <div 
        v-for="(task, index) in tasks" 
        :key="index" 
        class="task-item"
        :class="{ 'completed': task.completed }"
      >
        <div class="task-content">
          <input 
            type="checkbox" 
            :checked="task.completed" 
            @change="toggleTaskStatus(index)" 
          />
          <span>{{ task.text }}</span>
        </div>
        <button @click="deleteTask(index)" class="delete-btn">删除</button>
      </div>
    </div>
    
    <p v-else class="no-tasks">暂无任务</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 任务列表
const tasks = ref([]);
const newTask = ref('');

// 从本地存储加载任务
onMounted(() => {
  const savedTasks = localStorage.getItem('pomodoro-tasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

// 保存任务到本地存储
const saveTasks = () => {
  localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks.value));
};

// 添加新任务
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false
    });
    newTask.value = '';
    saveTasks();
  }
};

// 切换任务状态
const toggleTaskStatus = (index) => {
  tasks.value[index].completed = !tasks.value[index].completed;
  saveTasks();
};

// 删除任务
const deleteTask = (index) => {
  tasks.value.splice(index, 1);
  saveTasks();
};
</script>

<style scoped>
.task-manager {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
}

.task-form {
  display: flex;
  margin-bottom: 20px;
}

.task-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  font-size: 1rem;
}

.task-form button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-size: 1rem;
}

.task-form button:hover {
  background-color: #219653;
}

.task-list {
  max-height: 300px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.task-item:hover {
  background-color: #f1f1f1;
}

.task-content {
  display: flex;
  align-items: center;
}

.task-content input[type="checkbox"] {
  margin-right: 10px;
}

.completed span {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.no-tasks {
  color: #888;
  text-align: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .task-form {
    flex-direction: column;
  }
  
  .task-form input {
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .task-form button {
    border-radius: 5px;
  }
}
</style>
