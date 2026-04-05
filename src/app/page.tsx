'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Play, Zap, Code2, Sparkles, Menu, X, ArrowRight, ExternalLink, Shield, Layers, Workflow } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Gallery image data ─── */
const galleryImages = [
  { id: 61, title: 'Cinematic Portrait', specs: '85mm • f/1.8 • Rembrandt lighting' },
  { id: 62, title: 'Street Narrative', specs: '35mm • f/2.8 • Golden hour' },
  { id: 63, title: 'Architectural Detail', specs: '24mm • f/8 • Tilt-shift' },
  { id: 64, title: 'Environmental Portrait', specs: '50mm • f/1.4 • Split lighting' },
  { id: 65, title: 'Abstract Texture', specs: '100mm macro • f/2.8 • Ring light' },
  { id: 66, title: 'Urban Night', specs: '28mm • f/1.4 • Neon reflections' },
];

/* ─── Skill card data ─── */
const skillCards = [
  {
    icon: Camera,
    title: 'Foundation',
    color: 'text-cyan-400',
    items: [
      'Technical Prompt Engineering',
      'Photographic Literacy (Rembrandt, Anamorphic, f-stops)',
      'GSAP Core (to/from/timeline)',
      'Color Theory & Composition',
    ],
  },
  {
    icon: Shield,
    title: 'Consistency Layer',
    color: 'text-emerald-400',
    items: [
      'Identity Preservation + Negation',
      'Stagger + ScrollTrigger',
      'Playwright E2E Verification',
      'Responsive Design Systems',
    ],
  },
  {
    icon: Workflow,
    title: 'Orchestration',
    color: 'text-amber-400',
    items: [
      'Agent Workflows + UIUX Pro Max',
      'Hybrid AI + GSAP Pipelines',
      'Production Deploy (Vercel + CI)',
      'Performance Optimization',
    ],
  },
];

