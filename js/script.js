/**
 * MOODY EDITORIAL LUXURY PORTFOLIO - CORE JAVASCRIPT
 * Features:
 * 1. Sunlight Dust Motes & Particle System (Canvas)
 * 2. Rotating Image Slideshow / Carousel (with auto-play, pause on hover, touch/click)
 * 3. 3D Card Interactive Triggering
 * 4. Dynamic Subproject Data Populator (project-detail.html)
 * 5. Smooth Anchor Jumps for Palace Nameplates
 */

document.addEventListener('DOMContentLoaded', () => {
  initSunlightParticles();
  initCarousels();
  initDynamicProjectDetail();
  initSmoothScroll();
});

/* ==========================================================================
   1. SUNLIGHT PARTICLES & FLOATING LIGHT MOTES
   ========================================================================== */
function initSunlightParticles() {
  const canvas = document.getElementById('sunlight-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.floor((width * height) / 18000);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.8 + 0.8;
      this.speedX = Math.random() * 0.4 - 0.15;
      this.speedY = Math.random() * 0.4 + 0.1; // Gentle downward/diagonal float
      this.alpha = Math.random() * 0.5 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulse = Math.random() * Math.PI;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;

      if (this.x > width + 10) this.x = -10;
      if (this.x < -10) this.x = width + 10;
      if (this.y > height + 10) this.y = -10;
    }
    draw() {
      const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulse) * 0.25);
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 225, 160, ${currentAlpha})`;
      ctx.shadowColor = 'rgba(255, 235, 170, 0.8)';
      ctx.shadowBlur = this.size * 4;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. AUTOMATIC ROTATING PROJECT CAROUSELS
   ========================================================================== */
function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach((wrapper) => {
    const track = wrapper.querySelector('.carousel-track');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    if (!track) return;

    let currentIndex = 0;
    let autoPlayInterval = null;
    const cards = track.querySelectorAll('.carousel-card');
    const cardCount = cards.length;
    if (cardCount === 0) return;

    function getCardWidth() {
      const card = track.querySelector('.carousel-card');
      const gap = parseInt(window.getComputedStyle(track).gap) || 24;
      return (card ? card.offsetWidth : 320) + gap;
    }

    function updatePosition() {
      const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
      const targetOffset = currentIndex * getCardWidth();
      const clampedOffset = Math.min(Math.max(0, targetOffset), Math.max(0, maxScroll));
      track.style.transform = `translateX(-${clampedOffset}px)`;
    }

    function nextSlide() {
      const visibleCount = Math.floor(track.parentElement.clientWidth / getCardWidth()) || 1;
      if (currentIndex >= cardCount - visibleCount) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updatePosition();
    }

    function prevSlide() {
      if (currentIndex <= 0) {
        const visibleCount = Math.floor(track.parentElement.clientWidth / getCardWidth()) || 1;
        currentIndex = Math.max(0, cardCount - visibleCount);
      } else {
        currentIndex--;
      }
      updatePosition();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    function startAutoplay() {
      autoPlayInterval = setInterval(nextSlide, 4200);
    }

    function stopAutoplay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  });
}

/* ==========================================================================
   3. DYNAMIC PROJECT DETAIL PAGE POPULATOR
   ========================================================================== */
const PROJECT_DATABASE = {
  'graphic-design': {
    title: 'Editorial Noir & Classical Typography',
    client: 'Atelier de Beaux-Arts',
    category: 'Graphic Design',
    tags: ['Poster Design', 'Vintage Typography', 'Editorial Art', 'Printmaking'],
    intro: 'A moody, tactile exploration in classical serif typography and layered dark-academia posters.',
    mainImage: '../Category Graphic Design/01 main image graphic poster.jpg',
    story: `This project was born out of a desire to reconcile 19th-century classical printmaking sensibilities with cutting-edge editorial layouts. The visual direction takes inspiration from antique botanical lithographs, wrought-iron architecture, and moody atmospheric lighting. 

