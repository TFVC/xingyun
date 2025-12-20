<template>
  <div class="dashboard-wrapper">
    <!-- Glassmorphic Sidebar Navigation -->
    <nav class="side-nav">
      <div 
        class="nav-item" 
        :class="{ active: currentSection === 'hero' }"
        @click="scrollToSection('section-hero')"
      >
        <span class="nav-text">首页</span>
        <div class="nav-dot"></div>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentSection === 'coconstruction' }"
        @click="scrollToSection('section-coconstruction')"
      >
        <span class="nav-text">共建</span>
        <div class="nav-dot"></div>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentSection === 'achievements' }"
        @click="scrollToSection('section-achievements')"
      >
        <span class="nav-text">成果</span>
        <div class="nav-dot"></div>
      </div>
      <div 
        class="nav-item" 
        :class="{ active: currentSection === 'organization' }"
        @click="scrollToSection('section-organization')"
      >
        <span class="nav-text">组织</span>
        <div class="nav-dot"></div>
      </div>
    </nav>

    <div class="dashboard-portal" ref="portalRef" @scroll="handleScroll">
      <!-- Starry Sky Background -->
      <div class="starry-bg">
        <div class="stars-1"></div>
        <div class="stars-2"></div>
        <div class="stars-3"></div>
      </div>

      <!-- Geometric Connection Line -->
      <svg class="connection-line" viewBox="0 0 100 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2b32b2" stop-opacity="0" />
            <stop offset="10%" stop-color="#722ed1" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#eb2f96" stop-opacity="0.8" />
            <stop offset="90%" stop-color="#134e5e" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#134e5e" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path 
          class="geo-path"
          d="M 50 20 C 50 80, 20 120, 20 150 S 80 220, 80 250 S 50 350, 50 380"
          fill="none"
          stroke="url(#lineGradient)"
          stroke-width="0.3"
          :stroke-dasharray="pathLength"
          :stroke-dashoffset="pathOffset"
        />
      </svg>

      <!-- Dynamic Nebula Orbs (Gradient Transitions) -->
      <div class="nebula-layer">
        <div class="orb orb-1" :style="orb1Style"></div>
        <div class="orb orb-2" :style="orb2Style"></div>
        <div class="orb orb-3" :style="orb3Style"></div>
      </div>
      
      <!-- Sections -->
      <HeroSection id="section-hero" @scroll-to="scrollToSection" />
      <CoConstructionSection id="section-coconstruction" @scroll-to="scrollToSection" />
      <AchievementsSection id="section-achievements" @open-tool="handleOpenTool" />
      <OrganizationSection id="section-organization" />
      <FooterSection id="section-footer" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeroSection from './dashboard_sections/HeroSection.vue';
import CoConstructionSection from './dashboard_sections/CoConstructionSection.vue';
import AchievementsSection from './dashboard_sections/AchievementsSection.vue';
import OrganizationSection from './dashboard_sections/OrganizationSection.vue';
import FooterSection from './dashboard_sections/FooterSection.vue';

const emit = defineEmits(['open-tool']);
const scrollY = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);
const pathLength = 1000; // Approximate length for dasharray calculation
const currentSection = ref('hero');
const portalRef = ref(null);

const handleOpenTool = (toolId) => {
  emit('open-tool', toolId);
};

const handleMouseMove = (e) => {
  mouseX.value = e.clientX / window.innerWidth;
  mouseY.value = e.clientY / window.innerHeight;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});

const handleScroll = (e) => {
  scrollY.value = e.target.scrollTop;
  
  const viewportHeight = window.innerHeight;
  const scrollPosition = scrollY.value + viewportHeight * 0.5;

  const sections = [
    { id: 'section-hero', key: 'hero' },
    { id: 'section-coconstruction', key: 'coconstruction' },
    { id: 'section-achievements', key: 'achievements' },
    { id: 'section-organization', key: 'organization' }
  ];

  let closestKey = 'hero';
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    const el = document.getElementById(section.id);
    if (!el) continue;
    const distance = Math.abs(scrollPosition - el.offsetTop);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestKey = section.key;
    }
  }

  currentSection.value = closestKey;
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  const container = portalRef.value;
  
  if (element && container) {
    // Temporarily disable scroll snap to allow smooth JS animation
    container.style.scrollSnapType = 'none';
    
    const targetTop = element.offsetTop;
    const startTop = container.scrollTop;
    const distance = targetTop - startTop;
    const duration = 1200; // 1.2s duration for "braking" effect
    let startTime = null;

    // Ease Out Quart: 1 - (1 - t)^4
    // Starts fast, decelerates strongly at the end
    const easeOutQuart = (x) => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const ease = easeOutQuart(progress);
      
      container.scrollTop = startTop + (distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        // Re-enable scroll snap after animation completes
        // Small delay to ensure browser doesn't fight the final position
        setTimeout(() => {
          container.style.scrollSnapType = 'y mandatory';
        }, 50);
      }
    };
    
    requestAnimationFrame(animation);
  }
};

