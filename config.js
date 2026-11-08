/* =====================================================================
   CONFIG.JS · AQUÍ CAMBIAS TODO EL CONTENIDO SIN TOCAR EL RESTO DEL CÓDIGO
   Reglas: texto entre comillas "así" · no borres las comas del final de línea
   · para cambiar una imagen pon la ruta nueva (ej: "assets/img/mi-foto.png").
   ===================================================================== */
window.KOZ = {

  /* ── 1. DATOS GENERALES ── */
  nombre: "KOZ Cosmetics",
  // 👉 WhatsApp: código de país + número, SIN "+" ni espacios (Colombia 573001234567)
  whatsapp: "584267932485",
  // 👉 Google Maps: busca tu tienda → Compartir → Copiar vínculo
  mapaUrl: "https://maps.app.goo.gl/vrHwxk9aGSXnarsF7",
  // 👉 Redes (lista de barras oscuras al final). "img" = logo opcional; si lo dejas "" se usa el ícono.
  //    iconos disponibles: "instagram", "tiktok", "link"
  redes: [
    { nombre: "Tik Tok",   url: "https://www.linkedin.com/in/daniela-mijares-037746214/",    icono: "tiktok",    img: "" },
    { nombre: "Instagram", url: "https://www.instagram.com/disenadorgrafico.pr/", icono: "instagram", img: "" }
  ],

  /* ── 2. MENSAJES PREDETERMINADOS DE WHATSAPP ── */
  mensajes: {
    cita: "Hola KOZ Cosmetics 👋 Quisiera recibir atención.",
    catalogo: "Hola KOZ Cosmetics 👋 Me gustaría ver el catálogo de productos.",
    asesor: "Hola KOZ Cosmetics 👋 Quisiera asesoría para elegir el producto ideal.",
    conProductos: "Hola KOZ Cosmetics 👋 Me interesa consultar por estos productos:",
    producto: "Hola KOZ Cosmetics 👋 Quisiera información sobre {producto}.",   // {producto} se reemplaza solo
    rutina: "Hola KOZ Cosmetics 👋 Quisiera pedir esta rutina facial completa:"
  },

  /* ── 3. HEADER ── */
  hero: {
    // 👉 VIDEO corto de la marca (horizontal está bien: en móvil se recorta al centro). "" = solo se ve la imagen.
    //    Ideal: mp4 de 5–10 s, sin sonido, menos de 4 MB.
    video: "assets/video/videoheader.mp4",
    poster: "assets/video/productoposter.png",   // 👉 imagen que se ve mientras carga (o si no hay video)
    botonGiroscopio: true                    // true = botón "Giroscopio" (mueve el celular para girar el producto)
  },

  /* ── 4. PRODUCTOS (tarjetas del catálogo) ──────────────────────────
     • Los 2 PRIMEROS que tengan "sprite" salen en la vista 3D del header.
     • sprite = UNA imagen horizontal con las 6 vistas una al lado de otra (ver LEEME.md).
     • imagen = PNG con fondo transparente de la tarjeta.
     • palabrasClave = lo que la persona podría escribir en el buscador (problemas, usos, etc.)
     • descuento = texto de la etiqueta (déjalo "" si no hay). */
  productos: [
    { 
        marca: "La Roche Posay", 
        sprite: "assets/img/3dvista.png", frames: 6, nombre: "Effaclar Gel", desc: "Para pieles sensibles", imagen: "assets/img/larocheposey.jpg", disponible: true, palabrasClave: "acne, grasa, poros, sensible, limpiador", descuento: "20% OFF",
        bgColor: "#FEF6D8",    // 🎨 FONDO del header cuando se ve este producto en 3D (= color de fondo de tu imagen 3dvista.png)
        colorTexto: "#3d3430", // 🎨 color del nombre y la descripción (oscuro porque el fondo es claro)
        desc3d: "El secreto definitivo para limpiar tu rostro con suavidad sin comprometer su equilibrio. Formulado especialmente para pieles grasas y sensibles, purifica profundamente, elimina impurezas y reduce el exceso de sebo, dejando tu piel fresca, limpia y sin irritaciones."
    },
    { 
        marca: "Sol de Janeiro", 
        sprite: "assets/img/3dvista2.png", frames: 6, nombre: "Brazilian Mist", desc: "Protector solar corporal", imagen: "assets/img/riodejaneiro.jpg", disponible: true, palabrasClave: "sol, protector, solar, cuerpo, spf", descuento: "20% OFF",
        bgColor: "#FEF5CB",    // 🎨 FONDO del header cuando se ve este producto en 3D (= color de fondo de tu imagen 3dvista2.png)
        colorTexto: "#3d3430", // 🎨 color del nombre y la descripción
        desc3d: "Spray corporal perfumado diseñado para envolver tu piel en una experiencia sensorial única. Refresca, hidrata y deja una fragancia duradera y vibrante que te acompaña durante todo el día con un toque tropical."
    },

    { marca: "Rhode", nombre: "Crema piel sensible", desc: "Crema para pieles sensibles", imagen: "assets/img/rhodecrema.jpg", descuento: "",
      disponible: true, palabrasClave: "crema, sensible, rosacea, enrojecimiento, irritacion" },
    { marca: "Rhode", nombre: "Hidratación corporal", desc: "Hidratación corporal", imagen: "assets/img/rhodebarra.jpg", descuento: "",
      disponible: true, palabrasClave: "hidratacion, resequedad, cuerpo, piel seca" },
    { marca: "Tocobo", nombre: "Tratamiento facial", desc: "Tratamiento facial", imagen: "assets/img/tocobo.jpg", descuento: "",
      disponible: true, palabrasClave: "manchas, hiperpigmentacion, facial, cicatrices" },
    { marca: "Ampoule", nombre: "Rejuvenecimiento", desc: "Rejuvenecimiento", imagen: "assets/img/madagascar.jpg", descuento: "",
      disponible: true, palabrasClave: "arrugas, edad, antiedad, rejuvenecer, serum" },
    { marca: "Rhode", nombre: "Tratamiento para labios", desc: "Tratamiento para labios", imagen: "assets/img/rhodelabial.jpg", descuento: "",
      disponible: true, palabrasClave: "labios, resequedad labial, balsamo" },
    { marca: "Glossier", nombre: "Fortalecimiento capilar", desc: "Fortalecimiento capilar", imagen: "assets/img/gisou.jpg", descuento: "",
      disponible: false, palabrasClave: "cabello, pelo, capilar, caida" }
  ],

  /* ── 5. BUSCADOR + PREGUNTAS FRECUENTES (NO es IA) ──
     Pega aquí los links CSV publicados de tu Google Sheets (paso a paso en LEEME.md).
     Si los dejas "" se usa la lista local de arriba. */
  sheetProductos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdNvtw-Wne6MUP46zoy78-y0uwgKZVVZCIvCQY7zn6fKekpom4TUjHjoBvRcB9VieJfouVht8JQ1kx/pub?gid=0&single=true&output=csv",   // pestaña "productos"
  sheetPreguntas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdNvtw-Wne6MUP46zoy78-y0uwgKZVVZCIvCQY7zn6fKekpom4TUjHjoBvRcB9VieJfouVht8JQ1kx/pub?gid=1356397816&single=true&output=csv",   // pestaña "preguntas"
  sheetRutinas:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdNvtw-Wne6MUP46zoy78-y0uwgKZVVZCIvCQY7zn6fKekpom4TUjHjoBvRcB9VieJfouVht8JQ1kx/pub?gid=1315768830&single=true&output=csv",   // pestaña "rutinas"

  sugerencias: ["Acné", "Manchas", "Rosácea", "¿Hacen envíos?"],
  sinResultado: "Disculpa, no encontré eso. Cuéntanos más por WhatsApp o mira el catálogo completo con el botón de arriba: Ver el catálogo completo.",
  preguntasLocal: [
    { pregunta: "¿Hacen envíos?", palabrasClave: "envio, envios, domicilio, despacho, entrega",
      respuesta: "Sí, hacemos envíos. Escríbenos por WhatsApp con tu ciudad y te confirmamos costo y tiempo." },
    { pregunta: "Formas de pago", palabrasClave: "pago, pagar, tarjeta, transferencia, efectivo",
      respuesta: "Aceptamos transferencia, tarjeta y efectivo en tienda. Te confirmamos todo por WhatsApp." },
    { pregunta: "¿Cuál es el horario?", palabrasClave: "horario, hora, abierto, abren, cierran",
      respuesta: "Atendemos de lunes a sábado. Para el horario exacto escríbenos por WhatsApp." }
  ],

  /* ── 6. TUTORIALES Y TIPS (3 videos) ──
     tipo "mp4" (recomendado, vertical 9:16, ≤15 s) o "iframe" (YouTube Shorts: https://www.youtube.com/embed/ID) */
  tutoriales: [
 { titulo: "Tip 1", tipo: "iframe", src: "https://www.youtube.com/embed/W6H2expQ_Ak", poster: "assets/img/postercolorido.jpg" },
   { titulo: "Tip 2", tipo: "iframe", src: "https://www.youtube.com/embed/iGey-UdGidk", poster: "assets/img/chicaposter.jpg" },
   { titulo: "Tip 3", tipo: "iframe", src: "https://www.youtube.com/embed/1Sj4VTcF9ZI", poster: "assets/img/postermiel.jpg" }
  ],

  /* ── 7. ARMA TU RUTINA ──
     modoDemo: true  → siempre muestra la primera rutina (para la demo).
     modoDemo: false → elige la rutina que más coincida con los problemas marcados. */
  modoDemo: true,

  /* 👉 PRODUCTOS DE LA RUTINA (marca + foto PNG). El nombre debe ser IGUAL al que escribes en la hoja, pestaña "rutinas"
     (columnas producto_1, producto_2, producto_3). Si agregas un producto nuevo a una rutina, agrégalo también aquí. */
  productosRutina: [
    { marca: "La Roche Posay", nombre: "Effaclar Gel",  imagen: "assets/img/Effaclar Gel.png" },
    { marca: "OWYA",           nombre: "Glow Toning",   imagen: "assets/img/Glow Toning.png" },
    { marca: "OWYA",           nombre: "Elixir Facial", imagen: "assets/img/Elixir Facial.png" }
  ],
  problemas: ["Resequedad", "Rosácea", "Inflamación", "Acné", "Grasa", "Manchas", "Cicatrices", "Hiperpigmentación"],
  rutinas: [
    { problemas: "acne, grasa, manchas",
      pasos: [
        { marca: "La Roche Posay", nombre: "Effaclar Gel", beneficio: "Limpieza facial diaria", imagen: "assets/img/Effaclar Gel.png" },
        { marca: "OWYA", nombre: "Glow Toning",    beneficio: "Elimina el acné",        imagen: "assets/img/Glow Toning.png" },
        { marca: "OWYA", nombre: "Elixir Facial",  beneficio: "Borra las manchas",      imagen: "assets/img/Elixir Facial.png" }
      ] },
    { problemas: "resequedad, rosacea, inflamacion",
      pasos: [
        { marca: "Rhode", nombre: "Crema piel sensible", beneficio: "Calma el enrojecimiento", imagen: "assets/img/Effaclar Gel.png" },
        { marca: "Rhode", nombre: "Hidratación",         beneficio: "Hidrata en profundidad",  imagen: "assets/img/Glow Toning.png" },
        { marca: "Tocobo", nombre: "Tratamiento facial", beneficio: "Repara la barrera",       imagen: "assets/img/Elixir Facial.png" }
      ] }
  ]
};
