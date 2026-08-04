/* ===== ZENITH ÉLITE PARFUM — interacción + i18n ES/EN ===== */
(function(){
  const ROOT = document.getElementById("zenith-app"); if(!ROOT) return;
  const M = ZENITH.marca;
  const CIUDAD = { es:"toda Colombia", en:"all of Colombia" };

  // idioma persistente
  let lang = localStorage.getItem("zenith_lang") || "es";
  if(lang!=="es" && lang!=="en") lang="es";

  // link WhatsApp (único, botón flotante): usa whatsappLink si existe, si no arma wa.me
  function waHref(){
    if(M.whatsappLink && !M.whatsappLink.startsWith("[")) return M.whatsappLink;
    if(M.whatsapp && !M.whatsapp.startsWith("[")) return "https://wa.me/"+encodeURIComponent(M.whatsapp);
    return "#";
  }
  const waEl = document.getElementById("wa-float"); if(waEl) waEl.href = waHref();

  // frasco del hero (mitad superior) = Bleu de Chanel (imagen base64 de data.js)
  const heroImg = document.getElementById("hero-bottle-img");
  if(heroImg){ const hp = ZENITH.productos.find(x=>x.id==="bleu") || ZENITH.productos[0];
    if(hp && hp.img && !hp.img.startsWith("[")) heroImg.src = hp.img; }

  // año
  const y=document.getElementById("year"); if(y) y.textContent="2026";

  // header scroll
  const hdr=document.getElementById("hdr");
  addEventListener("scroll",()=>hdr.classList.toggle("scrolled",scrollY>20));

  // menú móvil
  const burger=document.getElementById("burger"), links=document.getElementById("navlinks");
  burger?.addEventListener("click",()=>links.classList.toggle("open"));
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

  // reemplaza tokens dinámicos ([ciudadEnvio]) en un texto
  function tok(s){ return String(s).replaceAll("[ciudadEnvio]", CIUDAD[lang]); }

  // ---- productos ----
  const grid=document.getElementById("grid-prod");
  function card(p){
    const t=T[lang];
    const badge = (p.badge && p.badge[lang]) ? `<span class="badge">${p.badge[lang]}</span>` : "";
    const genLabel = p.genero==="h" ? t.f_h : t.f_m;
    const precioAntes = p.precioAntes && !p.precioAntes.startsWith("[")
        ? `<span class="was">${M.moneda}${p.precioAntes}</span>` : "";
    const media = (p.img && !p.img.startsWith("["))
        ? `<img src="${p.img}" alt="${p.nombre}" loading="lazy">`
        : `<div class="noimg ph"><b>${p.nombre}</b>[FOTO DEL FRASCO — 1000×1000 px]</div>`;
    const buyHref = (p.paymentLink && !p.paymentLink.startsWith("[")) ? p.paymentLink : "#";
    const stock = p.disponible ? `<div class="stock">${t.c_in}</div>` : `<div class="stock out">${t.c_out}</div>`;
    return `<article class="card" data-g="${p.genero}">
      <div class="card-media">${badge}<span class="genero">${genLabel}</span>${media}</div>
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <div class="insp">${p.marca}</div>
        <div class="meta"><b>${t.c_family}</b> ${p.familia[lang]}</div>
        <div class="meta"><b>${t.c_notes}</b> ${p.notas[lang]}</div>
        <div class="meta"><b>${t.c_occ}</b> ${p.ocasion[lang]} · <b>${t.c_size}</b> ${p.ml}</div>
        <div class="price"><span class="now">${M.moneda}${p.precio}</span>${precioAntes}</div>
        <a href="${buyHref}" class="btn btn-gold btn-block" target="_blank" rel="noopener">${t.c_buy}</a>
        ${stock}
      </div>
    </article>`;
  }
  function renderProducts(){ if(grid) grid.innerHTML = ZENITH.productos.map(card).join(""); }

  // filtros
  document.getElementById("filters")?.addEventListener("click",e=>{
    const b=e.target.closest(".chip"); if(!b) return;
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    b.classList.add("active");
    const f=b.dataset.f;
    grid.querySelectorAll(".card").forEach(c=>{ c.style.display=(f==="all"||c.dataset.g===f)?"":"none"; });
  });

  // FAQ
  const faq=document.getElementById("faq-list");
  function renderFaq(){
    if(!faq) return;
    faq.innerHTML = ZENITH.faq.map(f=>`
      <div class="qa"><button>${f.q[lang]}<span class="plus">+</span></button>
      <div class="ans"><p>${tok(f.a[lang])}</p></div></div>`).join("");
  }
  faq?.addEventListener("click",e=>{
    const btn=e.target.closest("button"); if(!btn) return;
    const qa=btn.parentElement, ans=qa.querySelector(".ans");
    const open=qa.classList.toggle("open");
    ans.style.maxHeight = open ? ans.scrollHeight+"px" : 0;
  });

  // ---- aplicar idioma a textos estáticos ----
  function applyI18n(){
    const t=T[lang];
    ROOT.querySelectorAll("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n"); if(t[k]!=null) el.textContent=tok(t[k]);
    });
    ROOT.querySelectorAll("[data-i18n-html]").forEach(el=>{
      const k=el.getAttribute("data-i18n-html"); if(t[k]!=null) el.innerHTML=tok(t[k]);
    });
    document.documentElement.lang = lang;
    // botones del toggle
    document.querySelectorAll("#lang button").forEach(b=>b.classList.toggle("active", b.dataset.lang===lang));
  }

  function setLang(l){ lang=l; localStorage.setItem("zenith_lang",l); applyI18n(); renderProducts(); renderFaq(); }

  document.getElementById("lang")?.addEventListener("click",e=>{
    const b=e.target.closest("button"); if(!b) return; setLang(b.dataset.lang);
  });

  // init
  applyI18n(); renderProducts(); renderFaq();
})();
