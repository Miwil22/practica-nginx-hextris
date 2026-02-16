// --- OPTIMIZACIÓN DE CANVAS (Estrellas) ---
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
const offscreenCanvas = document.createElement('canvas');
const offCtx = offscreenCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Pre-renderizamos una estrella una sola vez
offscreenCanvas.width = 10;
offscreenCanvas.height = 10;
const grad = offCtx.createRadialGradient(5, 5, 0, 5, 5, 5);
grad.addColorStop(0, 'rgba(139, 92, 246, 1)');
grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
offCtx.fillStyle = grad;
offCtx.fillRect(0, 0, 10, 10);

let stars = [];
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.x = (s.x + s.vx + canvas.width) % canvas.width;
        s.y = (s.y + s.vy + canvas.height) % canvas.height;
        // Usamos drawImage en lugar de crear gradientes cada vez
        ctx.drawImage(offscreenCanvas, s.x, s.y, 10 * s.s, 10 * s.s);
    });
    requestAnimationFrame(animate);
}
animate();

// --- OPTIMIZACIÓN DE EDITOR (Debounce) ---
const input = document.getElementById('markdown-input');
const content = document.getElementById('content');

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const updatePreview = debounce(() => {
    content.innerHTML = marked.parse(input.value || '*Vista previa vacía*');
}, 300); // 300ms de espera

input.addEventListener('input', updatePreview);

// Funciones básicas de botones
const uploadBtn = document.getElementById('upload-btn');
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        document.getElementById('file-upload').click();
    });
}

// 2. Botón Limpiar
document.getElementById('clear-btn').addEventListener('click', () => {
    if (confirm('¿Deseas limpiar el editor?')) { 
        input.value = ''; 
        updatePreview(); 
    }
});

// 3. Botón Descargar
document.getElementById('download-btn').addEventListener('click', () => {
    const blob = new Blob([input.value], {type: 'text/markdown'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nota.md';
    a.click();
    // Liberamos la memoria del objeto URL
    URL.revokeObjectURL(url);
});

// 4. Cargar archivo (Sustituye al antiguo .onchange)
document.getElementById('file-upload').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => { 
            input.value = ev.target.result; 
            updatePreview(); 
        };
        reader.readAsText(e.target.files[0]);
    }
});

// Carga inicial
updatePreview();