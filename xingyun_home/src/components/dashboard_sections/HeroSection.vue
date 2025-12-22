<template>
  <section class="section hero-section">
    <div class="content-wrapper">
      <div class="hero-content">
        <h1 class="brand-title nebula-text">
          <transition name="fade-slide" mode="out-in">
            <span :key="activeTitle" class="glitch" :data-text="activeTitle">{{ activeTitle }}</span>
          </transition>
        </h1>
        
        <h2 class="brand-slogan">感知有度，链接无限</h2>
        
        <div class="hero-card glass-card">
          <h3>工分经济驱动的社会化企业</h3>
          <p>数字化基础设施 + 软环境自治原则 👉 高效协作</p>
        </div>
      </div>

      <div class="scroll-indicator" @click="scrollToNext">
        <div class="scroll-text">探索共建</div>
        <div class="arrow-container">
          <down-outlined class="arrow-icon" />
          <down-outlined class="arrow-icon delay" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['scroll-to']);
const activeTitle = ref('NEBULA');
let intervalId = null;

const scrollToNext = () => {
  emit('scroll-to', 'section-coconstruction');
};

onMounted(() => {
  intervalId = setInterval(() => {
    activeTitle.value = activeTitle.value === 'NEBULA' ? '星云' : 'NEBULA';
  }, 4000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.brand-title {
  margin: 0;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nebula-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 8rem;
  font-weight: 900;
  letter-spacing: 10px;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 30px rgba(165, 180, 252, 0.3);
  position: relative;
}

.brand-slogan {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: 8px;
  margin: 20px 0 40px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-card {
  max-width: 600px;
  margin: 0 auto 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.hero-card h3 {
  color: #1890ff;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.hero-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  filter: blur(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(1.1);
  filter: blur(10px);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-text {
  font-size: 0.9rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 500;
}

.arrow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 40px;
}

.arrow-icon {
  color: #fff;
  font-size: 20px;
  animation: arrow-bounce 2s infinite;
  margin-top: -10px;
}

.arrow-icon.delay {
  animation-delay: 0.2s;
  opacity: 0.5;
}

@keyframes arrow-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(5px);
  }
  60% {
    transform: translateY(3px);
  }
}

@media (max-width: 768px) {
  .section { padding-top: 100px; align-items: flex-start; }
  .content-wrapper { justify-content: flex-start; height: auto; padding-top: 40px; }
  .nebula-text { font-size: 4rem; letter-spacing: 4px; }
  .brand-title { height: 100px; }
  .brand-slogan { font-size: 1.5rem; letter-spacing: 4px; }
  .hero-card { margin: 0 20px 30px; padding: 20px; }
}
</style>
