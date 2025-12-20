<template>
  <section class="section organization-section" ref="sectionRef" :class="{ visible: isVisible }">
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>

    <div class="content-wrapper">
      <div class="layout-grid">
        <!-- Left: Visualization -->
        <div class="glass-card network-card">
          <div class="stage" ref="stageRef">
            <svg
              class="network-svg"
              :viewBox="`0 0 ${stageSize.width} ${stageSize.height}`"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            >
              <defs>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="
                      1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.8 0"
                    result="colored"
                  />
                  <feMerge>
                    <feMergeNode in="colored" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="orgLinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="rgba(239, 68, 68, 0.85)" />
                  <stop offset="50%" stop-color="rgba(250, 204, 21, 0.55)" />
                  <stop offset="100%" stop-color="rgba(59, 130, 246, 0.85)" />
                </linearGradient>
              </defs>

              <!-- Main Connection Line -->
              <line
                :x1="nodes[0].x"
                :y1="nodes[0].y"
                :x2="nodes[1].x"
                :y2="nodes[1].y"
                class="link-line"
              />

              <!-- Potential Nodes (Background) -->
              <g
                v-for="pNode in potentialNodes"
                :key="pNode.id"
                class="potential-node"
                :transform="`translate(${pNode.x}, ${pNode.y})`"
              >
                <circle 
                  class="p-node-ring" 
                  :r="pNode.r" 
                  :stroke="pNode.side === 'left' ? '#ef4444' : '#3b82f6'"
                />
                <text class="p-node-label" x="0" y="0" dy="5" text-anchor="middle">
                  {{ pNode.label }}
                </text>
              </g>

              <!-- Main Nodes -->
              <g
                v-for="node in nodes"
                :key="node.id"
                class="node"
                :transform="`translate(${node.x}, ${node.y})`"
                @pointerdown="(e) => onPointerDown(e, node.id)"
              >
                <circle class="node-hit" :r="36" />
                <circle
                  class="node-core"
                  :r="14"
                  :fill="node.color"
                  filter="url(#softGlow)"
                />
                <circle class="node-ring" :r="22" :stroke="node.color" />
                <text class="node-label" x="0" y="48" text-anchor="middle">
                  {{ node.label }}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Right: Info & Legend -->
        <div class="info-panel">
          <div class="header-group">
            <h2 class="section-title">协同组织节点</h2>
            <p class="section-subtitle">点击节点跳转组织</p>
          </div>

          <div class="legend-box glass-card">
            <h3>图例说明</h3>
            <div class="legend-list">
              <div class="legend-item">
                <span class="legend-dot red"></span>
                <span class="legend-text">传感细分方向</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot blue"></span>
                <span class="legend-text">基础设施</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dashed-red"></span>
                <span class="legend-text">潜在传感方向</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dashed-blue"></span>
                <span class="legend-text">潜在基础设施</span>
              </div>
            </div>
            
            <div class="divider"></div>

            <button class="reset-btn" @click="resetNodes">
              <span class="reset-icon">↺</span> 复位布局
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const sectionRef = ref(null);
const isVisible = ref(false);
const stageRef = ref(null);
const stageSize = reactive({ width: 1000, height: 520 });

const nodes = reactive([
  { id: 'infrared', label: '红外测温', color: '#ef4444', x: 320, y: 260, vx: 0, vy: 0, url: 'https://dmdii.cn' },
  { id: 'ai', label: 'AI', color: '#3b82f6', x: 680, y: 260, vx: 0, vy: 0, url: 'https://dmdii.top' }
]);