export default function UpgradedPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const hasAnimated = useRef(false);

  /* ─── GSAP ScrollTrigger cleanup ─── */
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  /* ─── Main animation timeline ─── */
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo(heroRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1.2 })
        .fromTo('.hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 }, '-=0.6')
        .fromTo('.hero-char', { opacity: 0, y: 80, rotateX: -90 }, {
          opacity: 1, y: 0, rotateX: 0, stagger: 0.025, duration: 1, ease: 'back.out(1.2)',
        }, '-=0.3')
        .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
        .fromTo('.hero-buttons > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 }, '-=0.3');

      // Parallax layers on scroll
      gsap.utils.toArray<HTMLElement>('.parallax').forEach((layer) => {
        gsap.to(layer, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: layer,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
          },
        });
      });

      // Skill cards staggered entrance
      gsap.fromTo('.skill-card',
        { opacity: 0, scale: 0.85, y: 60 },
        {
          opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: skillsRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );

      // Skill section heading
      gsap.fromTo('.skills-heading',
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: skillsRef.current, start: 'top 80%' },
        }
      );

      // Gallery items entrance
      gsap.utils.toArray<HTMLElement>('.gallery-item').forEach((item, i) => {
        gsap.fromTo(item,
          { rotationY: -15, opacity: 0, y: 40 },
          {
            rotationY: 0, opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: galleryRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });

      // AI Lab section
      gsap.fromTo('.lab-content',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: labRef.current, start: 'top 75%' },
        }
      );

      // Tools section
      gsap.fromTo('.tools-content',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: toolsRef.current, start: 'top 75%' },
        }
      );

      // Footer reveal
      gsap.fromTo(footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1,
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  /* ─── Playwright demo handler ─── */
  const runPlaywrightDemo = useCallback(() => {
    const demoSteps = [
      '✓ Verifying hero section load...',
      '✓ Checking GSAP ScrollTrigger registration...',
      '✓ Testing gallery image lazy-load...',
      '✓ Simulating AI prompt submission...',
      '✓ Validating mobile 9:16 responsive layout...',
      '✓ Checking accessibility (ARIA labels)...',
      '✓ Measuring Core Web Vitals...',
    ];

    // Simple inline demo — in production, this triggers real Playwright
    const result = demoSteps.join('\n');
    alert(`Playwright E2E Demo Results:\n\n${result}\n\nAll tests passed ✓`);
  }, []);

  /* ─── AI Prompt generation simulation ─── */
  const handleGenerate = useCallback(async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setGeneratedResult(null);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const enhancedPrompt = `🎨 Enhanced Prompt:\n\n"${promptText}"\n\n→ Optimized with: cinematic depth, volumetric lighting, 85mm perspective, subsurface scattering, film grain overlay, color graded in DaVinci Resolve.\n\n⚡ Ready for Midjourney v7 / DALL-E 4 / Stable Diffusion XL`;
    setGeneratedResult(enhancedPrompt);
    setIsGenerating(false);
  }, [promptText]);

  /* ─── Split text into characters for hero animation ─── */
  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="hero-char" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 font-mono text-lg tracking-tighter">
            <span className="text-cyan-400">MARK</span>•UPGRADED
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
            <a href="#skills" className="nav-link hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#gallery" className="nav-link hover:text-cyan-400 transition-colors">Gallery</a>
            <a href="#lab" className="nav-link hover:text-cyan-400 transition-colors">AI Lab</a>
            <a href="#tools" className="nav-link hover:text-cyan-400 transition-colors">Tools</a>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-md px-6 py-6 space-y-4">
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest hover:text-cyan-400 transition">Skills</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest hover:text-cyan-400 transition">Gallery</a>
            <a href="#lab" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest hover:text-cyan-400 transition">AI Lab</a>
            <a href="#tools" onClick={() => setMobileMenuOpen(false)} className="block text-sm uppercase tracking-widest hover:text-cyan-400 transition">Tools</a>
          </div>
        )}
      </nav>

      {/* ═══ HERO — Quiet Luxury with GSAP ═══ */}
      <section ref={heroRef} className="min-h-screen flex items-center relative pt-20 gsap-section">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 parallax" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        {/* Lens flares */}
        <div className="lens-flare bottom-32 right-16 md:right-32" />
        <div className="lens-flare-alt bottom-48 right-48 md:right-72" />

        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-white/20 rounded-full text-xs tracking-widest opacity-0">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>PROFESSIONAL VISUAL ENGINEER 2026</span>
            </div>

            {/* Animated title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter mb-8">
              {splitText('PRECISION.')}
              <br />
              {splitText('NOT PROMPTS.')}
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-white/60 mb-10 md:mb-12 max-w-lg leading-relaxed opacity-0">
              Upgraded front-end. GSAP timelines. AI photography engine. Playwright automation.
            </p>

            {/* CTA buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4">
              <a
                href="#lab"
                className="px-8 md:px-10 py-4 bg-white text-black font-medium flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all group rounded-sm"
              >
                ENTER AI LAB
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </a>
              <button
                onClick={runPlaywrightDemo}
                className="px-8 md:px-10 py-4 border border-white/30 hover:border-white flex items-center justify-center gap-3 transition-all rounded-sm"
              >
                <Play className="w-5 h-5" />
                RUN E2E DEMO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SKILLS MAP ═══ */}
      <section id="skills" ref={skillsRef} className="py-24 md:py-32 border-t border-white/10 gsap-section">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="skills-heading mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-mono">Core Competencies</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
              Skill Synergy Map
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {skillCards.map((card) => (
              <div
                key={card.title}
                className="skill-card bg-white/[0.03] border border-white/10 p-8 md:p-10 rounded-2xl hover:border-cyan-400/40 transition-all duration-300 group"
              >
                <div className={`${card.color} mb-6`}>
                  <card.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold mb-5">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="text-white/60 flex items-start gap-3 text-sm md:text-base">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PHOTOGRAPHY GALLERY ═══ */}
      <section id="gallery" ref={galleryRef} className="py-24 md:py-32 bg-zinc-950 gsap-section">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-mono">Visual Showcase</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
              AI Photography Gallery
            </h2>
            <p className="text-white/50 mt-4 max-w-md">
              Each image demonstrates precision prompt engineering, cinematic lighting, and photographic technique principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="gallery-item group relative overflow-hidden rounded-2xl aspect-[9/16] bg-zinc-900 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <img
                  src={`https://picsum.photos/id/${img.id}/600/900`}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute bottom-5 left-5 right-5 z-20">
                  <p className="text-sm font-medium mb-1">{img.title}</p>
                  <p className="text-xs text-white/50 font-mono">{img.specs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PROMPT LAB ═══ */}
      <section id="lab" ref={labRef} className="py-24 md:py-32 border-t border-white/10 gsap-section">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lab-content">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-mono">Interactive Tool</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            AI Prompt Lab
          </h2>
          <p className="text-lg text-white/50 mb-10 md:mb-12">
            Live scaffold from the Photography AI skills framework. Craft cinematic prompts with technical precision.
          </p>

          <div className="bg-zinc-900/80 p-6 md:p-10 rounded-2xl border border-white/10">
            <label htmlFor="ai-prompt" className="block text-sm text-white/50 mb-3 font-mono">
              Enter your visual concept
            </label>
            <textarea
              id="ai-prompt"
              className="textarea-glow w-full h-40 md:h-48 bg-black/60 border border-white/15 p-5 rounded-xl text-base md:text-lg resize-y focus:outline-none focus:border-cyan-400/60 transition-all font-mono placeholder:text-white/20"
              placeholder="A serious executive in shadows, dramatic side lighting, 85mm f/2.8, subsurface scattering on skin..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />

            {/* Generation result */}
            {generatedResult && (
              <div className="mt-6 p-5 bg-black/60 border border-cyan-400/20 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono leading-relaxed">
                  {generatedResult}
                </pre>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !promptText.trim()}
              className="mt-6 w-full py-4 md:py-5 bg-white text-black font-medium text-base md:text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  GENERATING...
                </>
              ) : (
                <>
                  GENERATE + ANIMATE
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ ANIMATION SHOWCASE ═══ */}
      <section className="py-24 md:py-32 bg-zinc-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-mono">Technical Preview</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Animation Showcase
          </h2>
          <p className="max-w-lg mx-auto text-white/50 mb-14">
            GSAP-powered scroll-driven animations with ScrollTrigger, stagger effects, parallax layers, and micro-interactions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'ScrollTrigger', desc: 'Pin & scrub timelines' },
              { label: 'Stagger', desc: 'Sequential reveals' },
              { label: 'Parallax', desc: 'Depth layer motion' },
              { label: 'Flip', desc: 'Layout transitions' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl hover:border-cyan-400/30 transition-all duration-300 text-left group"
              >
                <Layers className="w-8 h-8 text-white/30 mb-4 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AUTOMATION TOOLS ═══ */}
      <section id="tools" ref={toolsRef} className="py-24 md:py-32 bg-black border-t border-white/10 gsap-section">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center tools-content">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4 font-mono">Quality Assurance</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Playwright + Front-End Automation
          </h2>
          <p className="max-w-lg mx-auto text-white/50 mb-10 md:mb-12">
            One-click e2e tests for GSAP timelines, AI interactions, and performance gates. Every animation verified automatically.
          </p>

          <button
            onClick={runPlaywrightDemo}
            className="px-10 md:px-16 py-6 md:py-8 border-2 border-white text-xl md:text-2xl font-medium hover:bg-white hover:text-black transition-all flex items-center gap-4 mx-auto rounded-sm"
          >
            <Code2 className="w-7 h-7 md:w-8 md:h-8" />
            LAUNCH PLAYWRIGHT SUITE
            <ExternalLink className="w-5 h-5" />
          </button>

          <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs opacity-40 font-mono">
            <span>Hero load</span>
            <span>•</span>
            <span>Scroll triggers</span>
            <span>•</span>
            <span>Prompt simulation</span>
            <span>•</span>
            <span>Mobile 9:16</span>
            <span>•</span>
            <span>Accessibility</span>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER CTA ═══ */}
      <footer ref={footerRef} className="py-20 border-t border-white/10 text-center opacity-60">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-center gap-2 font-mono text-sm tracking-tighter mb-6">
            <span className="text-cyan-400">MARK</span>•UPGRADED
          </div>
          <p className="text-sm text-white/40 mb-8">
            Upgraded 2026 — Built for compounding impact — Mark Tantongco stack
          </p>
          <div className="flex justify-center gap-6 text-xs text-white/30">
            <span>Next.js 16</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS 4</span>
            <span>•</span>
            <span>GSAP 3.14</span>
            <span>•</span>
            <span>Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