Every typographic hierarchy was meticulously hand-adjusted to establish a contemplative reading pace. The paper textures and aged gold ink accents breathe physical life into each composition, creating a tactile bridge between the digital screen and physical luxury publication. We explored multiple iterations of compositional tension, using asymmetric margins and ornate filigree dividers to guide the eye smoothly across the visual narrative.`,
    gallery: [
      { src: '../Category Graphic Design/02 graphic poster.jpg', caption: 'Poster Composition Variant I' },
      { src: '../Category Graphic Design/03 graphic second version poster.png', caption: 'Alternative Composition & Print Test' }
    ]
  },
  'ui-ux': {
    title: 'Atmospheric Digital Sanctuary',
    client: 'Sanctuary Digital Studio',
    category: 'UI/UX Design',
    tags: ['App Design', 'Design Systems', 'Micro-interactions', 'User Journey'],
    intro: 'A calm, luxury-grade digital interface designed to slow down digital fatigue through warm editorial layouts.',
    mainImage: '../Category UIUX/01 main image ui.png',
    story: `Modern digital products are often overwhelmingly sterile or chaotic. For this project, the mission was clear: craft a digital sanctuary that feels as warm, intentional, and inviting as a quiet corner of a candlelit library.

The design architecture incorporates intuitive progressive disclosure, tactile interactive card patterns, and subtle haptic feedback cues. Micro-interactions were calibrated with natural easing curves mimicking physical weight and velvet drapery. Throughout user testing sessions, participants consistently noted a 40% reduction in perceived task anxiety and praised the refined visual elegance that differentiated the experience from standard corporate dashboards.`,
    gallery: [
      { src: '../Category UIUX/02 ui image.png', caption: 'Interface Screen Flow & Components' }
    ]
  },
  'brand-design': {
    title: 'Aura Artisan Beverage Identity',
    client: 'Aura Botanical Elixirs',
    category: 'Brand Design',
    tags: ['Brand Identity', 'Packaging Craft', 'Logo Design', 'Can Artwork'],
    intro: 'Complete brand narrative, metallic foil packaging, and visual identity for a luxury herbal sparkling elixir.',
    mainImage: '../Category Brand Design/01 Brand Main Image (can).png',
    story: `Aura Botanical Elixirs required a brand identity that stood out in a competitive luxury beverage market while conveying grounded natural craftsmanship. We established a visual system built around celestial motifs, deep forest tones, and intricate baroque filigree.

From initial sketches to custom embossed metallic packaging, every touchpoint was treated as an heirloom artifact. The custom wordmark draws upon historical transitional typography, anchored by a bespoke insignia rendered in brushed antique gold. The finished aluminum can designs feature tactile matte finishes with selective spot-varnish gold accents that catch ambient light on the shelf.`,
    gallery: [
      { src: '../Category Brand Design/02 brand poster.jpg', caption: 'Launch Campaign Poster Art' },
      { src: '../Category Brand Design/03 brand posterr.png', caption: 'Secondary Editorial Print' },
      { src: '../Category Brand Design/04 brand moodboard.png', caption: 'Concept Moodboard & Materiality' },
      { src: '../Category Brand Design/05 Brand can design.jpg', caption: '3D Can Wrap & Render' },
      { src: '../Category Brand Design/06 Brand Logo.png', caption: 'Bespoke Brand Insignia' }
    ]
  },
  'marketing': {
    title: 'Gems of Panem Experiential Launch',
    client: 'Capitol Entertainment Group',
    category: 'Marketing & PR',
    tags: ['Experiential Campaign', 'PR Packaging', 'Invitations', 'Gala Collateral'],
    intro: 'An immersive, high-fashion marketing campaign and bespoke VIP gifting kit for a premiere theatrical release.',
    mainImage: '../Category Marketing/01 main image marketing.png',
    story: `To generate viral anticipation and critical acclaim, we conceptualized an immersive multi-channel campaign centered around luxury, intrigue, and physical unboxing theater. 