const potentialNodes = reactive([
  // Sensors (Left)
  { id: 'p1', label: '光谱分析', side: 'left', x: 100, y: 100, r: 35, offset: 0 },
  { id: 'p2', label: '视觉识别', side: 'left', x: 100, y: 100, r: 35, offset: 2 },
  { id: 'p3', label: '流量', side: 'left', x: 100, y: 100, r: 28, offset: 4 },
  { id: 'p4', label: '压力', side: 'left', x: 100, y: 100, r: 28, offset: 1 },
  { id: 'p9', label: '液位', side: 'left', x: 100, y: 100, r: 30, offset: 3 },
  { id: 'p10', label: '气体传感', side: 'left', x: 100, y: 100, r: 32, offset: 5 },
  { id: 'p11', label: '速度', side: 'left', x: 100, y: 100, r: 28, offset: 1.5 },
  { id: 'p12', label: '空间感知', side: 'left', x: 100, y: 100, r: 34, offset: 4.5 },
  // Infrastructure (Right)
  { id: 'p5', label: '律师', side: 'right', x: 900, y: 100, r: 28, offset: 3 },
  { id: 'p6', label: '教育', side: 'right', x: 900, y: 100, r: 28, offset: 5 },
  { id: 'p7', label: '金融资本', side: 'right', x: 900, y: 100, r: 35, offset: 0.5 },
  { id: 'p8', label: '区块链', side: 'right', x: 900, y: 100, r: 32, offset: 2.5 },
  { id: 'p13', label: '中试制造', side: 'right', x: 900, y: 100, r: 33, offset: 1 },
  { id: 'p14', label: '科研', side: 'right', x: 900, y: 100, r: 30, offset: 4 },
  { id: 'p15', label: '供应链', side: 'right', x: 900, y: 100, r: 31, offset: 2 }
]);

const dragging = reactive({
  nodeId: null,
  pointerId: null,
  startX: 0,
  startY: 0,
  offsetX: 0,
  offsetY: 0,
  moved: false
});

let rafId = null;
let lastTs = 0;
let resizeObserver = null;
let intersectionObserver = null;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getStagePoint = (e) => {
  const el = stageRef.value;
  if (!el) return { x: 0, y: 0 };
  const rect = el.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const clampNodeIntoStage = (node) => {
  const padding = 36;
  node.x = clamp(node.x, padding, Math.max(padding, stageSize.width - padding));
  node.y = clamp(node.y, padding, Math.max(padding, stageSize.height - padding));
};

const setInitialLayout = () => {
  const w = stageSize.width;
  const h = stageSize.height;
  
  // Main nodes centered
  nodes[0].x = w * 0.4;
  nodes[0].y = h * 0.5;
  nodes[1].x = w * 0.6;
  nodes[1].y = h * 0.5;
  nodes[0].vx = 0;
  nodes[0].vy = 0;
  nodes[1].vx = 0;
  nodes[1].vy = 0;

  // Potential nodes distribution
  // Left side: 5% to 45% width (Wider range)
  const leftXMin = w * 0.05;
  const leftXMax = w * 0.45;
  // Right side: 55% to 95% width (Wider range)
  const rightXMin = w * 0.55;
  const rightXMax = w * 0.95;
  
  const yMin = h * 0.1;
  const yMax = h * 0.9;

  potentialNodes.forEach((node, i) => {
    // Filter nodes by side to ensure even distribution within each side
    const sideNodes = potentialNodes.filter(n => n.side === node.side);
    const indexInSide = sideNodes.indexOf(node);
    const countInSide = sideNodes.length;
    
    // Grid-like distribution to avoid empty spots
    // We divide the vertical space into slots
    const slotHeight = (yMax - yMin) / countInSide;
    const baseY = yMin + slotHeight * indexInSide;
    
    if (node.side === 'left') {
      // Randomize X within left range
      node.x = leftXMin + Math.random() * (leftXMax - leftXMin);
      // Randomize Y within its slot, plus some overlap
      node.y = baseY + Math.random() * slotHeight * 0.8;
    } else {
      node.x = rightXMin + Math.random() * (rightXMax - rightXMin);
      node.y = baseY + Math.random() * slotHeight * 0.8;
    }
    // Store initial positions for floating animation
    node.initialX = node.x;
    node.initialY = node.y;
  });
};

const resetNodes = () => {
  setInitialLayout();
};

const openNode = (nodeId) => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;
  window.open(node.url, '_blank', 'noopener,noreferrer');
};

