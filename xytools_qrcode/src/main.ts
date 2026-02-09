import QRCode from 'qrcode';
import './style.css';

// Color themes configuration
const themes = [
  { name: '经典黑', dark: '#000000', light: '#ffffff' },
  { name: '商务蓝', dark: '#0056b3', light: '#ffffff' },
  { name: '活力橙', dark: '#e65100', light: '#ffffff' },
  { name: '森林绿', dark: '#1b5e20', light: '#ffffff' },
  { name: '优雅紫', dark: '#4a148c', light: '#ffffff' },
];

let currentTheme = themes[0];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>二维码生成器</h1>
    <p>输入文本即可实时生成二维码。</p>
    <div class="input-group">
      <input type="text" id="qr-input" placeholder="在此输入文本..." />
    </div>
    
    <div class="controls">
      <div class="theme-selector">
        ${themes.map((theme, index) => `
          <button class="theme-btn ${index === 0 ? 'active' : ''}" 
                  data-index="${index}" 
                  title="${theme.name}"
                  style="background-color: ${theme.dark}"></button>
        `).join('')}
      </div>
    </div>

    <div class="canvas-container">
      <canvas id="qr-canvas"></canvas>
    </div>
    
    <button id="download-btn" class="action-btn" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      下载二维码
    </button>

    <div id="error-message" class="error"></div>
  </div>
`;

const input = document.querySelector<HTMLInputElement>('#qr-input')!;
const canvas = document.querySelector<HTMLCanvasElement>('#qr-canvas')!;
const errorMessage = document.querySelector<HTMLDivElement>('#error-message')!;
const themeBtns = document.querySelectorAll<HTMLButtonElement>('.theme-btn');
const downloadBtn = document.querySelector<HTMLButtonElement>('#download-btn')!;

const generateQR = async (text: string) => {
  if (!text) {
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    downloadBtn.disabled = true;
    return;
  }
  try {
    await QRCode.toCanvas(canvas, text, {
      width: 600,
      margin: 2,
      color: { dark: currentTheme.dark, light: currentTheme.light },
    });
    errorMessage.textContent = '';
    downloadBtn.disabled = false;
  } catch (err) {
    console.error(err);
    errorMessage.textContent = '生成二维码时出错';
    downloadBtn.disabled = true;
  }
};

// Theme switching
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update theme and regenerate
    const index = parseInt(btn.dataset.index || '0');
    currentTheme = themes[index];
    generateQR(input.value);
  });
});

// Download functionality
downloadBtn.addEventListener('click', () => {
  if (!input.value) return;
  
  const link = document.createElement('a');
  link.download = `qrcode-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Initial generation
generateQR(input.value);

// Listen for input changes
input.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  generateQR(target.value);
});