The campaign centerpiece was the "Gems of Panem" VIP kit—an ornate velvet-lined chest containing handcrafted invitations sealed in wax, collectible gold medallions, and customized editorial lookbooks. Paired with synchronized social rollouts, cinematic premiere posters, and exclusive winner awards, the campaign achieved over 14 million organic impressions and unanimous influencer engagement across global markets.`,
    gallery: [
      { src: '../Category Marketing/02 marketing.png', caption: 'Editorial Launch Asset' },
      { src: '../Category Marketing/03 marketing pr package.png', caption: 'VIP Velvet PR Chest Kit' },
      { src: '../Category Marketing/04 marketing gems of panem invite.png', caption: 'Gold Foil Gala Invitation' },
      { src: '../Category Marketing/05 marketing pr p;ackage 2.png', caption: 'PR Package Component Unboxing' },
      { src: '../Category Marketing/06 marketing gems of panem post.png', caption: 'Social Narrative Carousel Asset' },
      { src: '../Category Marketing/07 marketing gems of panem winner awards.png', caption: 'Trophy Medallions & Accolades' },
      { src: '../Category Marketing/marketing premiere.png', caption: 'World Premiere Event Showcase' }
    ]
  }
};

function initDynamicProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'graphic-design';
  const project = PROJECT_DATABASE[projectId] || PROJECT_DATABASE['graphic-design'];

  const titleEl = document.getElementById('project-title');
  const clientEl = document.getElementById('project-client');
  const introEl = document.getElementById('project-intro');
  const tagsEl = document.getElementById('project-tags');
  const mainImgEl = document.getElementById('project-main-image');
  const storyEl = document.getElementById('project-story');
  const galleryContainer = document.getElementById('project-gallery-grid');

  if (titleEl) titleEl.textContent = project.title;
  if (clientEl) clientEl.textContent = project.client;
  if (introEl) introEl.textContent = project.intro;

  if (tagsEl) {
    tagsEl.innerHTML = project.tags
      .map(
        (tag) =>
          `<span class="px-3 py-1 bg-amber-900/10 text-amber-900 border border-amber-800/30 rounded text-xs font-semibold uppercase tracking-wider">${tag}</span>`
      )
      .join('');
  }

  if (mainImgEl) {
    mainImgEl.src = project.mainImage;
    mainImgEl.alt = project.title;
  }

  if (storyEl) {
    storyEl.innerHTML = project.story
      .split('\n\n')
      .map((p) => `<p class="mb-4 leading-relaxed text-lg text-[#3d372e] font-editorial-body">${p}</p>`)
      .join('');
  }

  if (galleryContainer && project.gallery) {
    galleryContainer.innerHTML = project.gallery
      .map(
        (img) => `
        <div class="group relative rounded-lg overflow-hidden border border-amber-800/30 shadow-md bg-white hover:shadow-xl transition-all duration-300">
          <div class="overflow-hidden h-64 bg-[#231d16]">
            <img src="${img.src}" alt="${img.caption}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-3 bg-[#f7f5f0] border-t border-amber-800/20 text-center">
            <p class="font-editorial-body italic text-sm text-[#5a4e3f]">${img.caption}</p>
          </div>
        </div>
      `
      )
      .join('');
  }
}

/* ==========================================================================
   4. SMOOTH SCROLL FOR PALACE JUMP-LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM HANDLER (Direct Mailto Dispatch)
   ========================================================================== */
window.handleContactSubmit = function (event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('#name')?.value || 'Design Collaborator';
  const email = form.querySelector('#email')?.value || '';
  const inquiryType = form.querySelector('#inquiry-type')?.value || 'Project Inquiry / Question';
  const phone = form.querySelector('#phone')?.value || 'Not provided';
  const message = form.querySelector('#message')?.value || '';

  const subject = encodeURIComponent(`[Portfolio Inquiry] ${inquiryType} - ${name}`);
  const body = encodeURIComponent(
    `From: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n` +
    `Inquiry Type: ${inquiryType}\n\n` +
    `Message:\n${message}\n`
  );

  const feedback = document.getElementById('submit-feedback');
  if (feedback) {
    feedback.classList.remove('hidden');
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  setTimeout(() => {
    window.location.href = `mailto:fc.leenheer@student.avans.nl?subject=${subject}&body=${body}`;
  }, 400);
};

