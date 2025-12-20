<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">© 2025 星云 Nebula Project.</p>
      <div class="footer-links">
        <div class="link-wrapper">
          <span @click="toggleAbout">关于我们</span>
          <Transition name="pop">
            <div v-if="showAbout" class="popover">
              <h3>关于我们</h3>
              <p>通过产业细分与竞争前合作，共建产业增量成果</p>
              <div class="popover-arrow"></div>
            </div>
          </Transition>
        </div>
        
        <div class="link-wrapper">
          <span @click="toggleContact">联系合作</span>
          <Transition name="pop">
            <div v-if="showContact" class="popover">
              <h3>联系合作</h3>
              <p>参与共建，可点击协同组织节点查看详情</p>
              <div class="popover-arrow"></div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showAbout = ref(false);
const showContact = ref(false);

const toggleAbout = (e) => {
  e.stopPropagation();
  showAbout.value = !showAbout.value;
  showContact.value = false;
};

const toggleContact = (e) => {
  e.stopPropagation();
  showContact.value = !showContact.value;
  showAbout.value = false;
};

const closeAll = () => {
  showAbout.value = false;
  showContact.value = false;
};

onMounted(() => {
  document.addEventListener('click', closeAll);
});

onUnmounted(() => {
  document.removeEventListener('click', closeAll);
});
</script>

<style scoped>
.footer {
  padding: 60px 0 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 40px;
  scroll-snap-align: end;
  position: relative;
  z-index: 10;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.link-wrapper {
  position: relative;
}

.link-wrapper span {
  cursor: pointer;
  transition: color 0.2s;
}

.link-wrapper span:hover {
  color: #fff;
}

/* Popover Styles */
.popover {
  position: absolute;
  bottom: 100%;
  right: 0; /* Align right to avoid overflow if needed, or left/center */
  margin-bottom: 15px;
  width: 280px;
  background: rgba(23, 25, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 100;
  text-align: left;
}

/* Center alignment adjustment if preferred */
.link-wrapper:last-child .popover {
  right: 0;
  left: auto;
}

.popover h3 {
  margin: 0 0 10px;
  font-size: 1rem;
  color: #fff;
  letter-spacing: 1px;
}

.popover p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.popover-arrow {
  position: absolute;
  bottom: -6px;
  right: 20px;
  width: 12px;
  height: 12px;
  background: rgba(23, 25, 35, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}

/* Animation */
.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