const onPointerDown = (e, nodeId) => {
  if (!stageRef.value) return;
  dragging.nodeId = nodeId;
  dragging.pointerId = e.pointerId;
  dragging.moved = false;

  const p = getStagePoint(e);
  dragging.startX = p.x;
  dragging.startY = p.y;

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;

  dragging.offsetX = node.x - p.x;
  dragging.offsetY = node.y - p.y;

  const svg = e.currentTarget?.ownerSVGElement;
  if (svg && svg.setPointerCapture) {
    svg.setPointerCapture(e.pointerId);
  }
};

const onPointerMove = (e) => {
  if (!dragging.nodeId || dragging.pointerId !== e.pointerId) return;
  const node = nodes.find((n) => n.id === dragging.nodeId);
  if (!node) return;

  const p = getStagePoint(e);
  const nextX = p.x + dragging.offsetX;
  const nextY = p.y + dragging.offsetY;

  const dx = p.x - dragging.startX;
  const dy = p.y - dragging.startY;
  if (!dragging.moved && (dx * dx + dy * dy) > 16) dragging.moved = true;

  node.x = nextX;
  node.y = nextY;
  clampNodeIntoStage(node);
};

const onPointerUp = (e) => {
  if (!dragging.nodeId || dragging.pointerId !== e.pointerId) return;
  const nodeId = dragging.nodeId;
  const moved = dragging.moved;

  dragging.nodeId = null;
  dragging.pointerId = null;
  dragging.moved = false;

  const svg = e.currentTarget;
  if (svg && svg.releasePointerCapture) {
    try {
      svg.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }

  if (!moved) openNode(nodeId);
};

const tick = (ts) => {
  if (!lastTs) lastTs = ts;
  const dt = Math.min((ts - lastTs) / 1000, 0.032);
  lastTs = ts;

  // Potential nodes floating animation
  const time = ts / 1000;
  potentialNodes.forEach(node => {
    if (node.initialX !== undefined) {
      node.x = node.initialX + Math.sin(time + node.offset) * 10;
      node.y = node.initialY + Math.cos(time * 0.8 + node.offset) * 10;
    }
  });

  // Main nodes physics
  const a = nodes[0];
  const b = nodes[1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const nx = dx / dist;
  const ny = dy / dist;

  const rest = Math.min(stageSize.width, stageSize.height) * 0.35;
  const stiffness = 20;
  const damping = 8;

  const stretch = dist - rest;
  const fx = nx * (stretch * stiffness);
  const fy = ny * (stretch * stiffness);

  const centerX = stageSize.width * 0.5;
  const centerY = stageSize.height * 0.5;
  const centerK = 2.0;

  const updateNode = (node, ax, ay) => {
    node.vx += ax * dt;
    node.vy += ay * dt;
    node.vx *= Math.exp(-damping * dt);
    node.vy *= Math.exp(-damping * dt);
    node.x += node.vx * 60 * dt;
    node.y += node.vy * 60 * dt;
    clampNodeIntoStage(node);
  };

  const aDragged = dragging.nodeId === a.id;
  const bDragged = dragging.nodeId === b.id;

  if (!aDragged) {
    const cx = (centerX - a.x) * centerK;
    const cy = (centerY - a.y) * centerK;
    updateNode(a, fx * 0.5 + cx, fy * 0.5 + cy);
  }

  if (!bDragged) {
    const cx = (centerX - b.x) * centerK;
    const cy = (centerY - b.y) * centerK;
    updateNode(b, -fx * 0.5 + cx, -fy * 0.5 + cy);
  }

  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  const el = stageRef.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  stageSize.width = Math.max(600, Math.floor(rect.width));
  stageSize.height = Math.max(360, Math.floor(rect.height));
  
  // Initialize layout immediately
  setInitialLayout();

  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const w = Math.max(600, Math.floor(entry.contentRect.width));
    const h = Math.max(360, Math.floor(entry.contentRect.height));
    const prevW = stageSize.width;
    const prevH = stageSize.height;
    stageSize.width = w;
    stageSize.height = h;

    const sx = prevW ? w / prevW : 1;
    const sy = prevH ? h / prevH : 1;
    
    // Scale main nodes
    nodes[0].x *= sx;
    nodes[0].y *= sy;
    nodes[1].x *= sx;
    nodes[1].y *= sy;
    
    // Re-distribute potential nodes on resize
    setInitialLayout();
    
    clampNodeIntoStage(nodes[0]);
    clampNodeIntoStage(nodes[1]);
  });

  resizeObserver.observe(el);

  intersectionObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    } else {
      isVisible.value = false;
    }
  }, { threshold: 0.15 });

  if (sectionRef.value) {
    intersectionObserver.observe(sectionRef.value);
  }

  rafId = requestAnimationFrame(tick);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  lastTs = 0;
  if (resizeObserver) resizeObserver.disconnect();
  resizeObserver = null;
  if (intersectionObserver) intersectionObserver.disconnect();
  intersectionObserver = null;
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
}

