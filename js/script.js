/* ===== Fill these in. Anything left empty stays hidden. ===== */
const CFG = { email: "thakuribibek990@gmail.com", linkedin: "https://www.linkedin.com/in/bibek-malla-515b2732a/", instagram: "", cv: "" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const show = (el, href) => { if (el && href) { el.hidden = false; el.href = href; } };
show($("#liLink"), CFG.linkedin); show($("#liLink2"), CFG.linkedin);
show($("#igLink"), CFG.instagram); show($("#igLink2"), CFG.instagram);
show($("#cvBtn"), CFG.cv);
if (CFG.email) { const m = $("#mail"); m.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + CFG.email + "&su=Hello%20Bibek"; m.innerHTML = CFG.email + ' <span aria-hidden="true">↗</span>'; }
$("#year").textContent = new Date().getFullYear();

/* ---- Intro: "Hi, I'm / Bibek Malla. / Software Developer" rise out of a mask, one after another ---- */
function split(el, start, step) {
  const label = el.textContent.trim(); let n = 0;
  const html = label.split(" ").map(word => {
    const letters = [...word].map(c => {
      const acc = c === "." ? " acc" : "";
      return `<span class="ch${acc}" style="animation-delay:${(start + step * n++).toFixed(2)}s">${c}</span>`;
    }).join("");
    return `<span class="w">${letters}</span>`;
  }).join(" ");
  el.setAttribute("aria-label", label);
  el.innerHTML = `<span aria-hidden="true">${html}</span>`;
  return start + step * n;
}
split($("#hi"), 0.2, 0.05);
const nameEnd = split($("#name"), 0.55, 0.06);
split($("#role"), nameEnd + 0.1, 0.03);

/* ---- Mobile menu ---- */
const nav = $("#nav"), btn = $("#menuButton");
const setMenu = open => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); };
btn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
document.addEventListener("click", e => { if (!nav.contains(e.target) && !btn.contains(e.target)) setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 850) setMenu(false); });

/* ---- Highlight the nav link of the section in view ---- */
const links = $$("a", nav);
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.hash === "#" + e.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
links.forEach(a => { const s = $(a.hash); if (s) spy.observe(s); });

/* ---- Polish: scroll progress, scroll reveals, card spotlight ---- */
(() => {
  const bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true"); document.body.prepend(bar);
  let ticking = false;
  const update = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; ticking = false; };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true }); update();

  // Cursor-following spotlight on project cards
  $$(".project-card").forEach(card => card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect(); card.style.setProperty("--mx", (e.clientX - r.left) + "px"); card.style.setProperty("--my", (e.clientY - r.top) + "px");
  }));

  // Reveal sections, cards and groups as they scroll into view (staggered inside each row)
  const targets = $$(".section-label, .about-grid > div, .project-card, .skill-group, .contact > div, .footer");
  const seen = new Map();
  targets.forEach(el => { const k = el.parentElement; const i = seen.get(k) || 0; seen.set(k, i + 1); el.style.setProperty("--i", Math.min(i, 5) % 3); el.classList.add("reveal"); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; el.classList.add("in"); io.unobserve(el);
    setTimeout(() => el.classList.remove("reveal", "in"), 1200); // hand control back to the normal hover transitions
  }), { threshold: .08 });
  targets.forEach(el => io.observe(el));

  // Big headings: words rise out of a mask when they scroll into view
  let w = 0;
  const wrap = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(" "); return; }
          const o = document.createElement("span"), i = document.createElement("span");
          o.className = "rw"; i.textContent = t; i.style.setProperty("--w", w++); o.append(i); frag.append(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrap(n);
    });
  };
  const heads = $$(".about-title, .contact h2");
  heads.forEach(h => { h.setAttribute("aria-label", h.textContent.trim()); w = 0; wrap(h); });
  const hio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("rw-go"); hio.unobserve(e.target); } }), { threshold: .3 });
  heads.forEach(h => hio.observe(h));
})();
