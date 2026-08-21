/* Forest Atelier page: deep forest atmosphere, warm ivory breathing room, restrained champagne cues, editorial asymmetry. */
import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Instagram, Menu, Phone, Play, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const logo = "/assets/brand/spr-homecraft-logo.png";
const img = {
  hero: "/assets/photos/IMG_1651.jpg",
  sectional: "/assets/photos/IMG_1650.jpg",
  warm: "/assets/photos/IMG_1649.jpg",
  teal: "/assets/photos/IMG_1648.jpg",
  grey: "/assets/photos/IMG_1647.jpg",
};
const videos = [
  "/assets/videos/6B55C86C-A674-4EF3-9F7E-AB7544D4CB0D-web.mp4",
  "/assets/videos/5B933899-C98D-4F8E-AAD9-DC1009BFE3F0-web.mp4",
  "/assets/videos/E75CBEBB-D689-44F8-A0DF-8C6A940D0AA8-web.mp4",
  "/assets/videos/41DFB788-ECAD-4BF6-B2EF-A2CC1BDE936A-web.mp4",
];

const heroSlides = [
  { video: videos[0], label: "THE CURVED EDIT", title: "A softer way\nto gather.", detail: "A sculptural sectional designed around slow evenings and easy conversation." },
  { video: videos[1], label: "THE EVERYDAY EDIT", title: "Comfort,\nconsidered.", detail: "Proportion, depth and finish tuned to the way your home moves." },
  { video: videos[2], label: "THE CRAFT EDIT", title: "Made to\nbelong.", detail: "Thoughtful details, tactile fabrics and a shape that feels unmistakably yours." },
  { video: videos[3], label: "THE LOUNGE EDIT", title: "Room for\nmore life.", detail: "Generous seating for the rituals, people and stories that make a room." },
];

const projects = [
  { title: "The White Room", type: "Residential", image: img.hero, span: "tall" },
  { title: "Teal Geometry", type: "Living rooms", image: img.teal, span: "wide" },
  { title: "A Soft Landing", type: "Custom furniture", image: img.warm, span: "standard" },
  { title: "The Family Sectional", type: "Residential", image: img.grey, span: "wide" },
  { title: "An Everyday Retreat", type: "Living rooms", image: img.sectional, span: "standard" },
];

