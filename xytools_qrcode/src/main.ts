import QRCode from 'qrcode';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="container">
    <h1>二维码生成器</h1>
    <p>纯前端生成，安全快捷</p>
    
    <div class="controls">
      <div class="input-group">
        <input type="text" id="qr-input" placeholder="输入链接或文本" />
      </div>

      <div class="card-fields" id="card-fields">
        <input type="text" id="card-name" placeholder="姓名" />
        <input type="text" id="card-title" placeholder="职务" />
        <input type="text" id="card-org" placeholder="单位" />
        <input type="text" id="card-phone" placeholder="电话" />
        <input type="text" id="card-email" placeholder="邮箱" />
        <input type="text" id="card-addr" placeholder="地址" />
      </div>
      
      <div class="theme-selector" id="theme-selector">
        <!-- Buttons will be injected here -->
      </div>

      <div class="layout-selector" id="layout-selector" style="display: none;">
        <!-- Layout buttons will be injected here -->
      </div>

      <label class="checkbox-container">
        <input type="checkbox" id="card-mode-check">
        <span class="checkmark"></span>
        名片样式
      </label>
    </div>

    <div class="canvas-container">
      <canvas id="qrcode"></canvas>
    </div>

    <div class="error" id="error-message"></div>

    <button id="download-btn" class="action-btn" disabled>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      下载二维码
    </button>
  </div>
