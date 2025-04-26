<template>
  <div class="task-list-container">
    <h2 class="text-2xl font-bold mb-4">任务列表</h2>
    
    <!-- 任务添加表单 -->
    <div class="add-task mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-medium mb-3">添加新任务</h3>
      <div class="mb-3">
        <input 
          v-model="newTask.name" 
          @keyup.enter="addTask"
          type="text" 
          placeholder="输入任务内容..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="flex flex-wrap gap-3 mb-3">
        <div class="priority-selector">
          <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <div class="flex space-x-2">
            <button 
              v-for="priority in store.priorities" 
              :key="priority.id"
              @click="newTask.priority = priority.id"
              :class="[
                'px-3 py-1 rounded-md text-sm border-l-4',
                priority.color,
                newTask.priority === priority.id ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              {{ priority.name }}
            </button>
          </div>
        </div>
        
        <div class="category-selector ml-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in store.categories" 
              :key="category.id"
              @click="toggleCategory(category.id)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                newTask.categories.includes(category.id) 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="addTask" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          :disabled="!newTask.name.trim()"
        >
          添加任务
        </button>
      </div>
    </div>
    
    <!-- 筛选器 -->
    <div class="filters mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 class="text-lg font-medium mb-3">筛选任务</h3>
      
      <div class="flex flex-wrap gap-4">
        <div class="priority-filter">
          <label class="block text-sm font-medium text-gray-700 mb-1">按优先级</label>
          <div class="flex space-x-2">
            <button 
              @click="store.setFilter('priority', null)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                store.activeFilters.priority === null ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              全部
            </button>
            <button 
              v-for="priority in store.priorities" 
              :key="priority.id"
              @click="store.setFilter('priority', priority.id)"
              :class="[
                'px-3 py-1 rounded-md text-sm border-l-4',
                priority.color,
                store.activeFilters.priority === priority.id ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              {{ priority.name }}
            </button>
          </div>
        </div>
        
        <div class="category-filter">
          <label class="block text-sm font-medium text-gray-700 mb-1">按分类</label>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="store.setFilter('category', null)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                store.activeFilters.category === null ? 'bg-gray-200' : 'bg-white'
              ]"
            >
              全部
            </button>
            <button 
              v-for="category in store.categories" 
              :key="category.id"
              @click="store.setFilter('category', category.id)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                store.activeFilters.category === category.id 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              ]"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center mt-3">
        <input 
          type="checkbox" 
          id="show-completed" 
          v-model="store.activeFilters.showCompleted"
          class="h-4 w-4 text-blue-600"
        />
        <label for="show-completed" class="ml-2 text-sm text-gray-700">显示已完成任务</label>
        
        <button 
          @click="store.resetFilters()" 
          class="ml-auto px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          重置筛选
        </button>
      </div>
    </div>
    
    <!-- 任务列表 -->
    <div v-if="store.filteredTasks.length === 0" class="text-center text-gray-500 py-4 bg-white rounded-lg shadow-sm">
      暂无符合条件的任务
    </div>
    
    <ul v-else class="task-items space-y-2">
      <li 
        v-for="task in store.filteredTasks" 
        :key="task.id" 
        class="task-item p-3 bg-white border rounded-lg flex items-start shadow-sm"
        :class="[
          { 'bg-gray-50': task.completed },
          getPriorityBorderClass(task.priority)
        ]"
      >
        <div class="flex-grow">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              :checked="task.completed" 
              @change="toggleTaskCompletion(task.id)" 
              class="mr-3 h-5 w-5 text-blue-600"
            />
            <span 
              :class="{ 'line-through text-gray-500': task.completed }"
              class="font-medium"
            >
              {{ task.name }}
            </span>
          </div>
          
          <!-- 任务分类标签 -->
          <div class="mt-2 flex flex-wrap gap-1 ml-8">
            <span 
              v-for="categoryId in task.categories" 
              :key="categoryId"
              class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
            >
              {{ getCategoryName(categoryId) }}
            </span>
            <span 
              v-if="task.pomodoros > 0" 
              class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 flex items-center"
            >
              🍅 {{ task.pomodoros }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- 优先级选择器 -->
          <div class="relative group">
            <button 
              class="p-1 rounded hover:bg-gray-100"
              :class="getPriorityTextClass(task.priority)"
            >
              {{ getPriorityEmoji(task.priority) }}
            </button>
            <div class="absolute right-0 mt-1 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div class="p-1">
                <button 
                  v-for="priority in store.priorities" 
                  :key="priority.id"
                  @click="updateTaskPriority(task.id, priority.id)"
                  class="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                >
                  {{ getPriorityEmoji(priority.id) }} {{ priority.name }}
                </button>
              </div>
            </div>
          </div>
          
          <button 
            @click="incrementPomodoro(task.id)" 
            class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="增加番茄数"
          >
            🍅
          </button>
          
          <button 
            @click="deleteTask(task.id)" 
            class="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="删除任务"
          >
            ❌
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { usePomodoroStore } from '../store';

const store = usePomodoroStore();

// 新任务表单数据
const newTask = reactive({
  name: '',
  priority: 'medium', // 默认中优先级
  categories: [] // 默认无分类
});

// 重置表单
function resetForm() {
  newTask.name = '';
  newTask.priority = 'medium';
  newTask.categories = [];
}

// 添加任务
function addTask() {
  if (newTask.name.trim()) {
    store.addTask({
      name: newTask.name.trim(),
      priority: newTask.priority,
      categories: [...newTask.categories]
    });
    resetForm();
  }
}

// 切换任务分类
function toggleCategory(categoryId) {
  const index = newTask.categories.indexOf(categoryId);
  if (index === -1) {
    newTask.categories.push(categoryId);
  } else {
    newTask.categories.splice(index, 1);
  }
}

// 获取分类名称
function getCategoryName(categoryId) {
  const category = store.categories.find(c => c.id === categoryId);
  return category ? category.name : '';
}

// 获取优先级边框样式
function getPriorityBorderClass(priorityId) {
  const priority = store.priorities.find(p => p.id === priorityId);
  return priority ? `border-l-4 ${priority.color}` : '';
}

// 获取优先级文本颜色
function getPriorityTextClass(priorityId) {
  switch (priorityId) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-green-600';
    default: return '';
  }
}

// 获取优先级对应的表情符号
function getPriorityEmoji(priorityId) {
  switch (priorityId) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

function toggleTaskCompletion(taskId) {
  store.toggleTaskCompletion(taskId);
}

function deleteTask(taskId) {
  store.deleteTask(taskId);
}

function incrementPomodoro(taskId) {
  store.incrementTaskPomodoro(taskId);
}

function updateTaskPriority(taskId, priorityId) {
  store.updateTaskPriority(taskId, priorityId);
}
</script>

<style scoped>
.task-list-container {
  max-width: 600px;
  margin: 0 auto;
}

.task-item {
  transition: all 0.2s ease;
}

.border-red-500 {
  border-left-color: #ef4444;
}

.border-yellow-500 {
  border-left-color: #eab308;
}

.border-green-500 {
  border-left-color: #22c55e;
}
</style>