const services = [
  { no: "01", name: "Custom sofas", copy: "Seating shaped to the way your home actually lives.", image: img.hero },
  { no: "02", name: "Living spaces", copy: "Layered rooms with comfort at the centre of the plan.", image: img.teal },
  { no: "03", name: "Custom furniture", copy: "One-off pieces built around your dimensions and rituals.", image: img.warm },
  { no: "04", name: "Commercial projects", copy: "Furniture systems that make a considered first impression.", image: img.grey },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`} aria-label="SPR Homecraft home">
      <img src={logo} alt="SPR Homecraft emblem" />
      <span><strong>SPR</strong><small>HOMECRAFT</small></span>
    </a>
  );
}

function EnquiryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;
  return (
    <div className="drawer-backdrop" role="dialog" aria-modal="true" aria-label="Request a quote">
      <div className="drawer">
        <button className="drawer-close" onClick={onClose} aria-label="Close enquiry form"><X size={20} /></button>
        {!sent ? <>
          <p className="eyebrow">BEGIN A CONVERSATION</p>
          <h2>Bring us the room.<br /><em>We’ll shape what comes next.</em></h2>
          <p className="drawer-intro">Tell us a little about your space, and our design team will be in touch from Hyderabad.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!supabase) { toast.error("Enquiries are not configured yet."); return; }
            setSubmitting(true);
            const data = new FormData(e.currentTarget);
            const result = await supabase.from("enquiries").insert({ name: String(data.get("name") ?? ""), email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? "") || null, message: String(data.get("message") ?? ""), status: "new" });
            if (result.error) toast.error(result.error.message); else setSent(true);
            setSubmitting(false);
          }}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
            <label>Phone (optional)<input name="phone" placeholder="+91 …" /></label>
            <label>What are you imagining?<textarea name="message" rows={3} required placeholder="A sectional sofa, a full living room, something in between..." /></label>
            <button className="button button--gold" type="submit" disabled={submitting}>{submitting ? "SENDING…" : "SEND ENQUIRY"} <ArrowUpRight size={16} /></button>
          </form>
        </> : <div className="sent-state"><span className="sent-icon"><Check /></span><p className="eyebrow">ENQUIRY RECEIVED</p><h2>Thank you.<br /><em>We’ll be in touch.</em></h2><p>Our team will review your note and reach out shortly.</p><button className="button button--outline" onClick={onClose}>BACK TO SHOWROOM</button></div>}
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeHero, setActiveHero] = useState(0);
  const [pointerStart, setPointerStart] = useState<number | null>(null);
  const filteredProjects = useMemo(() => filter === "All" ? projects : projects.filter((p) => p.type.toLowerCase() === filter.toLowerCase()), [filter]);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveHero((current) => (current + 1) % heroSlides.length), 7800);
    return () => window.clearInterval(timer);
  }, []);

  const moveHero = (direction: number) => setActiveHero((current) => (current + direction + heroSlides.length) % heroSlides.length);
  const handleHeroPointerDown = (event: ReactPointerEvent<HTMLElement>) => setPointerStart(event.clientX);
  const handleHeroPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 45) moveHero(distance < 0 ? 1 : -1);
    setPointerStart(null);
  };

  const openQuote = () => { setMenuOpen(false); setDrawerOpen(true); };
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return <div className="site-shell" id="home">
    <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
      <Logo />
      <nav className="desktop-nav" aria-label="Main navigation">
        {["about", "furniture", "projects", "process", "gallery"].map((item) => <button key={item} onClick={() => scrollTo(item)}>{item}</button>)}
      </nav>
      <button className="nav-cta" onClick={openQuote}>REQUEST A QUOTE <ArrowUpRight size={15} /></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
    </header>
    {menuOpen && <div className="mobile-menu"><Logo compact /><div>{["about", "furniture", "projects", "process", "gallery"].map((item, i) => <button key={item} onClick={() => scrollTo(item)}><span>0{i + 1}</span>{item}</button>)}</div><button className="button button--gold" onClick={openQuote}>REQUEST A QUOTE <ArrowUpRight size={16} /></button></div>}

    <main>
      <section className="hero-section hero-split-section" aria-labelledby="hero-title" onPointerDown={handleHeroPointerDown} onPointerUp={handleHeroPointerUp}>
        <div className="hero-split-background"><img src={img.hero} alt="Curved ivory sectional sofa in a bright living room" /></div>
        <div className="hero-shade hero-split-shade" />
        <div className="hero-copy hero-split-copy">
          <p className="eyebrow hero-eyebrow">{heroSlides[activeHero].label} · HYDERABAD</p>
          <h1 id="hero-title">{heroSlides[activeHero].title.split("\n").map((line, index) => <span key={line} className="hero-line-text">{index > 0 && <br />}<i>{line}</i></span>)}</h1>
          <p className="hero-subtitle">{heroSlides[activeHero].detail}</p>
          <div className="hero-actions"><button className="button button--gold" onClick={() => scrollTo("projects")}>EXPLORE OUR WORK <ArrowDownRight size={17} /></button><button className="text-link" onClick={openQuote}>START A PROJECT <ArrowUpRight size={16} /></button></div>
        </div>
        <aside className="hero-video-rail" aria-label="SPR Homecraft video gallery">
          <div className="hero-rail-heading"><span className="eyebrow">THE HOMECRAFT REEL</span><span>01 — 04</span></div>
          <div className="hero-rail-grid">{heroSlides.map((slide, index) => <div className={`hero-rail-tile ${index === activeHero ? "active" : ""}`} key={slide.label}><video src={slide.video} muted autoPlay loop playsInline preload="metadata" /><div className="hero-rail-tint" /><span className="hero-rail-index">0{index + 1}</span><span className="hero-rail-caption">{slide.label}</span></div>)}</div>
          <div className="hero-video-controls"><button onClick={() => moveHero(-1)} aria-label="Previous video"><ArrowLeft size={17} /></button><div className="hero-progress">{heroSlides.map((slide, index) => <button key={slide.label} className={index === activeHero ? "active" : ""} onClick={() => setActiveHero(index)} aria-label={`Highlight video ${index + 1}`} />)}</div><button onClick={() => moveHero(1)} aria-label="Next video"><ArrowRight size={17} /></button></div>
        </aside>
        <div className="hero-meta"><span>SWIPE TO EXPLORE</span><span className="hero-line" /></div>
        <div className="hero-index">0{activeHero + 1} <span>/</span> 0{heroSlides.length}</div>
      </section>

      <section className="intro-section section-pad" id="about">
        <div className="intro-aside"><p className="eyebrow">SPR HOMECRAFT</p><span className="vertical-rule" /><p className="side-note">DESIGN<br />COMFORT<br />QUALITY</p></div>
        <div className="intro-copy"><p className="eyebrow">A DIFFERENT KIND OF FIT</p><h2>Furniture that<br /><em>belongs</em> to your space.</h2><p className="large-copy">Every room has its own character. We create customised furniture that works with your dimensions, lifestyle, comfort and aesthetic — combining thoughtful design with skilled craftsmanship.</p><button className="text-link text-link--dark" onClick={() => scrollTo("process")}>HOW WE WORK <ArrowUpRight size={16} /></button></div>
        <div className="intro-image"><img src={img.warm} alt="Warm ivory L-shaped sofa in a softly lit room" /><span className="image-caption">01 / CONSIDERED COMFORT</span></div>
      </section>

      <section className="story-section section-pad" id="process">
        <div className="story-heading"><p className="eyebrow eyebrow--gold">THE HOMECRAFT METHOD</p><h2>More than<br /><em>furniture.</em></h2><p>From the first idea to final installation, we keep the process considered, transparent and entirely yours.</p></div>
        <div className="process-list">{[["01", "Understand", "We start with your room, your routines, your references."], ["02", "Design", "Proportion, comfort and material come together on paper."], ["03", "Craft", "Our makers bring the design to life with care and precision."], ["04", "Deliver", "Your piece arrives ready for the space it was made for."], ["05", "Install", "The final detail is placed, tuned and made at home."]].map(([no, title, copy]) => <div className="process-item" key={no}><span className="process-no">{no}</span><h3>{title}</h3><p>{copy}</p><ChevronRight size={18} /></div>)}</div>
      </section>

      <section className="services-section section-pad" id="furniture"><div className="section-heading-row"><div><p className="eyebrow">WHAT WE CREATE</p><h2>Rooms with<br /><em>something to say.</em></h2></div><p className="section-lede">Not off-the-shelf. Not one-size-fits-all. Just furniture shaped around a life in motion.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.no}><div className="service-image"><img src={service.image} alt={service.name} /></div><div className="service-content"><span>{service.no}</span><div><h3>{service.name}</h3><p>{service.copy}</p></div><ArrowUpRight size={20} /></div></article>)}</div></section>

      <section className="featured-section section-pad"><div className="section-heading-row"><div><p className="eyebrow">THE COLLECTION</p><h2>The pieces<br /><em>that stay with you.</em></h2></div><button className="text-link" onClick={() => scrollTo("gallery")}>VIEW THE GALLERY <ArrowUpRight size={16} /></button></div><div className="feature-grid"><article className="feature-card feature-card--large"><img src={img.teal} alt="Teal custom sofa with gold detailing" /><div><span className="eyebrow">01 · CUSTOM SECTIONAL</span><h3>Modern L-Shape</h3><p>Comfort with a little more character.</p></div></article><article className="feature-card feature-card--small"><img src={img.grey} alt="Grey modular sectional sofa" /><div><span className="eyebrow">02 · FAMILY LOUNGE</span><h3>The Everyday</h3><p>Built for long conversations.</p></div></article></div></section>

      <section className="projects-section section-pad" id="projects"><div className="projects-top"><div><p className="eyebrow eyebrow--gold">SELECTED WORK</p><h2>Spaces we’ve<br /><em>crafted.</em></h2></div><div className="filter-row">{["All", "Residential", "Living rooms", "Custom furniture"].map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="project-masonry">{filteredProjects.map((project) => <article className={`project-card project-card--${project.span}`} key={project.title}><img src={project.image} alt={project.title} /><div className="project-overlay"><span>{project.type}</span><h3>{project.title}</h3><ArrowUpRight size={20} /></div></article>)}</div></section>

      <section className="reel-section section-pad" id="gallery"><div className="reel-heading"><p className="eyebrow">A CLOSER LOOK</p><h2>See it<br /><em>come together.</em></h2><p>Real spaces. Real materials. A glimpse into the details that make a piece feel like yours.</p></div><div className="video-reel">{videos.map((video, index) => <div className="video-tile" key={video}><video src={video} muted loop autoPlay playsInline /><div className="video-top"><span>0{index + 1}</span><span>SPR / REEL</span></div><span className="play-mark"><Play size={14} fill="currentColor" /></span></div>)}</div></section>

      <section className="contact-section"><div className="contact-mark"><img src={logo} alt="SPR Homecraft" /></div><div><p className="eyebrow eyebrow--gold">YOUR SPACE, NEXT</p><h2>Let’s make<br /><em>room for more.</em></h2><p>Tell us what you’re imagining. We’ll help you find the shape, material and finish to make it real.</p><button className="button button--gold" onClick={openQuote}>BOOK A CONSULTATION <ArrowUpRight size={17} /></button><div className="contact-links"><a href="tel:+919666687123"><Phone size={15} /> +91 96666 87123</a><a href="https://www.instagram.com/spr.homecrafts?igsi=a3NzanN4ZWVmczd2" target="_blank" rel="noreferrer"><Instagram size={15} /> @spr.homecrafts</a></div><div className="contact-locations"><p className="eyebrow eyebrow--gold">VISIT THE WORKSHOP</p><a href="https://www.google.com/maps/place/Spr+homecraft+unit+1,+Sai+Nagar+Colony,+Badnaipet,+Hyderabad,+Telangana+500005/@17.3070702,78.5128135,15z/data=!4m6!3m5!1s0x3bcba3003a0da651:0xa80f2e48a0cde813!8m2!3d17.3070702!4d78.5128135!16s%2Fg%2F11z1k8l_2j?g_ep=Eg1tbF8yMDI2MDgxN18wIOC7DCoASAJQAg%3D%3D" target="_blank" rel="noreferrer">Unit 1 · Sai Nagar Colony, Badnaipet <ArrowUpRight size={14} /></a><a href="https://www.google.com/maps/place/7G4Q%2BPJG+Spr+homecraft+unit+2,+Nadargul,+Telangana+501510/@17.2565603,78.5391526,16z/data=!4m6!3m5!1s0x3bcba3007f48dea9:0x4b8049e326a59da2!8m2!3d17.2565603!4d78.5391526!16s%2Fg%2F11nq1ggj33?g_ep=Eg1tbF8yMDI2MDgxN18wIOC7DCoASAJQAg%3D%3D" target="_blank" rel="noreferrer">Unit 2 · Nadargul, Telangana <ArrowUpRight size={14} /></a></div></div></section>
    </main>

    <footer className="site-footer"><Logo compact /><p>Premium customised furniture<br />designed in Hyderabad.</p><div className="footer-links"><a href="#about">About</a><a href="#projects">Projects</a><a href="#gallery">Gallery</a><a href="tel:+919666687123">+91 96666 87123</a><a href="https://www.instagram.com/spr.homecrafts?igsi=a3NzanN4ZWVmczd2" target="_blank" rel="noreferrer">Instagram</a><a href="mailto:hello@sprhomecraft.com">Email us</a></div><span className="copyright">© 2026 SPR HOMECRAFT</span></footer>
    <EnquiryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
  </div>;
}
