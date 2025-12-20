<template>
  <section class="section co-construction-section" ref="sectionRef" :class="{ visible: isVisible }">
    <div class="geometric-bg"></div>
    <div class="content-wrapper">
      
      <!-- Main Section Header -->
      <div class="main-header slide-in-top">
        <div class="header-group">
          <span class="section-number">02</span>
          <h2 class="main-title">传感行业共建</h2>
        </div>
        <p class="main-desc">聚集“传感百人”，各自主导细分方向的深化框架，在整体传感方向上协同</p>
      </div>

      <!-- Master-Detail Glass Layout -->
      <div class="master-detail-container slide-in-bottom-3d">
        <div class="glass-reflection"></div>
        
        <!-- Sidebar Navigation (Left) -->
        <div class="industry-nav">
          <div class="nav-header">
            <h3>细分方向</h3>
            <div class="nav-line"></div>
          </div>
          <div class="nav-list">
            <div class="industry-item active">
              <div class="item-glow"></div>
              <fire-outlined />
              <span>红外测温</span>
            </div>
            <div class="industry-item dim">
              <eye-outlined />
              <span>光谱分析</span>
            </div>
            <div class="industry-item dim">
              <audio-outlined />
              <span>视觉识别</span>
            </div>
            <div class="industry-item dim">
              <more-outlined />
              <span>更多...</span>
            </div>
          </div>
        </div>

        <!-- Detail Content (Right) -->
        <div class="industry-detail">
          <div class="detail-bg-grid"></div>
          
          <div class="detail-header">
            <div class="title-row">
              <div class="icon-box-small pulse-slow">
                <fire-outlined />
              </div>
              <h3 class="typewriter-effect clickable-title" @click="openInfraIndustry">红外测温行业</h3>
              <div class="status-badge">
                <span class="status-dot"></span>
                已接入
                <div class="scan-line"></div>
              </div>
            </div>
            <div class="stats-group">
              <div class="stat-mini slide-in-right delay-1">
                <span class="num">30+</span>
                <span class="label">技术路线</span>
              </div>
              <div class="divider"></div>
              <div class="stat-mini slide-in-right delay-2">
                <span class="num">300+</span>
                <span class="label">应用场景</span>
              </div>
            </div>
          </div>

          <div class="detail-body">
            <p class="body-desc slide-in-up delay-3">
              提供高质量温度数据：<span class="highlight">非接触式测温、快速响应、宽温度量程</span>
            </p>
            
            <div class="features-grid">
              <div class="feature-card glass-hover stagger-1">
                <div class="card-shimmer"></div>
                <div class="card-icon">🔗</div>
                <h4>信息归集与梳理</h4>
                <p>对资料、技术成果进行搜集，建立清晰的结构化分类</p>
              </div>
              <div class="feature-card glass-hover stagger-2">
                <div class="card-shimmer"></div>
                <div class="card-icon">🤝</div>
                <h4>共性需求挖掘</h4>
                <p>挖掘共性需求，明确增量共建方向</p>
              </div>
              <div class="feature-card glass-hover stagger-3">
                <div class="card-shimmer"></div>
                <div class="card-icon">📈</div>
                <h4>任务分工与评价体系</h4>
                <p>建立分工与评价体系，链接共建者实现增量市场的竞争前合作</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Section Guide -->
      <div class="next-section-guide fade-in-up" @click="scrollToNext">
        <span class="guide-text">共建成果</span>
        <div class="guide-icon-wrapper">
          <down-outlined class="guide-icon" />
          <div class="pulse-ring"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  FireOutlined, 
  DownOutlined, 
  EyeOutlined, 
  AudioOutlined, 
  MoreOutlined 
} from '@ant-design/icons-vue';

const emit = defineEmits(['scroll-to']);
const sectionRef = ref(null);
const isVisible = ref(false);
let observer = null;

const scrollToNext = () => {
  emit('scroll-to', 'section-achievements');
};

const openInfraIndustry = () => {
  window.open('https://dmdii.cn', '_blank');
};

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    }
  }, { threshold: 0.2 });
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
  perspective: 1200px;
}

.geometric-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 0% 50%, rgba(114, 46, 209, 0.08), transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 90vh;
  justify-content: center;
}