.organization-section {
  isolation: isolate;
}

.glow {
  position: absolute;
  inset: auto;
  width: 1500px;
  height: 1500px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0;
  transform: scale(0.5);
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 0;
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;
}

.visible .glow {
  opacity: 0.55;
  transform: scale(1);
}

.glow-1 {
  top: -35%;
  left: -20%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.22), transparent 70%);
}

.glow-2 {
  bottom: -45%;
  right: -25%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.16), transparent 70%);
  transition-delay: 0.2s;
}

.content-wrapper {
  max-width: 1400px;
  width: 100%;
  position: relative;
  z-index: 1;
  padding: 0 40px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  align-items: center;
}

/* Info Panel (Right) */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.header-group {
  text-align: left;
}

.section-title {
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  background: linear-gradient(135deg, #fff 0%, #fcd34d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
  text-shadow: 0 0 30px rgba(250, 204, 21, 0.12);
}

.section-subtitle {
  margin: 12px 0 0;
  font-size: 1.1rem;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
}

.legend-box {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.legend-box h3 {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(250, 204, 21, 0.18);
}

.legend-dot.red { background: #ef4444; }
.legend-dot.blue { background: #3b82f6; }
.legend-dot.dashed-red {
  background: transparent;
  border: 1px dashed #ef4444;
  box-shadow: none;
}
.legend-dot.dashed-blue {
  background: transparent;
  border: 1px dashed #3b82f6;
  box-shadow: none;
}

.legend-text {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  letter-spacing: 1px;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}

.glass-card {
  background: rgba(23, 25, 35, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  backdrop-filter: blur(12px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}

.network-card {
  width: 100%;
  height: 510px; /* Fixed height for visualization */
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.reset-icon {
  font-size: 1.1em;
  font-weight: bold;
}

.stage {
  width: 100%;
  height: 100%;
  position: relative;
  background:
    radial-gradient(circle at 20% 10%, rgba(250, 204, 21, 0.08), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(250, 204, 21, 0.06), transparent 60%),
    radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: auto, auto, 24px 24px;
}

.network-svg {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}

.link-line {
  stroke: rgba(250, 204, 21, 0.6);
  stroke-width: 3;
}

.potential-node {
  pointer-events: none;
  opacity: 0.6;
}

.p-node-ring {
  fill: rgba(255, 255, 255, 0.02);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}

.p-node-label {
  fill: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}

.node {
  cursor: grab;
  user-select: none;
}

.node:active {
  cursor: grabbing;
}

.node-hit {
  fill: rgba(255, 255, 255, 0);
}

.node-core {
  opacity: 0.95;
}

.node-ring {
  fill: transparent;
  stroke-width: 2;
  opacity: 0.7;
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  fill: rgba(255, 255, 255, 0.85);
  letter-spacing: 2px;
  text-shadow: 0 0 12px rgba(250, 204, 21, 0.15);
  pointer-events: none;
}

@media (max-width: 1024px) {
  .section {
    padding-top: 100px; /* Prevent nav overlap on mobile */
  }

  .layout-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .network-card {
    height: 500px;
    order: 2; /* Put visualization below on mobile if desired, or keep above */
  }

  .info-panel {
    order: 1;
    align-items: center;
    text-align: center;
  }
  
  .header-group {
    text-align: center;
  }
  
  .legend-box {
    width: 100%;
    max-width: 400px;
  }
}
</style>

