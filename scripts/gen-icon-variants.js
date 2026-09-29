const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'generated-icons-tmp');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const variants = {
  // A: 蓝→青 渐变 + 白色大括号 + JSON 节点点（iOS 风干净版）
  'variant-a-blue-teal': `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2D6BFF"/>
      <stop offset="100%" stop-color="#15C2A8"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-width="76" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 460 240 C 320 280, 300 430, 470 512 C 300 594, 320 744, 460 784"/>
    <path d="M 564 240 C 704 280, 724 430, 554 512 C 724 594, 704 744, 564 784"/>
  </g>
  <circle cx="512" cy="392" r="44" fill="#ffffff"/>
  <circle cx="512" cy="632" r="44" fill="#ffffff"/>
</svg>`,

  // B: 靛紫渐变 + 白色大括号 + 顶部高光（更"高级"质感）
  'variant-b-indigo-violet': `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366F1"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#g)"/>
  <rect x="40" y="40" width="944" height="430" rx="190" ry="190" fill="#ffffff" opacity="0.10"/>
  <g fill="none" stroke="#ffffff" stroke-width="76" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 460 240 C 320 280, 300 430, 470 512 C 300 594, 320 744, 460 784"/>
    <path d="M 564 240 C 704 280, 724 430, 554 512 C 724 594, 704 744, 564 784"/>
  </g>
  <circle cx="512" cy="392" r="44" fill="#ffffff"/>
  <circle cx="512" cy="632" r="44" fill="#ffffff"/>
</svg>`,

  // C: 深色背景 + 霓虹青绿大括号 + JSON 节点（开发者/科技感）
  'variant-c-dark-neon': `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#10243A"/>
    </linearGradient>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#34D399"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="224" ry="224" fill="url(#g)"/>
  <g fill="none" stroke="url(#b)" stroke-width="76" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 460 240 C 320 280, 300 430, 470 512 C 300 594, 320 744, 460 784"/>
    <path d="M 564 240 C 704 280, 724 430, 554 512 C 724 594, 704 744, 564 784"/>
  </g>
  <circle cx="512" cy="392" r="44" fill="#22D3EE"/>
  <circle cx="512" cy="632" r="44" fill="#34D399"/>
  <circle cx="470" cy="512" r="20" fill="#A7F3D0"/>
  <circle cx="554" cy="512" r="20" fill="#A7F3D0"/>
</svg>`
};

(async () => {
  for (const [name, svg] of Object.entries(variants)) {
    const svgPath = path.join(OUT, name + '.svg');
    const pngPath = path.join(OUT, name + '.png');
    fs.writeFileSync(svgPath, svg.trim());
    await sharp(svgPath).png().toFile(pngPath);
    console.log('rendered', pngPath);
  }
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