`;

const input = document.getElementById('qr-input') as HTMLInputElement;
const cardFieldsContainer = document.getElementById('card-fields') as HTMLDivElement;
// Card Inputs
const cardNameInput = document.getElementById('card-name') as HTMLInputElement;
const cardTitleInput = document.getElementById('card-title') as HTMLInputElement;
const cardOrgInput = document.getElementById('card-org') as HTMLInputElement;
const cardPhoneInput = document.getElementById('card-phone') as HTMLInputElement;
const cardEmailInput = document.getElementById('card-email') as HTMLInputElement;
const cardAddrInput = document.getElementById('card-addr') as HTMLInputElement;

const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
const errorMessage = document.getElementById('error-message') as HTMLDivElement;
const themeSelector = document.getElementById('theme-selector') as HTMLDivElement;
const layoutSelector = document.getElementById('layout-selector') as HTMLDivElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const cardModeCheckbox = document.getElementById('card-mode-check') as HTMLInputElement;

const themes = [
  { name: 'default', dark: '#1f2937', light: '#f3f4f6', accent: '#374151' }, // Graphite
  { name: 'blue', dark: '#1e40af', light: '#eff6ff', accent: '#3b82f6' }, // Royal Blue
  { name: 'purple', dark: '#6b21a8', light: '#f3e8ff', accent: '#a855f7' }, // Deep Purple
  { name: 'teal', dark: '#0f766e', light: '#f0fdfa', accent: '#14b8a6' }, // Teal
  { name: 'rose', dark: '#be123c', light: '#fff1f2', accent: '#f43f5e' }, // Rose
];

const layouts = [
  { id: 'classic', label: '经典' },
  { id: 'modern', label: '现代' },
  { id: 'elegant', label: '简约' }
];

let currentTheme = themes[0];
let currentLayout = layouts[0].id;
let isCardMode = false;

// Initialize Theme Buttons
themes.forEach((theme) => {
  const btn = document.createElement('button');
  btn.className = `theme-btn ${theme.name === currentTheme.name ? 'active' : ''}`;
  btn.style.backgroundColor = theme.dark;
  btn.title = theme.name;
  btn.onclick = () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTheme = theme;
    generateQR();
  };
  themeSelector.appendChild(btn);
});

// Initialize Layout Buttons
layouts.forEach((layout) => {
  const btn = document.createElement('button');
  btn.className = `layout-btn ${layout.id === currentLayout ? 'active' : ''}`;
  btn.textContent = layout.label;
  btn.onclick = () => {
    document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLayout = layout.id;
    generateQR();
  };
  layoutSelector.appendChild(btn);
});

// Helper: Hex to RGBA
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// SVG Paths for Icons (24x24)
const iconPaths = {
  phone: new Path2D("M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.28 1.12.27 2.33.41 3.57.41.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.14 2.45.41 3.57.08.34-.01.74-.28 1.02l-2.2 2.2z"),
  email: new Path2D("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"),
  address: new Path2D("M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z")
};

const drawBusinessCard = async (text: string) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 600;
  const height = 350;
  canvas.width = width;
  canvas.height = height;

  // Base Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const name = cardNameInput.value || '您的姓名';
  const title = cardTitleInput.value;
  const org = cardOrgInput.value || '您的单位名称';
  const contacts = [
    { type: 'phone', value: cardPhoneInput.value },
    { type: 'email', value: cardEmailInput.value },
    { type: 'address', value: cardAddrInput.value }
  ];

  if (currentLayout === 'modern') {
    // --- Modern Layout (Sidebar) ---
    const sidebarWidth = 200;
    
    // Sidebar
    ctx.fillStyle = currentTheme.dark;
    ctx.fillRect(0, 0, sidebarWidth, height);
    
    // Sidebar Decoration
    ctx.beginPath();
    ctx.arc(sidebarWidth, height, 100, Math.PI, 1.5 * Math.PI);
    ctx.fillStyle = hexToRgba('#ffffff', 0.1);
    ctx.fill();

    // QR Code in Sidebar (White on Dark)
    const qrSize = 130;
    const qrX = (sidebarWidth - qrSize) / 2;
    const qrY = (height - qrSize) / 2;

    const qrCanvas = document.createElement('canvas');
    try {
      await QRCode.toCanvas(qrCanvas, text, {
        width: qrSize,
        margin: 0,
        color: { dark: currentTheme.dark, light: '#ffffff' }, // Standard QR, but will draw on white bg rounded rect
      });

      // White rounded rect for QR
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20 + 25, 12);
      ctx.fill();

      ctx.drawImage(qrCanvas, qrX, qrY);
      
      // Label
      ctx.fillStyle = '#4b5563';
      ctx.font = '11px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('扫码访问主页', qrX + qrSize / 2, qrY + qrSize + 25);

    } catch (err) {
      console.error(err);
    }

    // Right Side Content
    const contentX = sidebarWidth + 40;
    let contentY = 80;

    // Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 42px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(name, contentX, contentY);

    // Title
    if (title) {
      const nameWidth = ctx.measureText(name).width;
      ctx.fillStyle = currentTheme.dark;
      ctx.font = '500 20px "Microsoft YaHei", sans-serif';
      ctx.fillText(title, contentX + nameWidth + 15, contentY - 2);
    }

    contentY += 40;
    // Org
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px "Microsoft YaHei", sans-serif';
    ctx.fillText(org, contentX, contentY);

    // Divider
    contentY += 30;
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.moveTo(contentX, contentY);
    ctx.lineTo(width - 40, contentY);
    ctx.stroke();

    contentY += 40;
    // Contacts
    ctx.font = '15px "Inter", "Microsoft YaHei", sans-serif';
    ctx.textBaseline = 'middle'; // Align text vertically
    contacts.forEach(item => {
      if (item.value) {
        // Icon
        ctx.save();
        const iconScale = 0.7;
        const iconSize = 24 * iconScale;
        // Center icon vertically relative to text line
        const iconY = contentY - (iconSize / 2);
        
        ctx.translate(contentX, iconY);
        ctx.scale(iconScale, iconScale);
        ctx.fillStyle = currentTheme.dark;
        // @ts-ignore
        ctx.fill(iconPaths[item.type]);
        ctx.restore();

        // Text
        ctx.fillStyle = '#374151';
        ctx.fillText(item.value, contentX + 25, contentY);
        contentY += 32;
      }
    });
    ctx.textBaseline = 'alphabetic'; // Reset baseline

  } else if (currentLayout === 'elegant') {
    // --- Elegant Layout (Centered) ---
    
    // Border
    ctx.strokeStyle = currentTheme.dark;
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    // Inner Corner Decorations
    const cornerSize = 20;
    ctx.fillStyle = currentTheme.dark;
    // Top Left
    ctx.fillRect(15, 15, cornerSize, 4);
    ctx.fillRect(15, 15, 4, cornerSize);
    // Bottom Right
    ctx.fillRect(width - 15 - cornerSize, height - 15 - 4, cornerSize, 4);
    ctx.fillRect(width - 15 - 4, height - 15 - cornerSize, 4, cornerSize);

    let centerX = width / 2;
    let currentY = 70;

    // Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, currentY);

    // Title & Org
    currentY += 35;
    const titleOrg = title ? `${title} | ${org}` : org;
    ctx.fillStyle = '#4b5563';
    ctx.font = '18px "Microsoft YaHei", sans-serif';
    ctx.fillText(titleOrg, centerX, currentY);

    // QR Code (Centered)
    const qrSize = 120;
    const qrY = currentY + 30;
    
    const qrCanvas = document.createElement('canvas');
    try {
      await QRCode.toCanvas(qrCanvas, text, {
        width: qrSize,
        margin: 0,
        color: { dark: currentTheme.dark, light: '#ffffff' },
      });
      ctx.drawImage(qrCanvas, centerX - qrSize / 2, qrY);
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px "Microsoft YaHei", sans-serif';
      ctx.fillText('扫码访问个人主页', centerX, qrY + qrSize + 20);

    } catch (err) { console.error(err); }

    // Contacts (Bottom, Spread out or stacked?)
    // Let's stack them at the bottom sides or center? Center is safer.
    // If many contacts, might overflow. Let's put them on left/right of QR if space permits, 
    // or just below. Below QR is tight.
    // Let's put QR on Right, Info on Left? No, this is Centered layout.
    // Let's put contacts in a row at bottom?
    // Let's stack them below QR, small font.
    
    // Actually, let's put QR on Left, Info on Right for better balance in "Elegant"?
    // No, user wants "styles". Let's stick to Centered.
    
    // Adjust QR Y to be higher?
    // Let's try: Name/Title Top. QR Center. Contacts Left/Right of QR?
    // Let's try: Name Top. QR Bottom Left. Contacts Bottom Right.
    
    // Re-adjusting Elegant Layout:
    // Name/Title Centered Top.
    // Divider.
    // QR Bottom Left. Contacts Bottom Right.
    
    // Override previous "Centered" thought for better space usage.
    ctx.clearRect(0, 0, width, height); // Clear to restart layout
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = currentTheme.dark;
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Name
    ctx.fillStyle = currentTheme.dark;
    ctx.font = 'bold 32px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(name, 50, 80);

    // Title
    if (title) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px "Microsoft YaHei", sans-serif';
        ctx.fillText(title, 50, 110);
    }
    
    // Org (Top Right)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
    ctx.fillText(org, width - 50, 80);

    // Horizontal Line
    ctx.beginPath();
    ctx.moveTo(50, 130);
    ctx.lineTo(width - 50, 130);
    ctx.strokeStyle = '#f3f4f6';
    ctx.stroke();

    // Content below
    // Contacts Left
    let contactY = 180;
    ctx.textAlign = 'left';
    ctx.font = '14px "Inter", "Microsoft YaHei", sans-serif';
    ctx.textBaseline = 'middle'; // Align text vertically
    
    contacts.forEach(item => {
        if (item.value) {
            // Icon
            ctx.save();
            const iconScale = 0.6;
            const iconSize = 24 * iconScale;
            // Center icon vertically relative to text line
            const iconY = contactY - (iconSize / 2);
            
            ctx.translate(50, iconY);
            ctx.scale(iconScale, iconScale);
            ctx.fillStyle = currentTheme.dark;
            // @ts-ignore
            ctx.fill(iconPaths[item.type]);
            ctx.restore();

            // Text
            ctx.fillStyle = '#4b5563';
            ctx.fillText(item.value, 75, contactY);
            contactY += 35;
        }
    });
    ctx.textBaseline = 'alphabetic'; // Reset baseline

    // QR Right
    const qrSizeElegant = 140;
    const qrXElegant = width - 50 - qrSizeElegant;
    const qrYElegant = 150;

    const qrCanvasElegant = document.createElement('canvas');
    try {
        await QRCode.toCanvas(qrCanvasElegant, text, {
            width: qrSizeElegant,
            margin: 0,
            color: { dark: currentTheme.dark, light: '#ffffff' },
        });
        ctx.drawImage(qrCanvasElegant, qrXElegant, qrYElegant);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px "Microsoft YaHei", sans-serif';
        ctx.fillText('扫码访问主页', qrXElegant + qrSizeElegant/2, qrYElegant + qrSizeElegant + 20);
    } catch (e) {}


  } else {
    // --- Classic Layout (Original) ---
    
    // 2. Subtle Gradient Mesh / Geometric Shapes
    // Top-Right Large Circle (Theme Color, Low Opacity)
    ctx.beginPath();
    ctx.arc(width, 0, 300, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(currentTheme.light, 0.8);
    ctx.fill();

    // Bottom-Left Small Circle (Accent Color, Low Opacity)
    ctx.beginPath();
    ctx.arc(50, height, 120, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(currentTheme.accent, 0.1);
    ctx.fill();

    // --- Typography & Content ---
    const leftMargin = 50;
    let currentY = 100;

    // Name (Large, Bold)
    ctx.fillStyle = '#111827'; // Very dark grey
    ctx.font = 'bold 48px "Microsoft YaHei", Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(name, leftMargin, currentY);

    // Title (Medium, Theme Color)
    if (title) {
      const nameWidth = ctx.measureText(name).width;
      ctx.fillStyle = currentTheme.dark;
      ctx.font = '500 22px "Microsoft YaHei", Inter, sans-serif';
      ctx.fillText(title, leftMargin + nameWidth + 20, currentY - 2);
    }

    currentY += 45;

    // Organization (Regular, Grey)
    ctx.fillStyle = '#4b5563';
    ctx.font = '20px "Microsoft YaHei", Inter, sans-serif';
    ctx.fillText(org, leftMargin, currentY);

    // Divider Line
    currentY += 35;
    ctx.beginPath();
    ctx.moveTo(leftMargin, currentY);
    ctx.lineTo(leftMargin + 300, currentY);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    currentY += 35;

    // Contact Info
    const contactLineHeight = 36;
    ctx.font = `16px "Inter", "Microsoft YaHei", sans-serif`;
    ctx.textBaseline = 'middle'; // Align text vertically
    
    contacts.forEach(item => {
      if (item.value) {
        // Draw Icon
        ctx.save();
        const iconScale = 0.75; 
        const iconSize = 24 * iconScale;
        // Center icon vertically relative to text line
        const iconY = currentY - (iconSize / 2);
        
        ctx.translate(leftMargin, iconY);
        ctx.scale(iconScale, iconScale);
        
        ctx.fillStyle = currentTheme.dark;
        // @ts-ignore
        ctx.fill(iconPaths[item.type]);
        ctx.restore();

        // Separator (Centered height)
        const separatorX = leftMargin + 26;
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(separatorX, currentY - 7, 1, 14); // 14px height, centered at currentY

        // Value
        ctx.fillStyle = '#374151';
        ctx.fillText(item.value, separatorX + 12, currentY);
        
        currentY += contactLineHeight;
      }
    });
    ctx.textBaseline = 'alphabetic'; // Reset baseline

    // --- QR Code Section ---
    const qrSize = 140;
    const qrX = width - 50 - qrSize;
    const qrY = (height - qrSize) / 2;

    // QR Background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#ffffff';
    
    ctx.beginPath();
    ctx.roundRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30 + 30, 16);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';

    // Generate QR Code
    const qrCanvas = document.createElement('canvas');
    try {
      await QRCode.toCanvas(qrCanvas, text, {
        width: qrSize,
        margin: 0,
        color: { dark: currentTheme.dark, light: '#ffffff' },
      });

      ctx.drawImage(qrCanvas, qrX, qrY);

      // Label
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('扫码访问个人主页', qrX + qrSize / 2, qrY + qrSize + 30);

    } catch (err) {
      console.error(err);
    }
  }

  errorMessage.textContent = '';
  downloadBtn.disabled = false;
};

const generateQR = async () => {
  const text = input.value;
  
  if (!text && !isCardMode) {
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    downloadBtn.disabled = true;
    return;
  }

  if (isCardMode) {
    await drawBusinessCard(text || 'https://example.com');
  } else {
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
  }
};

let debounceTimer: number;
const handleInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    generateQR();
  }, 300);
};

// Event Listeners
input.addEventListener('input', handleInput);

[cardNameInput, cardTitleInput, cardOrgInput, cardPhoneInput, cardEmailInput, cardAddrInput].forEach(el => {
  el.addEventListener('input', handleInput);
});

cardModeCheckbox.addEventListener('change', (e) => {
  isCardMode = (e.target as HTMLInputElement).checked;
  if (isCardMode) {
    cardFieldsContainer.classList.add('visible');
    layoutSelector.style.display = 'flex'; // Show layout selector
    if (!input.value) input.value = window.location.href;
  } else {
    cardFieldsContainer.classList.remove('visible');
    layoutSelector.style.display = 'none'; // Hide layout selector
  }
  generateQR();
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `qrcode-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
