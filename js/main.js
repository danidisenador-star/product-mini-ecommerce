/* =====================================================================
   MAIN.JS · arma la página con lo que escribiste en js/config.js
   (casi nunca necesitas tocar este archivo)
   ===================================================================== */
(function () {
  "use strict";
  var K = window.KOZ;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;
  var isDesk = function () { return window.matchMedia("(min-width: 900px)").matches; };

  /* ───────── utilidades ───────── */
  var tt;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3400); }
  function wa(text) { return "https://wa.me/" + String(K.whatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(text); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function icon(id) { return '<svg class="ic"><use href="#i-' + id + '"/></svg>'; }
  function full(p) { return p.marca + " " + p.nombre; }

  $$("[data-brand]").forEach(function (e) { e.textContent = K.nombre; });
  $("#mapBtn").href = K.mapaUrl;
  $("#advisorBtn").href = wa(K.mensajes.asesor);

  /* ───────── CARRITO (lista para WhatsApp) ───────── */
  var cart = [];
  function cartMsg(base, extra) { return base + "\n" + cart.map(function (n) { return "• " + n; }).join("\n") + (extra ? "\n" + extra : ""); }
  function renderCart(bump) {
    var n = cart.length;
    $("#navCtaLabel").textContent = n ? "Consultar" : "Agenda tu cita";
    $("#navCart").hidden = !n; $("#navCount").textContent = n;
    $("#navCta").href = wa(n ? cartMsg(K.mensajes.conProductos) : K.mensajes.cita);
    $("#catalogLabel").textContent = n ? "Enviar mi consulta (" + n + ")" : "Ver el catálogo completo";
    $$("[data-cart]").forEach(function (b) {
      var on = cart.indexOf(b.getAttribute("data-cart")) > -1; b.setAttribute("aria-pressed", on);
      if (b.classList.contains("chip")) b.textContent = on ? "✓ Agregado" : "Agregar a mi consulta";
    });
    if (bump) { var c = $("#navCta"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  }
  function toggleCart(n) { var i = cart.indexOf(n); if (i > -1) cart.splice(i, 1); else cart.push(n); renderCart(true); }
  function openCatalog() { window.open(wa(cart.length ? cartMsg(K.mensajes.conProductos) : K.mensajes.catalogo), "_blank", "noopener"); }
  $("#catalogBtn").addEventListener("click", openCatalog);

  /* ───────── TARJETAS DE PRODUCTO ───────── */
  var cardsBox = $("#cards");
  K.productos.forEach(function (p, i) {
    var c = el("article", "card"); c.style.setProperty("--i", i);
    c.innerHTML = (p.descuento ? '<span class="card__tag">' + esc(p.descuento) + "</span>" : "") +
      '<button class="card__cart" type="button" data-cart="' + esc(full(p)) + '" aria-pressed="false" aria-label="Agregar ' + esc(full(p)) + ' a mi consulta">' + icon("cart") + "</button>" +
      '<div class="card__img"><img src="' + esc(p.imagen) + '" alt="' + esc(full(p)) + '" loading="lazy"></div>' +
      '<h3 class="card__brand">' + esc(p.marca) + '</h3><p class="card__desc">' + esc(p.desc) + "</p>";
    $(".card__cart", c).addEventListener("click", function (e) { toggleCart(full(p)); var b = e.currentTarget; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
    cardsBox.appendChild(c);
  });
  renderCart();

  /* ═════════ HEADER: VIDEO → VISTA 3D FALSA (sprite sheet de 6 vistas) ═════════ */
  var hero = $("#hero"), hv = $("#heroVideo"), state = "intro";
  $("#heroPoster").src = K.hero.poster;
  if (K.hero.video) { hv.src = K.hero.video; hv.hidden = false; var pp = hv.play(); if (pp && pp.catch) pp.catch(function () {}); }
  $("#startHint").textContent = (canHover && isDesk()) ? "Arrastra el mouse para girar" : "Desliza tus dedos";

  var vp = K.productos.filter(function (p) { return p.sprite; }).slice(0, 2), vi = 0, frame = 0, nF = 6, spin, touched = false, dragging = false;
  var vImg = $("#v3dImg"), stage = $("#v3dStage");
  vp.forEach(function (p) { var im = new Image(); im.src = p.sprite; });   // precarga
  function setFrame(f) { frame = ((f % nF) + nF) % nF; vImg.style.backgroundPosition = (nF > 1 ? frame / (nF - 1) * 100 : 0) + "% 0"; }
  var ar = .81;   // proporción (ancho/alto) de UNA vista del sprite; se detecta sola al cargar la imagen
  /* Ajusta el tamaño del recuadro 3D para que quepa en el header sin deformar el producto */
  function fit() {
    var v = $("#v3d"); if (v.hidden || !v.clientHeight) return;
    var cs = getComputedStyle(v), pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0, pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
    var desk = isDesk(), availW = v.clientWidth - pl - pr, availH = v.clientHeight - pt - pb - (desk ? 0 : $(".v3d__info").offsetHeight + 8);
    var w = Math.min(desk ? availW * .52 : availW, availH * ar);
    stage.style.width = w + "px"; stage.style.height = w / ar + "px";
  }
  window.addEventListener("resize", fit);
  function setProduct(i) {
    vi = (i + vp.length) % vp.length; var p = vp[vi]; nF = p.frames || 6;
    vImg.style.backgroundImage = "url('" + p.sprite + "')"; vImg.style.backgroundSize = (nF * 100) + "% 100%";
    // 🎨 fondo y color de texto de ESTE producto (se editan en js/config.js: bgColor y colorTexto)
    hero.style.setProperty("--tour-bg", p.bgColor || ""); hero.style.setProperty("--tour-text", p.colorTexto || "");
    ar = p.aspect || ar; fit();
    if (!p.aspect) { var im = new Image(); im.onload = function () { ar = (im.naturalWidth / nF) / im.naturalHeight; fit(); }; im.src = p.sprite; }
    $("#v3dBrand").textContent = p.marca; $("#v3dName").textContent = p.nombre; $("#v3dDesc").textContent = p.desc3d || "";
    $("#v3dNextName").textContent = vp[(vi + 1) % vp.length].marca; $("#v3dNext").hidden = vp.length < 2;
    fit(); setFrame(0);
    var v = $("#v3d"); v.style.animation = "none"; void v.offsetWidth; v.style.animation = "";
  }
  function startSpin() { stopSpin(); if (reduce) return; spin = setInterval(function () { if (!touched && !dragging) setFrame(frame + 1); }, 230); }
  function stopSpin() { clearInterval(spin); }

  /* Arrastrar con dedo o mouse: cada ~38px cambia una vista */
  var sx = 0, sf = 0;
  stage.addEventListener("pointerdown", function (e) { hideHint(); dragging = touched = true; sx = e.clientX; sf = frame; try { stage.setPointerCapture(e.pointerId); } catch (x) {} });
  stage.addEventListener("pointermove", function (e) { if (dragging) setFrame(sf - Math.round((e.clientX - sx) / 38)); });
  ["pointerup", "pointercancel"].forEach(function (n) { stage.addEventListener(n, function () { dragging = false; }); });

  /* Avisito de cómo girar: aparece al abrir el 3D y desaparece al arrastrar (o a los pocos segundos) */
  var hintT;
  function showHint(txt, ms) { clearTimeout(hintT); $("#v3dHintText").textContent = txt; $("#v3dHint").classList.add("show"); hintT = setTimeout(hideHint, ms || 6500); }
  function hideHint() { clearTimeout(hintT); $("#v3dHint").classList.remove("show"); }
  var tourT;
  function startTour() {
    if (state !== "intro" || !vp.length) return; state = "tour"; touched = false;
    // 1) el velo (color del producto) cubre el video y el texto se desvanece
    hero.style.setProperty("--tour-bg", vp[0].bgColor || ""); hero.style.setProperty("--tour-text", vp[0].colorTexto || "");
    hero.classList.remove("hero--intro"); hero.classList.add("hero--tour"); document.body.classList.add("tour-on");
    // 2) cuando el fondo ya es liso (≈0.75 s) aparece el producto: así no se ve ningún recorte ni superposición
    tourT = setTimeout(function () {
      if (state !== "tour") return;
      if (!hv.hidden) hv.pause();
      $("#v3d").hidden = false; ["#v3dBack", "#heroFull"].forEach(function (s) { $(s).hidden = false; });
      if (K.hero.botonGiroscopio && "DeviceOrientationEvent" in window) $("#v3dGyro").hidden = false;
      setProduct(0); startSpin();
      // ✏️ TEXTOS DEL AVISO (cámbialos aquí): web / móvil
      showHint((canHover && isDesk()) ? "Rota el producto con el mouse" : "Rota el producto con tus dedos");
    }, 750);
  }
  function exitTour() {
    clearTimeout(tourT); hideHint(); state = "intro"; stopSpin(); stopGyro();
    $("#v3d").hidden = true; ["#v3dBack", "#heroFull", "#v3dNext", "#v3dGyro"].forEach(function (s) { $(s).hidden = true; });
    hero.classList.remove("hero--tour"); hero.classList.add("hero--intro"); document.body.classList.remove("tour-on"); if (!hv.hidden) hv.play();
  }
  hero.addEventListener("click", function (e) { if (state === "intro" && !e.target.closest("a")) startTour(); });
  $("#v3dBack").addEventListener("click", function (e) { e.stopPropagation(); exitTour(); });
  $("#v3dNext").addEventListener("click", function (e) { e.stopPropagation(); setProduct(vi + 1); });
  $("#heroFull").addEventListener("click", function (e) { e.stopPropagation(); if (document.fullscreenElement) document.exitFullscreen(); else if (hero.requestFullscreen) hero.requestFullscreen(); });

  /* Giroscopio: inclinar el dispositivo gira el producto (en iPhone pide permiso y necesita https) */
  var gyroOn = false, gyroSeen = false;
  function onOri(e) { if (e.gamma == null) return; gyroSeen = true; touched = true; var g = Math.max(-40, Math.min(40, e.gamma)); setFrame(Math.round((g + 40) / 80 * (nF - 1))); }
  function stopGyro() { window.removeEventListener("deviceorientation", onOri); gyroOn = false; $("#v3dGyro").classList.remove("is-on"); $("#gyroText").textContent = "Giroscopio"; }
  $("#v3dGyro").addEventListener("click", function (e) {
    e.stopPropagation(); if (gyroOn) { stopGyro(); toast("Giroscopio desactivado."); return; }
    var go = function () {
      window.addEventListener("deviceorientation", onOri); gyroOn = true; gyroSeen = false; $("#gyroText").textContent = "Giroscopio activo"; showHint("Mueve tu celular para rotar el producto", 5000);   // ✏️ texto del giroscopio
      setTimeout(function () { if (gyroOn && !gyroSeen) { stopGyro(); toast("Este dispositivo no tiene giroscopio. Arrastra para girar."); } }, 1600);
    };
    var D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === "function") D.requestPermission().then(function (r) { if (r === "granted") go(); else toast("Permiso denegado."); }).catch(function () { toast("No se pudo activar el giroscopio."); });
    else go();
  });

  /* ═════════ BUSCADOR + PREGUNTAS FRECUENTES (Google Sheets opcional) ═════════ */
  var catalog = K.productos.map(function (p) { return { nombre: full(p), disponible: p.disponible !== false, palabrasClave: p.palabrasClave + "," + p.marca + "," + p.nombre, descripcion: p.desc, respuesta: "" }; });
  var faqs = K.preguntasLocal.slice(), rutinas = K.rutinas.slice();

  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false, i, ch;
    for (i = 0; i < text.length; i++) {
      ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
      else cur += ch;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows.shift().map(function (h) { return norm(h).replace(/ /g, "_"); });
    return rows.filter(function (r) { return r.join("").trim(); }).map(function (r) { var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); }); return o; });
  }
  function loadSheet(u) { return fetch(u, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(parseCSV); }
  function pick(r, names) { for (var i = 0; i < names.length; i++) if (r[names[i]]) return r[names[i]]; return ""; }
  function sameName(a, b) { a = norm(a); b = norm(b); return !!a && !!b && (a === b || (Math.min(a.length, b.length) >= 5 && (a.indexOf(b) > -1 || b.indexOf(a) > -1))); }

  if (K.sheetProductos) loadSheet(K.sheetProductos).then(function (rows) {
    var fs = [];
    rows.forEach(function (r) {
      var name = pick(r, ["producto", "nombre", "nombre_del_producto"]); if (!name) return;
      var loc = null; catalog.forEach(function (l) { if (!loc && sameName(l.nombre, name)) loc = l; });
      var yes = /^(si|true|1|x|disponible|yes|activo|ok)/.test(norm(pick(r, ["disponible", "disponibilidad", "estado"])));
      fs.push({ nombre: loc ? loc.nombre : name, disponible: yes, palabrasClave: (pick(r, ["palabras_clave", "palabras", "problemas"]) || (loc ? loc.palabrasClave : "")) + "," + name,
        descripcion: pick(r, ["descripcion"]) || (loc ? loc.descripcion : ""), respuesta: pick(r, ["respuesta"]), fromSheet: true });
    });
    if (fs.length) catalog = fs.concat(catalog.filter(function (l) { return !fs.some(function (f) { return sameName(f.nombre, l.nombre); }); }));
  }).catch(function (e) { console.warn("Hoja de productos no disponible, uso la lista local.", e); });

  if (K.sheetPreguntas) loadSheet(K.sheetPreguntas).then(function (rows) {
    var fs = [];
    rows.forEach(function (r) {
      var q = pick(r, ["pregunta", "preguntas"]), a = pick(r, ["respuesta", "respuestas"]);
      if (q && a) fs.push({ pregunta: q, palabrasClave: pick(r, ["palabras_clave", "palabras"]), respuesta: a, fromSheet: true });
    });
    if (fs.length) faqs = fs.concat(faqs.filter(function (l) { return !fs.some(function (f) { return norm(f.pregunta) === norm(l.pregunta); }); }));
  }).catch(function (e) { console.warn("Hoja de preguntas no disponible.", e); });

  /* Busca la imagen y la marca de un producto de la rutina: primero en K.productosRutina, luego en el catalogo */
  function findRoutineProduct(nom) {
    var p = null;
    (K.productosRutina || []).concat(K.productos).forEach(function (x) { if (!p && (sameName(x.nombre, nom) || sameName(full(x), nom))) p = x; });
    return p;
  }
  function imgSrc(s) { return String(s || "").replace(/ /g, "%20"); }   // permite archivos con espacios (ej. "Glow Toning.png")

  if (K.sheetRutinas) loadSheet(K.sheetRutinas).then(function (rows) {
    var rs = [];
    rows.forEach(function (r) {
      var pasos = [];
      [1, 2, 3].forEach(function (n) {
        var nom = r["producto_" + n]; if (!nom) return;
        var p = findRoutineProduct(nom);   // marca e imagen salen de config.js (productosRutina); la hoja puede pisarlas con marca_1 / imagen_1 (opcional)
        pasos.push({ marca: r["marca_" + n] || (p ? p.marca : ""), nombre: p ? p.nombre : nom, beneficio: r["beneficio_" + n] || "", imagen: r["imagen_" + n] || (p ? p.imagen : "assets/img/prod-1.svg") });
      });
      if (pasos.length) rs.push({ problemas: r.problemas || "", pasos: pasos });
    });
    if (rs.length) rutinas = rs;
  }).catch(function (e) { console.warn("Hoja de rutinas no disponible.", e); });

  function score(q, terms) {
    var qt = q.split(" ").filter(function (t) { return t.length > 1; }), best = 0;
    terms.forEach(function (raw) {
      var t = norm(raw); if (!t) return;
      if (t === q) best = Math.max(best, 100);
      else if (q.length > 2 && t.indexOf(q) > -1) best = Math.max(best, 80);
      else if (t.length > 2 && q.indexOf(t) > -1) best = Math.max(best, 70);
      else { var tt = t.split(" "), sh = qt.filter(function (w) { return tt.some(function (x) { return x === w || (w.length >= 4 && x.length >= 4 && x.slice(0, 5) === w.slice(0, 5)); }); }).length; if (sh) best = Math.max(best, 40 + sh * 10); }
    });
    return best;
  }
  function search(query) {
    var q = norm(query), prods = [], bestF = null, fs = 0;
    catalog.forEach(function (s) { var sc = score(q, String(s.palabrasClave).split(",")); if (sc && s.fromSheet) sc += 25; if (sc >= 40) prods.push({ s: s, sc: sc }); });
    faqs.forEach(function (f) { var sc = score(q, [f.pregunta].concat(String(f.palabrasClave).split(","))); if (sc && f.fromSheet) sc += 25; if (sc > fs) { fs = sc; bestF = f; } });
    prods.sort(function (a, b) { return b.sc - a.sc; });
    if (bestF && fs >= 40 && (!prods.length || fs > prods[0].sc)) return { faq: bestF };
    return prods.length ? { prods: prods.filter(function (p) { return p.sc >= prods[0].sc - 20; }).slice(0, 3).map(function (p) { return p.s; }) } : null;
  }

  var chat = $("#chat"), chips = $("#chips"), input = $("#searchInput"), sbtn = $("#searchBtn"), answered = false, lastQ = "", ct;
  K.sugerencias.forEach(function (s) { var b = el("button", "chip", esc(s)); b.type = "button"; b.addEventListener("click", function () { input.value = s; run(s); }); chips.appendChild(b); });
  function reset() { clearTimeout(ct); answered = false; lastQ = ""; input.value = ""; sbtn.textContent = "Buscar"; chat.innerHTML = ""; chat.appendChild(chips); }
  function run(q) {
    q = q.trim(); if (!q) { input.focus(); return; }
    clearTimeout(ct); answered = true; lastQ = q; sbtn.textContent = "Borrar"; chat.innerHTML = "";
    chat.appendChild(el("div", "msg msg--user", esc(q)));
    var ty = el("div", "msg msg--bot msg--typing", "<i></i><i></i><i></i>"); chat.appendChild(ty);
    ct = setTimeout(function () {
      ty.remove(); var hit = search(q), html = "";
      if (!hit) html = esc(K.sinResultado);
      else if (hit.faq) html = esc(hit.faq.respuesta);
      else {
        html = hit.prods.length > 1 ? "Estas opciones pueden ayudarte:<br>" : "";
        hit.prods.forEach(function (s) {
          if (s.respuesta) html += "<div>" + esc(s.respuesta) + "</div>";
          else if (s.disponible) html += '<div style="margin-top:6px"><strong>' + esc(s.nombre) + "</strong>. " + esc(s.descripcion) + '<div class="msg__actions"><button class="chip" type="button" data-cart="' + esc(s.nombre) + '" aria-pressed="false">Agregar a mi consulta</button></div></div>';
          else html += '<div style="margin-top:6px"><strong>' + esc(s.nombre) + "</strong> no está disponible por ahora. Escríbenos y te avisamos cuando llegue.</div>";
        });
      }
      var bot = el("div", "msg msg--bot", html);
      $$("[data-cart]", bot).forEach(function (b) { b.addEventListener("click", function () { toggleCart(b.getAttribute("data-cart")); }); });
      var back = el("div", "msg msg--back", '<button type="button">Volver</button>'); back.addEventListener("click", reset);
      chat.appendChild(bot); chat.appendChild(back); renderCart();
    }, 600);
  }
  $("#searchForm").addEventListener("submit", function (e) { e.preventDefault(); run(input.value); });
  sbtn.addEventListener("click", function (e) { if (answered && input.value.trim() === lastQ) { e.preventDefault(); reset(); } });
  input.addEventListener("input", function () { if (answered && input.value.trim() !== lastQ) sbtn.textContent = "Buscar"; });

  /* ═════════ TUTORIALES Y TIPS (móvil: visor tipo TikTok · PC: se reproduce en su lugar) ═════════ */
  function ytUrl(u) { if (!/youtube|youtu\.be/.test(u)) return u; return u + (u.indexOf("?") > -1 ? "&" : "?") + "autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"; }
  function yt(f, fn, a) { try { f.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: a || [] }), "*"); } catch (e) {} }
  function setSound(m, on) { if (!m) return; if (m.tagName === "IFRAME") [0, 300, 900, 2000].forEach(function (t) { setTimeout(function () { yt(m, on ? "unMute" : "mute"); yt(m, "playVideo"); }, t); }); else m.muted = !on; }
  function makeMedia(v, o) {
    o = o || {};
    if (v.tipo === "iframe") { var f = document.createElement("iframe"); f.src = ytUrl(v.src); f.title = v.titulo || "Video"; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; return f; }
    var m = document.createElement("video"); m.src = v.src; if (v.poster) m.poster = v.poster; m.setAttribute("playsinline", ""); m.preload = "metadata"; m.loop = !!o.loop; m.muted = !!o.muted; m.controls = !!o.controls;
    m.addEventListener("error", function () { toast("Aún no hay video en esa ruta. Súbelo a assets/video y cámbialo en config.js"); }); return m;
  }
  var row = $("#tipsRow"), tips = [];
  K.tutoriales.slice(0, 3).forEach(function (v, i) {
    var it = el("div", "tip", '<img src="' + esc(v.poster) + '" alt="' + esc(v.titulo) + '" loading="lazy"><span class="play">' + icon("play") + "</span>");
    it.tabIndex = 0; it.setAttribute("role", "button"); it.setAttribute("aria-label", "Ver " + v.titulo);
    var act = function () { if (!canHover || window.innerWidth < 900) openFeed(i); else playHere(it, v); };
    it.addEventListener("click", act); it.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    row.appendChild(it); tips.push(it);
  });
  function stopHere(it) { var m = $("video,iframe", it); if (m) m.remove(); var s = $(".snd", it); if (s) s.remove(); it.classList.remove("is-playing"); }
  function playHere(it, v) {
    if (it.classList.contains("is-playing")) return; tips.forEach(stopHere);
    var m = makeMedia(v, { controls: true }); it.appendChild(m); it.classList.add("is-playing");
    if (m.tagName === "IFRAME") { var on = false, b = el("button", "snd", icon("mute") + "<span>Activar sonido</span>"); b.type = "button"; b.addEventListener("click", function (e) { e.stopPropagation(); on = !on; setSound(m, on); b.innerHTML = icon(on ? "sound" : "mute") + "<span>" + (on ? "Silenciar" : "Activar sonido") + "</span>"; }); it.appendChild(b); }
    if (m.play) { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
  }
  var tipsSeen = false;
  function revealTips() {
    if (tipsSeen) return; tipsSeen = true;
    tips.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; }).forEach(function (idx, k) {
      var t = tips[idx], s = Math.random() < .5 ? -1 : 1;
      t.style.setProperty("--dx", s * (50 + Math.random() * 90) + "px"); t.style.setProperty("--dr", -s * (8 + Math.random() * 16) + "deg"); t.style.setProperty("--delay", k * 170 + "ms"); t.classList.add("in");
    });
  }

  var feed = $("#feed"), fs = $("#feedScroll"), built = false, fMuted = true, fActive = -1, fct;
  function buildFeed() {
    if (built) return; built = true;
    K.tutoriales.forEach(function (v, i) {
      var s = el("div", "feed__item", '<img src="' + esc(v.poster) + '" alt="">'); s.setAttribute("data-i", i); var tap = el("div", "feed__tap"); s.appendChild(tap);
      tap.addEventListener("click", function () { var m = $("video", s); if (m) m.paused ? m.play() : m.pause(); }); fs.appendChild(s);
    });
    var end = el("div", "feed__end"); fs.appendChild(end);
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) activate(+e.target.getAttribute("data-i")); }); }, { root: fs, threshold: .65 });
    $$(".feed__item", fs).forEach(function (s) { io.observe(s); });
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && feed.classList.contains("open")) closeFeed(); }); }, { root: fs, threshold: .5 }).observe(end);
    fs.addEventListener("scroll", function () { $("#feedHint").classList.add("gone"); }, { passive: true });
  }
  function clearSlides() { $$(".feed__item video, .feed__item iframe", fs).forEach(function (m) { if (m.pause) m.pause(); m.remove(); }); fActive = -1; }
  function activate(i) {
    if (i === fActive) return; clearSlides(); fActive = i;
    var s = $('.feed__item[data-i="' + i + '"]', fs); if (!s) return;
    var m = makeMedia(K.tutoriales[i], { muted: fMuted, loop: true }); s.insertBefore(m, $(".feed__tap", s));
    if (m.play) { var p = m.play(); if (p && p.catch) p.catch(function () {}); } if (m.tagName === "IFRAME" && !fMuted) setSound(m, true);
  }
  function fSoundUI() { $("#feedSound use").setAttribute("href", fMuted ? "#i-mute" : "#i-sound"); $("#feedSoundText").textContent = fMuted ? "Activar sonido" : "Silenciar"; }
  function openFeed(i) {
    buildFeed(); clearTimeout(fct); fMuted = true; fSoundUI(); feed.hidden = false; document.documentElement.classList.add("no-scroll"); $("#feedHint").classList.remove("gone");
    fs.scrollTo({ top: i * fs.clientHeight }); requestAnimationFrame(function () { feed.classList.add("open"); }); activate(i);
  }
  function closeFeed() { feed.classList.remove("open"); document.documentElement.classList.remove("no-scroll"); fct = setTimeout(function () { feed.hidden = true; clearSlides(); }, 360); }
  $("#feedClose").addEventListener("click", closeFeed);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !feed.hidden) closeFeed(); });
  $("#feedSound").addEventListener("click", function () { fMuted = !fMuted; fSoundUI(); setSound($(".feed__item video, .feed__item iframe", fs), !fMuted); });

  /* ═════════ ARMA TU RUTINA (sin IA: reglas simples) ═════════ */
  var rt = $("#rutina"), sel = [], current = null;
  function step(n) { rt.setAttribute("data-step", n); var r = rt.getBoundingClientRect(); if (r.top < 0 || r.top > 120) rt.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
  K.problemas.forEach(function (p) {
    var b = el("button", "opt", esc(p)); b.type = "button"; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () { var i = sel.indexOf(p), on = i < 0; if (on) sel.push(p); else sel.splice(i, 1); b.setAttribute("aria-pressed", on); });
    $("#opts").appendChild(b);
  });
  function choose() {
    if (K.modoDemo || rutinas.length === 1) return rutinas[0];     // 👉 demo: siempre la primera
    var best = rutinas[0], top = -1;
    rutinas.forEach(function (r) { var terms = norm(r.problemas).split(/\s+/), sc = 0; sel.forEach(function (s) { if (terms.indexOf(norm(s)) > -1) sc++; }); if (sc > top) { top = sc; best = r; } });
    return best;
  }
  function showRoutine() {
    current = choose(); var tl = $("#timeline"); tl.innerHTML = '<div class="tl__top">KZ</div>';
    current.pasos.slice(0, 3).forEach(function (p, i) {
      tl.appendChild(el("div", "tl__row", '<div class="tl__img"><img src="' + esc(imgSrc(p.imagen)) + '" alt="' + esc(p.nombre) + '"></div><div class="tl__n">' + (i + 1) + '</div><div class="tl__txt"><b>' + esc(p.marca) + "</b><span>" + esc(p.nombre) + '</span><div class="tl__pill">' + esc(p.beneficio) + "</div></div>"));
      tl.lastChild.style.setProperty("--i", i);
    });
    var list = current.pasos.slice(0, 3).map(function (p, i) { return (i + 1) + ". " + (p.marca ? p.marca + " " : "") + p.nombre; }).join("\n");
    $("#rOrder").href = wa(K.mensajes.rutina + "\n" + list + (sel.length ? "\nMi piel: " + sel.join(", ") : ""));
    step(2);
  }
  $("#rStart").addEventListener("click", function () { step(1); });
  $("#rBack1").addEventListener("click", function () { step(0); });
  $("#rBack2").addEventListener("click", function () { step(1); });
  $("#rGo").addEventListener("click", function () { if (!sel.length) { toast("Elige al menos una opción para armar tu rutina."); return; } showRoutine(); });

  /* ═════════ REDES ═════════ */
  K.redes.forEach(function (r) {
    var li = el("li", "", '<a href="' + esc(r.url) + '" target="_blank" rel="noopener"><span class="social__ic">' + (r.img ? '<img src="' + esc(r.img) + '" alt="">' : icon(r.icono || "link")) + "</span><span>" + esc(r.nombre) + "</span></a>");
    $("#social").appendChild(li);
  });

  /* ═════════ ANIMACIONES AL CARGAR / SCROLL ═════════ */
  var cardEls = $$(".card"), nav = $("#nav");
  if ("IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(function (n) { io2.observe(n); });
    var cio = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { cardEls.forEach(function (c) { c.classList.add("in"); }); cio.disconnect(); } }, { threshold: .15 });
    cio.observe(cardsBox);
    var tio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { revealTips(); tio.disconnect(); } }, { threshold: .25 }); tio.observe(row);
  } else { $$(".reveal, .card").forEach(function (n) { n.classList.add("in"); }); revealTips(); }
  var tick = false;
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; nav.classList.toggle("is-solid", window.scrollY > 40); }); } }, { passive: true });
})();
