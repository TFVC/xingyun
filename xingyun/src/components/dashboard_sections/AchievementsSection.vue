<template>
  <section class="section achievements-section" ref="sectionRef" :class="{ visible: isVisible }">
    <div class="geometric-shape"></div>
    <div class="content-wrapper">
      <div class="layout-grid">
        
        <!-- Cards Column (Left) -->
        <div class="cards-column">
          <!-- Main Active Card -->
          <div class="achievement-card main-card glass-card active-card slide-in-bottom-3d delay-1 clickable-card" @click="openAiTools">
            <div class="active-glow"></div>
            <div class="card-content">
              <div class="card-header">
                <div class="icon-circle active-icon"><robot-outlined /></div>
                <span class="status-badge active">更新中</span>
              </div>
              <h3>AI 工具集</h3>
              <p class="desc">赋能行业的智能引擎，提供垂直领域的 AI 解决方案。</p>
              
              <div class="tool-preview">
                <div class="tool-item">
                  <file-text-outlined /> <span>公众号排版</span>
                </div>
                <div class="tool-item">
                  <edit-outlined /> <span>编辑助手</span>
                </div>
                <div class="tool-item">
                  <video-camera-outlined /> <span>智能视频生成</span>
                </div>
                <div class="tool-item dim">
                  <more-outlined /> <span>更多评测/开发中...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Cards Grid -->
          <div class="secondary-grid">
            <div class="achievement-card small-card glass-card slide-in-bottom-3d delay-2">
              <div class="card-content">
                <div class="card-header">
                  <div class="icon-circle"><cloud-server-outlined /></div>
                  <span class="status-badge">待发布</span>
                </div>
                <h3>资料库</h3>
                <p class="small-desc">AI时代的数据基础设施</p>
              </div>
            </div>
            
            <div class="achievement-card small-card glass-card slide-in-bottom-3d delay-3">
              <div class="card-content">
                <div class="card-header">
                  <div class="icon-circle"><experiment-outlined /></div>
                  <span class="status-badge">待发布</span>
                </div>
                <h3>技术库</h3>
                <p class="small-desc">前沿专利与研发成果转化</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Column (Right) -->
        <div class="text-column slide-in-right-3d">
          <div class="section-header">
            <span class="section-number">03</span>
            <h2 class="section-title">参与共建<br>兑换成果</h2>
          </div>
          <p class="section-desc">
            从资料数据到技术成果，再到AI"外脑"建设，<br>
            传感行业相关从业者的<span class="highlight">资源生态圈</span>：
          </p>
          <div class="benefit-list">
            <div class="benefit-item">
              <span class="check-icon">✓</span> 知识资产化
            </div>
            <div class="benefit-item">
              <span class="check-icon">✓</span> 技术产业化
            </div>
            <div class="benefit-item">
              <span class="check-icon">✓</span> 协作自働化
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  CloudServerOutlined, 
  ExperimentOutlined, 
  RobotOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons-vue';

defineEmits(['open-tool']);

const sectionRef = ref(null);
const isVisible = ref(false);
let observer = null;

const openAiTools = () => {
  window.open('https://ai.dmdii.top', '_blank');
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
  padding: 80px 60px;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
  perspective: 1200px;
}

.geometric-shape {
  position: absolute;
  top: -10%;
  right: -25%;
  width: 1200px;
  height: 1200px;
  background: radial-gradient(circle, rgba(82, 196, 26, 0.15), transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 80px;
  align-items: center;
}

/* Cards Column */
.cards-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.secondary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Common Card Styles */
.glass-card {
  background: rgba(23, 25, 35, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.4s ease, border-color 0.4s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
}

.card-content {
  padding: 30px;
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

.status-badge.active {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.3);
}

.achievement-card h3 {
  font-size: 1.5rem;
  margin: 0 0 10px;
  color: #fff;
}

.desc {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 20px;
}

.small-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0;
}

/* Main Card Specifics */
.main-card {
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.main-card:hover {
  box-shadow: 0 10px 40px rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.5);
}

.active-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(24, 144, 255, 0.1), transparent 60%);
  pointer-events: none;
}

.active-icon {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
}

.tool-preview {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 0.9rem;
}

.clickable-card {
  cursor: pointer;
}

.tool-item.clickable {
  cursor: pointer;
}

.tool-item.dim {
  opacity: 0.5;
}

/* Text Column */
.text-column {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.section-header {
  margin-bottom: 40px;
  position: relative;
}

.section-number {
  font-family: 'Orbitron', sans-serif;
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.05);
  position: absolute;
  top: -60px;
  right: -20px;
  line-height: 1;
  z-index: -1;
}

.section-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #a8b1ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
}

.section-desc {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  max-width: 400px;
}

.highlight {
  color: #a8b1ff;
  font-weight: 700;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-end;
}

.benefit-item {
  font-size: 1.1rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.check-icon {
  color: #52c41a;
  font-weight: bold;
}

/* Animations */
.slide-in-bottom-3d {
  opacity: 0;
  transform: translateY(100px) rotateX(-10deg) scale(0.9);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-in-right-3d {
  opacity: 0;
  transform: translateX(100px) rotateY(-10deg);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.visible .slide-in-bottom-3d {
  opacity: 1;
  transform: translateY(0) rotateX(0) scale(1);
}

.visible .slide-in-right-3d {
  opacity: 1;
  transform: translateX(0) rotateY(0);
}

.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }

@media (max-width: 960px) {
  .section {
    padding: 100px 20px 40px;
    align-items: flex-start;
  }
  
  .content-wrapper {
    height: auto;
    padding-bottom: 40px;
  }

  .layout-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .cards-column {
    order: 2;
  }
  
  .text-column {
    order: 1;
    align-items: center;
    text-align: center;
  }
  
  .benefit-list {
    align-items: center;
  }
  
  .section-number {
    right: 50%;
    transform: translateX(50%);
  }
}
</style>