/* Main Header */
.main-header {
  margin-bottom: 20px;
  position: relative;
  padding-left: 20px;
  border-left: 4px solid #722ed1;
}

.section-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 6rem;
  color: rgba(255, 255, 255, 0.03);
  position: absolute;
  top: -30px;
  left: -20px;
  line-height: 1;
  z-index: -1;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #d3adf7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
  white-space: nowrap;
}

.main-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 10px;
  letter-spacing: 1px;
}

/* Master-Detail Container */
.master-detail-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  height: 500px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  position: relative;
}

.glass-reflection {
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  animation: shine 8s infinite;
  pointer-events: none;
  z-index: 10;
}

/* Sidebar */
.industry-nav {
  background: rgba(0, 0, 0, 0.2);
  padding: 30px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.nav-header h3 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 15px;
  letter-spacing: 1px;
}

.nav-line {
  height: 1px;
  background: linear-gradient(90deg, #722ed1, transparent);
  margin-bottom: 20px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.industry-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.industry-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.industry-item.active {
  background: linear-gradient(90deg, rgba(114, 46, 209, 0.2), transparent);
  color: #fff;
  border-left: 3px solid #722ed1;
}

.item-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 0% 50%, rgba(114, 46, 209, 0.3), transparent 70%);
  opacity: 0.5;
  animation: pulse-glow 3s infinite;
}

.industry-item.dim {
  opacity: 0.6;
}

/* Detail Area */
.industry-detail {
  padding: 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
}

.detail-bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon-box-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #722ed1, #eb2f96);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 4px 10px rgba(114, 46, 209, 0.3);
}

.pulse-slow {
  animation: pulse 3s infinite;
}

.detail-header h3 {
  font-size: 2rem;
  margin: 0;
  color: #fff;
}

.clickable-title {
  cursor: pointer;
}

.typewriter-effect {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
}

.status-badge {
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #52c41a;
  border-radius: 50%;
  box-shadow: 0 0 5px #52c41a;
  animation: blink 2s infinite;
}

.scan-line {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(82, 196, 26, 0.2), transparent);
  animation: scan 3s infinite;
}

.stats-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-mini {
  text-align: right;
  opacity: 0;
  animation: slideInRight 0.8s forwards;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }

.stat-mini .num {
  display: block;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.stat-mini .label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
}

.body-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  max-width: 800px;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: slideInUp 0.8s forwards;
}

.highlight {
  color: #d3adf7;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  position: relative;
  z-index: 1;
}

.feature-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
}

.visible .stagger-1 { animation: cardPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s forwards; }
.visible .stagger-2 { animation: cardPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.6s forwards; }
.visible .stagger-3 { animation: cardPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards; }

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-5px);
  border-color: rgba(114, 46, 209, 0.3);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.card-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transform: skewX(-25deg);
  transition: all 0.5s;
}

.feature-card:hover .card-shimmer {
  left: 200%;
  transition: left 1s;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.feature-card h4 {
  color: #fff;
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* Animations */
@keyframes shine {
  0% { left: -50%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

@keyframes pulse-glow {
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes scan {
  0% { left: -100%; }
  100% { left: 200%; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes cardPopIn {
  to { opacity: 1; transform: translateY(0); }
}

/* Next Section Guide */
.next-section-guide {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  z-index: 10;
}

.guide-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.guide-icon-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-icon {
  color: #d3adf7;
  font-size: 20px;
  z-index: 2;
  animation: bounce 2s infinite;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(211, 173, 247, 0.5);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Animations */
.slide-in-top {
  opacity: 0;
  transform: translateY(-50px);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-in-bottom-3d {
  opacity: 0;
  transform: translateY(100px) rotateX(-5deg);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
}

.visible .slide-in-top {
  opacity: 1;
  transform: translateY(0);
}

.visible .slide-in-bottom-3d {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

.fade-in-up {
  opacity: 0;
  transform: translate(-50%, 20px);
  transition: all 1s ease 1s;
}

.visible .fade-in-up {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (max-width: 960px) {
  .section {
    padding-top: 100px; /* Add space for top navigation */
    align-items: flex-start; /* Prevent centering from pushing content up */
  }

  .content-wrapper {
    height: auto;
    justify-content: flex-start;
  }

  .master-detail-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .industry-nav {
    display: none; /* Hide nav on mobile for now or make it a dropdown */
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
