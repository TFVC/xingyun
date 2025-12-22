<template>
  <a-config-provider :theme="{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#6366f1' } }">
    <NebulaBackground />
    
    <div class="app-container">
      <transition name="fade" mode="out-in">
        <Dashboard 
          v-if="currentView === 'home'" 
          @open-tool="navigateToTool" 
        />
        
        <div v-else-if="currentView === 'video-generator'" class="tool-wrapper">
          <header class="tool-header">
            <button class="back-btn" @click="currentView = 'home'">
              <span class="arrow">←</span> 返回星云工具箱
            </button>
            <span class="tool-title">轻视频生成</span>
          </header>
          <div class="tool-content">
            <Generator />
          </div>
        </div>
      </transition>
    </div>
  </a-config-provider>
</template>

<script setup>
import { ref } from 'vue';
import { theme } from 'ant-design-vue';
import NebulaBackground from './components/NebulaBackground.vue';
import Dashboard from './components/Dashboard.vue';
import Generator from './components/Generator.vue';

const currentView = ref('home');

const navigateToTool = (toolId) => {
  currentView.value = toolId;
};
</script>

<style>
/* Global Reset & Base Styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0f172a; /* Fallback */
  color: #e2e8f0;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #1e293b; 
}
::-webkit-scrollbar-thumb {
  background: #475569; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #64748b; 
}

.app-container {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.tool-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  animation: fade-in 0.5s ease-out;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-2px);
}

.back-btn .arrow {
  margin-right: 8px;
  font-size: 1.2rem;
}

.tool-title {
  margin-left: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #a5b4fc;
}

.tool-content {
  background: rgba(15, 23, 42, 0.8); /* Semi-transparent dark background */
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>