// Calculate scroll progress (0 to 3 roughly)
const scrollProgress = computed(() => {
  if (typeof window === 'undefined') return 0;
  return scrollY.value / window.innerHeight;
});

// Calculate path offset to "draw" the line as we scroll
const pathOffset = computed(() => {
  // We want the line to be progressively drawn.
  // When progress = 0 (top), only show a bit (or none).
  // When progress = 4 (bottom), show all.
  const totalPages = 4;
  const current = Math.min(Math.max(scrollProgress.value, 0), totalPages);
  return pathLength - (current / totalPages) * pathLength;
});

// Helper for smooth color interpolation
const interpolateColor = (c1, c2, factor) => {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

// Helper for value interpolation
const interpolateValue = (v1, v2, factor) => {
  return v1 + (v2 - v1) * factor;
};

// Orb 1: Primary Light Source
const orb1Style = computed(() => {
  const progress = Math.max(0, Math.min(scrollProgress.value, 2)); // Clamp between 0 and 2
  
  // Position moves from Top-Left to Bottom-Right
  const top = 10 + (progress * 30); 
  const left = 10 + (progress * 20);
  
  // Color Stops (RGB)
  const colors = {
    hero: [43, 50, 178],     // #2b32b2
    co: [114, 46, 209],      // #722ed1
    achieve: [82, 196, 26]   // #52c41a
  };

  // Scale Stops
  const scales = {
    hero: 1.2, // Increased by 20% (was 1.0)
    co: 1.2,
    achieve: 2.0
  };

  let color, scale;

  if (progress < 1) {
    // Hero -> Co-construction
    color = interpolateColor(colors.hero, colors.co, progress);
    scale = interpolateValue(scales.hero, scales.co, progress);
    
    // Mouse attraction effect for Orb 1 in Hero section
    if (progress < 0.5) {
        const moveX = (mouseX.value - 0.5) * 50; // Increased range to +/- 50px
        const moveY = (mouseY.value - 0.5) * 50;
        
        // Add mouse offset to base position calculation
        // We can't easily modify the const 'top'/'left' here without refactoring
        // So we'll return a modified object directly
        return {
            top: `calc(${top}% + ${moveY}px)`,
            left: `calc(${left}% + ${moveX}px)`,
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            opacity: 0.8, // Restored opacity
            transform: `scale(${scale})`,
            transition: 'top 0.2s ease-out, left 0.2s ease-out, transform 0.3s'
        };
    }
  } else {
    // Co-construction -> Achievements
    const factor = progress - 1;
    color = interpolateColor(colors.co, colors.achieve, factor);
    scale = interpolateValue(scales.co, scales.achieve, factor);
  }

  return {
    top: `${top}%`,
    left: `${left}%`,
    background: `radial-gradient(circle, ${color}, transparent 70%)`,
    opacity: 0.6,
    transform: `scale(${scale})`
  };
});

// Orb 2: Secondary Ambient
const orb2Style = computed(() => {
  const progress = Math.max(0, Math.min(scrollProgress.value, 2));
  
  // Position moves from Bottom-Right to Top-Center
  const top = 80 - (progress * 25);
  const right = 10 + (progress * 15);
  
  // Color Stops (RGB)
  const colors = {
    hero: [74, 0, 224],      // #4a00e0
    co: [235, 47, 150],      // #eb2f96
    achieve: [149, 222, 100] // #95de64
  };

  // Scale Stops
  const scales = {
    hero: 1.2, // Increased by 20% (was 1.0)
    co: 1.6, // Increased from 1.2
    achieve: 2.0
  };

  let color, scale;

  if (progress < 1) {
    color = interpolateColor(colors.hero, colors.co, progress);
    scale = interpolateValue(scales.hero, scales.co, progress);
    
    // Mouse attraction effect for Orb 2 in Hero section
    if (progress < 0.5) {
        const moveX = (mouseX.value - 0.5) * -60; // Inverse movement, stronger
        const moveY = (mouseY.value - 0.5) * -60;
        
        return {
            top: `calc(${top}% + ${moveY}px)`,
            right: `calc(${right}% + ${moveX}px)`, // Note: using right here
            background: `radial-gradient(circle, ${color}, transparent 60%)`,
            opacity: 0.8, // Restored opacity
            transform: `scale(${scale})`,
            transition: 'top 0.2s ease-out, right 0.2s ease-out, transform 0.3s'
        };
    }
  } else {
    const factor = progress - 1;
    color = interpolateColor(colors.co, colors.achieve, factor);
    scale = interpolateValue(scales.co, scales.achieve, factor);
  }

  return {
    top: `${top}%`,
    right: `${right}%`,
    background: `radial-gradient(circle, ${color}, transparent 60%)`,
    opacity: 0.5,
    transform: `scale(${scale})`
  };
});

// Orb 3: Accent (Floats around and follows mouse)
const orb3Style = computed(() => {
  const progress = scrollProgress.value;
  
  // Base movement
  let top = 40 + (Math.sin(progress * 2) * 20);
  let left = 50 + (Math.cos(progress * 2) * 20);
  
  // Mouse attraction (only active in Hero section mostly)
   if (progress < 1) {
     const targetX = mouseX.value * 100;
     const targetY = mouseY.value * 100;
     
     // Lerp towards mouse position more aggressively
     left += (targetX - left) * 0.15;
     top += (targetY - top) * 0.15;
   }
   
   return {
    top: `${top}%`,
    left: `${left}%`,
    background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%)',
    opacity: 0.3,
    mixBlendMode: 'overlay',
    transition: 'top 0.5s ease-out, left 0.5s ease-out' // Smooth follow
  };
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;500;700&display=swap');

.dashboard-wrapper {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.dashboard-portal {
  position: relative;
  z-index: 10;
  color: #fff;
  font-family: 'Rajdhani', 'Inter', sans-serif;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  /* scroll-behavior: smooth; -- Removed for custom JS easing */
  perspective: 1000px;
  background-color: #050505; /* Deep Space Black */
  overflow-x: hidden;
}

/* Starry Background */
.starry-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.stars-1, .stars-2, .stars-3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 
    10vw 10vh #fff, 20vw 80vh #fff, 30vw 30vh #fff, 40vw 50vh #fff, 
    50vw 90vh #fff, 60vw 20vh #fff, 70vw 60vh #fff, 80vw 10vh #fff, 
    90vw 40vh #fff, 15vw 65vh #fff, 35vw 15vh #fff, 55vw 75vh #fff,
    75vw 35vh #fff, 95vw 85vh #fff, 5vw 45vh #fff, 25vw 95vh #fff,
    45vw 25vh #fff, 65vw 55vh #fff, 85vw 5vh #fff, 50vw 50vh #fff;
  animation: twinkle 5s infinite ease-in-out;
}

.stars-2 {
  width: 2px;
  height: 2px;
  box-shadow: 
    15vw 15vh rgba(255,255,255,0.8), 35vw 75vh rgba(255,255,255,0.8), 
    55vw 25vh rgba(255,255,255,0.8), 75vw 85vh rgba(255,255,255,0.8),
    95vw 45vh rgba(255,255,255,0.8), 25vw 55vh rgba(255,255,255,0.8),
    65vw 35vh rgba(255,255,255,0.8);
  animation-duration: 7s;
  animation-delay: 1s;
}

.stars-3 {
  width: 3px;
  height: 3px;
  box-shadow: 
    10vw 90vh rgba(255,255,255,0.5), 80vw 20vh rgba(255,255,255,0.5), 
    40vw 60vh rgba(255,255,255,0.5);
  animation-duration: 10s;
  animation-delay: 2s;
  filter: blur(1px);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Nebula Layer */
.nebula-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  filter: blur(60px);
}

.orb {
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  /* Reduce transition duration for smoother continuous updates */
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  mix-blend-mode: screen;
}

/* Connection Line */
.connection-line {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.geo-path {
  transition: stroke-dashoffset 0.1s linear;
  filter: drop-shadow(0 0 5px rgba(114, 46, 209, 0.5));
}

/* Side Navigation */
.side-nav {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
  padding: 20px 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.nav-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  opacity: 1; /* Always visible */
  transform: translateX(0); /* Reset transform */
  transition: all 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
  text-shadow: 0 0 5px rgba(0,0,0,0.5); /* Better readability */
}

.nav-dot {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item:hover .nav-text {
  color: #fff;
}

.nav-item:hover .nav-dot {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.nav-item.active .nav-dot {
  background: #d3adf7; /* Match theme purple */
  transform: scale(1.5);
  box-shadow: 0 0 15px rgba(211, 173, 247, 0.6);
}

.nav-item.active .nav-text {
  color: #d3adf7;
  font-weight: bold;
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .orb {
    width: 600px;
    height: 600px;
  }
  
  .side-nav {
    top: 0;
    right: 0;
    left: 0;
    bottom: auto;
    transform: none;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    border-radius: 0 0 20px 20px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.8);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav-item {
    flex-direction: column-reverse;
    gap: 5px;
    justify-content: center;
    padding: 0 15px;
  }

  .nav-dot {
    margin-bottom: 2px;
  }

  .nav-text {
    font-size: 0.8rem;
  }
}
</style>
