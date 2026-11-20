/**
 * i18n.js — Sistema di internazionalizzazione (EN / IT / ES)
 * Gestisce il caricamento del file JSON per ogni pagina,
 * la persistenza della preferenza in localStorage e
 * i pulsanti di switch lingua nell'header.
 */

(function () {
  const STORAGE_KEY = "lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "it", "es"];

  // Traduzioni comuni (navbar, footer, bottoni generici)
  const COMMON_TRANSLATIONS = {
    en: {
      nav_home: "Home",
      nav_projects: "Projects",
      nav_social: "Social",
      nav_aboutme: "About Me",
      nav_switch: "Switch",
      footer_contact: "Contact",
      footer_about: "About Me",
      footer_visits: "Total visits:",
      footer_design: "Design by",
      footer_modified: "Last modified:",
      footer_age: "I'm a programmer and I'm {age} years old.",
      footer_copyright: "Copyright © {year} vidux.sh. All Rights Reserved.",
      footer_loading: "Loading...",
      footer_unavailable: "N/A",
      footer_copy: "Copy",
      footer_copied: "Copied!",
      nav_logo: "Logo",
      footer_profile_logo: "Profile Logo",
      back_blog: "Back to Blog",
      back_coding: "Back to Coding",
      back_top: "Back to Top"
    },
    it: {
      nav_home: "Inizio",
      nav_projects: "Progetti",
      nav_social: "Social",
      nav_aboutme: "Chi sono",
      nav_switch: "Tema",
      footer_contact: "Contatti",
      footer_about: "Chi sono",
      footer_visits: "Visite totali:",
      footer_design: "Design di",
      footer_modified: "Ultima modifica:",
      footer_age: "Sono un programmatore e ho {age} anni.",
      footer_copyright: "Copyright © {year} vidux.sh. Tutti i diritti riservati.",
      footer_loading: "Caricamento...",
      footer_unavailable: "N/D",
      footer_copy: "Copia",
      footer_copied: "Copiato!",
      nav_logo: "Logo",
      footer_profile_logo: "Logo del profilo",
      back_blog: "Torna al Blog",
      back_coding: "Torna alle Guide",
      back_top: "Torna su"
    },
    es: {
      nav_home: "Inicio",
      nav_projects: "Proyectos",
      nav_social: "Social",
      nav_aboutme: "Sobre mí",
      nav_switch: "Tema",
      footer_contact: "Contacto",
      footer_about: "Sobre mí",
      footer_visits: "Visitas totales:",
      footer_design: "Diseño de",
      footer_modified: "Última modificación:",
      footer_age: "Soy programador y tengo {age} años.",
      footer_copyright: "Copyright © {year} vidux.sh. Todos los derechos reservados.",
      footer_loading: "Cargando...",
      footer_unavailable: "N/D",
      footer_copy: "Copiar",
      footer_copied: "¡Copiado!",
      nav_logo: "Logo",
      footer_profile_logo: "Logo de perfil",
      back_blog: "Volver al Blog",
      back_coding: "Volver a las Guías",
      back_top: "Volver arriba"
    }
  };

  let pageTranslations = {};

  const TECHNOLOGY_TABLE_LABELS = {
    it: {
      "Specifications": "Specifiche", "General": "Generale", "Device": "Dispositivo",
      "Dimensions": "Dimensioni", "Dimensions & Weight": "Dimensioni e peso",
      "Weight": "Peso", "Category": "Categoria", "Type": "Tipo",
      "Operating System": "Sistema operativo", "OS": "SO", "Processor / Chipset": "Processore / chipset",
      "CPU": "CPU", "GPU": "GPU", "Chipset": "Chipset", "RAM": "RAM",
      "Storage": "Memoria", "Storage Type": "Tipo di memoria", "Main Storage": "Memoria principale",
      "Secondary Storage": "Memoria secondaria", "ROM": "Memoria ROM", "Display": "Schermo",
      "Camera": "Fotocamera", "Front Camera": "Fotocamera frontale", "Rear Camera": "Fotocamera posteriore",
      "Battery": "Batteria", "Capacity": "Capacità", "Network": "Rete",
      "Connectivity": "Connettività", "Communications": "Comunicazioni", "Bluetooth": "Bluetooth",
      "Wi-Fi": "Wi-Fi", "GPS": "GPS", "NFC": "NFC", "Sensors": "Sensori",
      "Accelerometer": "Accelerometro", "Gyroscope": "Giroscopio", "Proximity": "Prossimità",
      "Compass": "Bussola", "Fingerprint": "Impronta digitale", "Fingerprint Sensor": "Sensore impronte",
      "Memory": "Memoria", "Memory Card Reader": "Lettore schede memoria", "Expandable Memory": "Memoria espandibile",
      "Availability": "Disponibilità", "Manufacturer Warranty": "Garanzia produttore",
      "Service & Support": "Assistenza e supporto", "Included Accessories": "Accessori inclusi",
      "Battery Consumption": "Consumo batteria", "Battery Level": "Livello batteria",
      "Battery Temperature": "Temperatura batteria", "Battery Voltage": "Voltaggio batteria",
      "End Temperature": "Temperatura finale", "Starting Temperature": "Temperatura iniziale",
      "Temperature Variation": "Variazione temperatura", "Stress Test": "Test di stress",
      "Benchmark Results": "Risultati benchmark", "Avg. Score": "Punteggio medio",
      "Score": "Punteggio", "Points": "Punti", "Result": "Risultato",
      "Speed": "Velocità", "Accuracy": "Precisione", "FPS": "FPS",
      "Resolution": "Risoluzione", "Inch": "Pollici", "Pixel Density": "Densità pixel",
      "Aperture Size": "Apertura", "Image Aspect Ratio": "Rapporto immagine",
      "Image Brightness": "Luminosità immagine", "Features": "Funzionalità",
      "Video": "Video", "Video Rec.": "Registrazione video", "Video Stabilizer": "Stabilizzatore video",
      "Video FPS": "FPS video", "Video Fps": "FPS video", "Slow Motion": "Slow motion",
      "Autofocus": "Autofocus", "Touch Focus": "Messa a fuoco tocco", "Flash": "Flash",
      "Face Detection": "Rilevamento volti", "Smile Detection": "Rilevamento sorriso",
      "Geo Tagging": "Geotagging", "HDR": "HDR", "Optical zoom": "Zoom ottico",
      "Processor": "Processore", "Graphics Processor": "Processore grafico",
      "Number of Cores": "Numero di core", "CPU Cores Clock": "Frequenza dei core CPU",
      "Max Turbo Speed": "Velocità turbo massima", "Max RAM Supported": "RAM massima supportata",
      "Memory Bandwidth": "Larghezza di banda memoria", "Memory Latency": "Latenza memoria",
      "Read Speed": "Velocità di lettura", "Write Speed": "Velocità di scrittura",
      "Sequence Read": "Lettura sequenziale", "Sequence Write": "Scrittura sequenziale",
      "Sequential Read Speed": "Velocità lettura sequenziale", "Sequential Write Speed": "Velocità scrittura sequenziale",
      "Random Access": "Accesso casuale", "Random Read and Write Speed": "Velocità lettura/scrittura casuale",
      "Mixed Random Access": "Accesso casuale misto", "Rate Speed": "Velocità nominale",
      "Rated Speed": "Velocità nominale", "Storage Test": "Test memoria", "Storage Test v8.4.2": "Test memoria v8.4.2",
      "Storage Test v10.1.9": "Test memoria v10.1.9", "Storage Test v11.1.2": "Test memoria v11.1.2",
      "Technology": "Tecnologia", "Notebook": "Notebook", "Notebook Computers": "Notebook",
      "Product Type": "Tipo di prodotto", "Form Factor": "Formato", "Color": "Colore",
      "Colours": "Colori", "Megapixel": "Megapixel", "Other": "Altro",
      "Miscellaneous": "Varie", "Interfaces": "Interfacce", "Connections & Expansion": "Connessioni ed espansioni",
      "Input": "Ingresso", "Output": "Uscita", "USB": "USB", "Radio FM": "Radio FM",
      "Sound": "Audio", "Speakerphone": "Vivavoce", "Stereo speakers, microphone": "Altoparlanti stereo, microfono",
      "Headphone/microphone combo jack, Mini DisplayPort, HDMI, 3 x USB 3.0, LAN, USB-C 3.1 Gen 1, USB 2.0":
        "Jack cuffie/microfono, Mini DisplayPort, HDMI, 3 x USB 3.0, LAN, USB-C 3.1 Gen 1, USB 2.0",
      "AI Benchmark": "Benchmark IA", "CPU Performance": "Prestazioni CPU",
      "CPU Common Algorithms": "Algoritmi comuni CPU", "CPU Mathematical Operations": "Operazioni matematiche CPU",
      "CPU Multi-Core": "CPU multi-core", "Data Processing": "Elaborazione dati",
      "Data Security": "Sicurezza dati", "Document Processing": "Elaborazione documenti",
      "Image Processing": "Elaborazione immagini", "Image Decoding": "Decodifica immagini",
      "Object Detection": "Rilevamento oggetti", "Style Transfer": "Trasferimento stile",
      "Super Resolution": "Super-risoluzione", "User Experience": "Esperienza utente",
      "HTML5 Test": "Test HTML5", "Vibration": "Vibrazione", "Digital": "Digitale"
    },
    es: {
      "Specifications": "Especificaciones", "General": "General", "Device": "Dispositivo",
      "Dimensions": "Dimensiones", "Dimensions & Weight": "Dimensiones y peso",
      "Weight": "Peso", "Category": "Categoría", "Type": "Tipo",
      "Operating System": "Sistema operativo", "OS": "SO", "Processor / Chipset": "Procesador / chipset",
      "CPU": "CPU", "GPU": "GPU", "Chipset": "Chipset", "RAM": "RAM",
      "Storage": "Almacenamiento", "Storage Type": "Tipo de almacenamiento", "Main Storage": "Almacenamiento principal",
      "Secondary Storage": "Almacenamiento secundario", "ROM": "ROM", "Display": "Pantalla",
      "Camera": "Cámara", "Front Camera": "Cámara frontal", "Rear Camera": "Cámara trasera",
      "Battery": "Batería", "Capacity": "Capacidad", "Network": "Red",
      "Connectivity": "Conectividad", "Communications": "Comunicaciones", "Bluetooth": "Bluetooth",
      "Wi-Fi": "Wi-Fi", "GPS": "GPS", "NFC": "NFC", "Sensors": "Sensores",
      "Accelerometer": "Acelerómetro", "Gyroscope": "Giroscopio", "Proximity": "Proximidad",
      "Compass": "Brújula", "Fingerprint": "Huella digital", "Fingerprint Sensor": "Sensor de huellas",
      "Memory": "Memoria", "Memory Card Reader": "Lector de tarjetas", "Expandable Memory": "Memoria ampliable",
      "Availability": "Disponibilidad", "Manufacturer Warranty": "Garantía del fabricante",
      "Service & Support": "Servicio y soporte", "Included Accessories": "Accesorios incluidos",
      "Battery Consumption": "Consumo de batería", "Battery Level": "Nivel de batería",
      "Battery Temperature": "Temperatura de batería", "Battery Voltage": "Voltaje de batería",
      "End Temperature": "Temperatura final", "Starting Temperature": "Temperatura inicial",
      "Temperature Variation": "Variación de temperatura", "Stress Test": "Prueba de estrés",
      "Benchmark Results": "Resultados de benchmark", "Avg. Score": "Puntuación media",
      "Score": "Puntuación", "Points": "Puntos", "Result": "Resultado",
      "Speed": "Velocidad", "Accuracy": "Precisión", "FPS": "FPS",
      "Resolution": "Resolución", "Inch": "Pulgadas", "Pixel Density": "Densidad de píxeles",
      "Aperture Size": "Apertura", "Image Aspect Ratio": "Relación de aspecto",
      "Image Brightness": "Brillo de imagen", "Features": "Funciones",
      "Video": "Vídeo", "Video Rec.": "Grabación de vídeo", "Video Stabilizer": "Estabilizador de vídeo",
      "Video FPS": "FPS de vídeo", "Video Fps": "FPS de vídeo", "Slow Motion": "Cámara lenta",
      "Autofocus": "Autofoco", "Touch Focus": "Enfoque táctil", "Flash": "Flash",
      "Face Detection": "Detección facial", "Smile Detection": "Detección de sonrisa",
      "Geo Tagging": "Geolocalización", "HDR": "HDR", "Optical zoom": "Zoom óptico",
      "Processor": "Procesador", "Graphics Processor": "Procesador gráfico",
      "Number of Cores": "Número de núcleos", "CPU Cores Clock": "Frecuencia de núcleos CPU",
      "Max Turbo Speed": "Velocidad turbo máxima", "Max RAM Supported": "RAM máxima admitida",
      "Memory Bandwidth": "Ancho de banda de memoria", "Memory Latency": "Latencia de memoria",
      "Read Speed": "Velocidad de lectura", "Write Speed": "Velocidad de escritura",
      "Sequence Read": "Lectura secuencial", "Sequence Write": "Escritura secuencial",
      "Sequential Read Speed": "Velocidad de lectura secuencial", "Sequential Write Speed": "Velocidad de escritura secuencial",
      "Random Access": "Acceso aleatorio", "Random Read and Write Speed": "Velocidad aleatoria de lectura y escritura",
      "Mixed Random Access": "Acceso aleatorio mixto", "Rated Speed": "Velocidad nominal",
      "AI Benchmark": "Benchmark IA", "CPU Performance": "Rendimiento CPU",
      "CPU Common Algorithms": "Algoritmos comunes CPU", "CPU Mathematical Operations": "Operaciones matemáticas CPU",
      "CPU Multi-Core": "CPU multinúcleo", "Data Processing": "Procesamiento de datos",
      "Data Security": "Seguridad de datos", "Document Processing": "Procesamiento de documentos",
      "Image Processing": "Procesamiento de imágenes", "Image Decoding": "Decodificación de imágenes",
      "Object Detection": "Detección de objetos", "Style Transfer": "Transferencia de estilo",
      "Super Resolution": "Superresolución", "User Experience": "Experiencia de usuario",
      "HTML5 Test": "Prueba HTML5", "Vibration": "Vibración", "Digital": "Digital"
    }
  };

  const SPORT_TABLE_LABELS = {
    it: {
      "1RM Metrics": "Metriche 1RM", "Exercise": "Esercizio",
      "1RM - 31/12/2025": "1RM - 31/12/2025", "1RM - All time": "1RM - Migliore",
      "Total:": "Totale:", "IPF Points GL:": "Punti IPF GL:", "IPF Points Dots:": "Punti IPF Dots:",
      "Legs": "Gambe", "Chest": "Petto", "Back": "Schiena", "Shoulders": "Spalle",
      "Arms": "Braccia", "Abs": "Addome", "Military": "Militare",
      "Series/Repetitions": "Serie/Ripetizioni", "Recovery": "Recupero", "Execution": "Esecuzione", "Notes": "Note",
      "Buffer 1": "Margine 1", "Buffer 2": "Margine 2", "Slow movement": "Movimento lento",
      "Full ROM": "Escursione completa", "To failure": "Fino al cedimento",
      "1-second stop": "Pausa di 1 secondo", "Giantset": "Giant set",
      "Barbell Back Squat": "Squat con bilanciere", "Barbell Bench Press": "Panca piana con bilanciere",
      "Barbell Deadlift": "Stacco da terra con bilanciere", "Military Press": "Military press",
      "Pull Up": "Trazioni alla sbarra", "Dip": "Dip alle parallele",
      "Barbell Bicep Curl": "Curl con bilanciere",
      "Leg Extension": "Leg extension", "Harmstrings Curl": "Leg curl", "Seated Calf Raise": "Calf al sedile",
      "Barbell Squat": "Squat con bilanciere", "Barbell Front Squat": "Squat frontale con bilanciere",
      "Machine Hip Abductor": "Abduzione anca alla macchina", "Machine Hip Adductor": "Adduzione anca alla macchina",
      "Leg Press": "Leg press", "Machine Calf Raise": "Calf alla macchina",
      "Push Up": "Flessioni", "Dumbell Bench Press": "Panca piana con manubri",
      "Incline Dumbell Bench Press": "Panca inclinata con manubri", "Incline Dumbell Chest Fly": "Croci su panca inclinata",
      "High Cable Chest Fly": "Croci alte al cavo", "Lower Cable Chest Fly": "Croci basse al cavo",
      "Machine Chest Press": "Chest press alla macchina", "Pec Fly": "Croci alla macchina",
      "Barbell Row": "Rematore con bilanciere", "Deadlift": "Stacco da terra", "T-Bar": "Rematore T-bar",
      "Seated Cable Row": "Rematore basso al cavo", "Close Grip Lat Pulldown": "Pulldown presa stretta",
      "Lat Pulldown": "Pulldown", "Dumbbell Laying Incline Row": "Rematore inclinato con manubri",
      "Single Arm Cable Pulldown": "Pulldown monolat. al cavo", "Hyperextension": "Iperestensione",
      "Seated Shoulder Press": "Military press da seduto", "Dumbell Lateral Raise": "Alzate laterali con manubri",
      "Dumbell Front Raise": "Alzate frontali con manubri", "Single Arm Cable Lateral Raise": "Alzata laterale monolat. al cavo",
      "Single Arm Cable Front Raise": "Alzata frontale monolat. al cavo", "Dumbell Shoulder Shrug": "Scrollate con manubri",
      "Rear Delt Pec Fly": "Croci per deltoidi posteriori", "Machine Shoulder Press": "Military press alla macchina",
      "Hammer Curl": "Curl a martello", "Machine Bicep Curl": "Curl bicipiti alla macchina",
      "Barbell Curl": "Curl con bilanciere", "Preacher Curl": "Curl su panca Scott",
      "Concentration Curl": "Curl concentrato", "Cable Curl": "Curl al cavo",
      "Triceps Pressdown": "Pushdown tricipiti", "Overhead Dumbbell Triceps Extension": "Estensione tricipiti sopra la testa",
      "Skull Crusher": "Skull crusher", "Cable Triceps Extension": "Estensioni tricipiti al cavo",
      "Plank": "Plank", "Weighted Crunch": "Crunch con sovraccarico", "Hanging Leg Raise": "Sollevamento gambe appeso",
      "Russian Twist": "Russian twist", "Bicycle Crunch": "Crunch bicicletta",
      "Hanging Knee Raise": "Sollevamento ginocchia appeso", "High Intensity Run": "Corsa ad alta intensità",
      "Height": "Altezza", "Weight": "Peso", "BMI": "BMI", "Fat": "Grasso",
      "Water": "Acqua", "Muscle": "Muscolo", "Chest": "Torace", "Shoulders": "Spalle",
      "Left biceps": "Bicipite sinistro", "Right biceps": "Bicipite destro",
      "Left Forearm": "Avambraccio sinistro", "Right Forearm": "Avambraccio destro",
      "Left Thigh": "Coscia sinistra", "Right Thigh": "Coscia destra",
      "Left Calf": "Polpaccio sinistro", "Right Calf": "Polpaccio destro",
      "Waist": "Vita", "Hip": "Fianchi", "Buttocks": "Glutei"
    },
    es: {
      "1RM Metrics": "Métricas 1RM", "Exercise": "Ejercicio",
      "1RM - 31/12/2025": "1RM - 31/12/2025", "1RM - All time": "1RM - Histórico",
      "Total:": "Total:", "IPF Points GL:": "Puntos IPF GL:", "IPF Points Dots:": "Puntos IPF Dots:",
      "Legs": "Piernas", "Chest": "Pecho", "Back": "Espalda", "Shoulders": "Hombros",
      "Arms": "Brazos", "Abs": "Abdominales", "Military": "Militar",
      "Series/Repetitions": "Series/Repeticiones", "Recovery": "Descanso", "Execution": "Ejecución", "Notes": "Notas",
      "Buffer 1": "Margen 1", "Buffer 2": "Margen 2", "Slow movement": "Movimiento lento",
      "Full ROM": "Rango completo", "To failure": "Hasta el fallo",
      "1-second stop": "Pausa de 1 segundo", "Giantset": "Serie gigante",
      "Barbell Back Squat": "Sentadilla con barra", "Barbell Bench Press": "Press de banca con barra",
      "Barbell Deadlift": "Peso muerto con barra", "Military Press": "Press militar",
      "Pull Up": "Dominadas", "Dip": "Fondos", "Barbell Bicep Curl": "Curl bíceps con barra",
      "Leg Extension": "Extensión de piernas", "Harmstrings Curl": "Curl femoral", "Seated Calf Raise": "Gemelo sentado",
      "Barbell Squat": "Sentadilla con barra", "Barbell Front Squat": "Sentadilla frontal",
      "Machine Hip Abductor": "Abductor de cadera", "Machine Hip Adductor": "Aductor de cadera",
      "Leg Press": "Prensa de piernas", "Machine Calf Raise": "Gemelo en máquina",
      "Push Up": "Flexiones", "Dumbell Bench Press": "Press de banca con mancuernas",
      "Incline Dumbell Bench Press": "Press inclinado con mancuernas", "Incline Dumbell Chest Fly": "Aperturas inclinadas",
      "High Cable Chest Fly": "Aperturas altas con polea", "Lower Cable Chest Fly": "Aperturas bajas con polea",
      "Machine Chest Press": "Press de pecho en máquina", "Pec Fly": "Aperturas en máquina",
      "Barbell Row": "Remo con barra", "Deadlift": "Peso muerto", "T-Bar": "Remo T-bar",
      "Seated Cable Row": "Remo sentado con polea", "Close Grip Lat Pulldown": "Jalón agarre cerrado",
      "Lat Pulldown": "Jalón al pecho", "Dumbbell Laying Incline Row": "Remo inclinado con mancuernas",
      "Single Arm Cable Pulldown": "Jalón unilateral con polea", "Hyperextension": "Hiperextensión",
      "Seated Shoulder Press": "Press militar sentado", "Dumbell Lateral Raise": "Elevaciones laterales",
      "Dumbell Front Raise": "Elevaciones frontales", "Single Arm Cable Lateral Raise": "Elevación lateral unilateral",
      "Single Arm Cable Front Raise": "Elevación frontal unilateral", "Dumbell Shoulder Shrug": "Encogimientos con mancuernas",
      "Rear Delt Pec Fly": "Aperturas para deltoides posteriores", "Machine Shoulder Press": "Press de hombros en máquina",
      "Hammer Curl": "Curl martillo", "Machine Bicep Curl": "Curl de bíceps en máquina",
      "Barbell Curl": "Curl con barra", "Preacher Curl": "Curl predicador",
      "Concentration Curl": "Curl concentrado", "Cable Curl": "Curl con polea",
      "Triceps Pressdown": "Extensión de tríceps en polea", "Overhead Dumbbell Triceps Extension": "Extensión de tríceps con mancuerna",
      "Skull Crusher": "Press francés", "Cable Triceps Extension": "Extensión de tríceps con polea",
      "Plank": "Plancha", "Weighted Crunch": "Abdominal con peso", "Hanging Leg Raise": "Elevación de piernas colgado",
      "Russian Twist": "Giro ruso", "Bicycle Crunch": "Abdominal bicicleta",
      "Hanging Knee Raise": "Elevación de rodillas colgado", "High Intensity Run": "Carrera de alta intensidad",
      "Height": "Altura", "Weight": "Peso", "BMI": "IMC", "Fat": "Grasa",
      "Water": "Agua", "Muscle": "Músculo", "Chest": "Pecho", "Shoulders": "Hombros",
      "Left biceps": "Bíceps izquierdo", "Right biceps": "Bíceps derecho",
      "Left Forearm": "Antebrazo izquierdo", "Right Forearm": "Antebrazo derecho",
      "Left Thigh": "Muslo izquierdo", "Right Thigh": "Muslo derecho",
      "Left Calf": "Gemelo izquierdo", "Right Calf": "Gemelo derecho",
      "Waist": "Cintura", "Hip": "Caderas", "Buttocks": "Glúteos"
    }
  };

  const CODE_COMMENT_TRANSLATIONS = {
    it: {
      "This is a single-line comment": "Questo è un commento su una sola riga",
      "inline comment": "commento in linea",
      "This is a multi-line comment": "Questo è un commento su più righe",
      "(also called a docstring).": "(chiamato anche docstring).",
      "Slicing": "Affettamento delle stringhe",
      "reversed": "invertito",
      "f-string formatting": "formattazione con f-string",
      "Arithmetic": "Operazioni aritmetiche",
      "addition": "addizione",
      "subtraction": "sottrazione",
      "multiplication": "moltiplicazione",
      "division": "divisione",
      "integer division": "divisione intera",
      "modulo (remainder)": "modulo (resto)",
      "exponentiation": "esponenziazione",
      "Comparison": "Confronti",
      "returns bool": "restituisce un valore booleano",
      "Logical": "Operatori logici",
      "Ternary (one-line) conditional": "Condizione ternaria su una riga",
      "this runs": "questa istruzione viene eseguita",
      "for loop with range()": "ciclo for con range()",
      "for loop over a list": "ciclo for su una lista",
      "while loop": "ciclo while",
      "break and continue": "break e continue",
      "Copy": "Copia",
      "Runs exactly once when the microcontoller powers on or resets": "Viene eseguito una sola volta quando il microcontrollore si accende o viene ripristinato",
      "Runs continuously in an infinite sequential loop right after setup() finishes": "Viene eseguito continuamente in un ciclo infinito subito dopo setup()",
      "Button switch pin input": "Ingresso del pin del pulsante",
      "PWM capable pin descriptor (marked with ~)": "Descrizione del pin PWM (contrassegnato con ~)",
      "Save timestamp threshold": "Salva la soglia temporale",
      "This is a CSS comment": "Questo è un commento CSS",
      "Color Formats": "Formati dei colori",
      "Typography Rules": "Regole tipografiche",
      "Medium weight": "Peso medio",
      "Outer buffer space (centered horizontally)": "Spazio esterno (centrato orizzontalmente)",
      "Takes full line width": "Occupa tutta la larghezza della riga",
      "Establishes boundary anchor": "Stabilisce l'ancoraggio del bordo",
      "Arrange children side-by-side horizontally": "Disponi gli elementi figli affiancati orizzontalmente",
      "Fixed spacer gutter between inner rows": "Spaziatore fisso tra le righe interne",
      "Visible page content goes here": "Il contenuto visibile della pagina va qui",
      "Internal reference hyperlink": "Collegamento interno",
      "External target in a fresh sandbox tab": "Collegamento esterno in una nuova scheda protetta",
      "Section jump link using unique ID selectors": "Collegamento a una sezione tramite selettore ID univoco",
      "Unordered Bullet List Layout": "Elenco puntato non ordinato",
      "Ordered Numbered List Layout": "Elenco numerato",
      "Password Variant Masking Mask": "Campo password con testo nascosto",
      "Action Confirmation Button Submit": "Pulsante di invio della conferma",
      "Single-line comment": "Commento su una sola riga",
      "Multi-line comment block": "Blocco di commento su più righe",
      "Implicitly typed as string": "Tipizzazione implicita come stringa",
      "String interpolation using the $ prefix": "Interpolazione delle stringhe con il prefisso $",
      "Short assignment syntax (declares + infers automatically)": "Sintassi abbreviata di assegnazione (dichiara e deduce automaticamente)"
    },
    es: {
      "This is a single-line comment": "Esto es un comentario de una sola línea",
      "inline comment": "comentario en línea",
      "This is a multi-line comment": "Esto es un comentario de varias líneas",
      "(also called a docstring).": "(también llamado docstring).",
      "Slicing": "Segmentación de cadenas",
      "reversed": "invertido",
      "f-string formatting": "formato de cadena f",
      "Arithmetic": "Operaciones aritméticas",
      "addition": "suma",
      "subtraction": "resta",
      "multiplication": "multiplicación",
      "division": "división",
      "integer division": "división entera",
      "modulo (remainder)": "módulo (resto)",
      "exponentiation": "exponenciación",
      "Comparison": "Comparaciones",
      "returns bool": "devuelve un valor booleano",
      "Logical": "Operadores lógicos",
      "Ternary (one-line) conditional": "Condicional ternario en una línea",
      "this runs": "esto se ejecuta",
      "for loop with range()": "bucle for con range()",
      "for loop over a list": "bucle for sobre una lista",
      "while loop": "bucle while",
      "break and continue": "break y continue",
      "Copy": "Copiar",
      "Runs exactly once when the microcontoller powers on or resets": "Se ejecuta una sola vez cuando el microcontrolador se enciende o se reinicia",
      "Runs continuously in an infinite sequential loop right after setup() finishes": "Se ejecuta continuamente en un bucle infinito justo después de setup()",
      "Button switch pin input": "Entrada del pin del pulsador",
      "PWM capable pin descriptor (marked with ~)": "Descriptor del pin PWM (marcado con ~)",
      "Save timestamp threshold": "Guardar el umbral de tiempo",
      "This is a CSS comment": "Esto es un comentario CSS",
      "Color Formats": "Formatos de color",
      "Typography Rules": "Reglas tipográficas",
      "Medium weight": "Peso medio",
      "Outer buffer space (centered horizontally)": "Espacio exterior (centrado horizontalmente)",
      "Takes full line width": "Ocupa todo el ancho de la línea",
      "Establishes boundary anchor": "Establece el anclaje del borde",
      "Arrange children side-by-side horizontally": "Coloca los elementos hijos uno al lado del otro",
      "Fixed spacer gutter between inner rows": "Separador fijo entre las filas internas",
      "Visible page content goes here": "El contenido visible de la página va aquí",
      "Internal reference hyperlink": "Hipervínculo de referencia interna",
      "External target in a fresh sandbox tab": "Destino externo en una nueva pestaña aislada",
      "Section jump link using unique ID selectors": "Enlace a una sección mediante un selector ID único",
      "Unordered Bullet List Layout": "Diseño de lista con viñetas",
      "Ordered Numbered List Layout": "Diseño de lista numerada",
      "Password Variant Masking Mask": "Campo de contraseña con texto oculto",
      "Action Confirmation Button Submit": "Botón de envío de confirmación",
      "Single-line comment": "Comentario de una sola línea",
      "Multi-line comment block": "Bloque de comentario de varias líneas",
      "Implicitly typed as string": "Tipado implícitamente como cadena",
      "String interpolation using the $ prefix": "Interpolación de cadenas con el prefijo $",
      "Short assignment syntax (declares + infers automatically)": "Sintaxis abreviada de asignación (declara e infiere automáticamente)"
    }
  };

  function getCurrentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }

  function getPageId() {
    if (document.body && document.body.dataset && document.body.dataset.page) {
      return document.body.dataset.page;
    }
    let p = window.location.pathname.replace(/\\/g, "/");
    p = p.replace(/^\/website\//, "/");
    p = p.replace(/^\//, "").replace(/\.html$/, "");
    if (!p) return "index";
    return p.replace(/\//g, "_");
  }

  function getJsonUrl(pageId) {
    const scriptEl = document.currentScript || document.querySelector('script[src*="i18n.js"]');
    if (scriptEl && scriptEl.src) {
      return new URL("../i18n/" + pageId + ".json", scriptEl.src).href;
    }
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    const prefix = depth > 0 ? "../".repeat(depth) : "";
    return `${prefix}assets/i18n/${pageId}.json`;
  }

  function applyTranslations(lang) {
    const commonDict = COMMON_TRANSLATIONS[lang] || COMMON_TRANSLATIONS[DEFAULT_LANG] || {};
    const pageDict = (pageTranslations && pageTranslations[lang]) || {};
    const dict = Object.assign({}, commonDict, pageDict);

    document.querySelectorAll('[id^="display-dots-"]').forEach((el) => {
      if (!dict.sport_dots) return;
      el.textContent = el.textContent.replace(/Dots$/, dict.sport_dots);
    });

    if (window.bodyMeasurementsChart) {
      const chartLabels = [
        "chart_height", "chart_weight", "chart_bmi", "chart_fat", "chart_water",
        "chart_muscle", "chart_chest", "chart_shoulders", "chart_left_biceps",
        "chart_right_biceps", "chart_left_forearm", "chart_right_forearm",
        "chart_left_thigh", "chart_right_thigh", "chart_left_calf",
        "chart_right_calf", "chart_waist", "chart_hip", "chart_buttocks"
      ];
      window.bodyMeasurementsChart.data.datasets.forEach((dataset, index) => {
        const key = chartLabels[index];
        if (key && dict[key]) dataset.label = dict[key];
      });
      if (dict.chart_title) {
        window.bodyMeasurementsChart.options.plugins.title.text = dict.chart_title;
      }
      if (dict.chart_value) {
        window.bodyMeasurementsChart.options.scales.y.title.text = dict.chart_value;
      }
      window.bodyMeasurementsChart.update();
    }

    if (lang !== "en") {
      const tableLabels = TECHNOLOGY_TABLE_LABELS[lang] || {};
      document.querySelectorAll("table th, table td").forEach((el) => {
        if (el.children.length > 1) return;
        if (!el.dataset.i18nFallbackTableLabel) {
          el.dataset.i18nFallbackTableLabel = el.textContent.trim();
        }
        const original = el.dataset.i18nFallbackTableLabel;
        if (tableLabels[original]) {
          if (el.children.length === 1 && el.firstElementChild.tagName === "A" && el.firstElementChild.children.length === 0) {
            el.firstElementChild.textContent = tableLabels[original];
          } else {
            if (el.children.length === 0) {
              el.textContent = tableLabels[original];
            } else {
              Array.from(el.childNodes).forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                  node.textContent = node.textContent.replace(original, tableLabels[original]);
                }
              });
            }
          }
        }
      });
    } else {
      document.querySelectorAll("table th, table td").forEach((el) => {
        if (el.dataset.i18nFallbackTableLabel) {
          const original = el.dataset.i18nFallbackTableLabel;
          if (el.children.length === 1 && el.firstElementChild.tagName === "A" && el.firstElementChild.children.length === 0) {
            el.firstElementChild.textContent = original;
          } else {
            if (el.children.length === 0) {
              el.textContent = original;
            } else {
              Array.from(el.childNodes).forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                  node.textContent = node.textContent.replace(/.+/, original);
                }
              });
            }

            const sportLabels = SPORT_TABLE_LABELS[lang] || {};
            document.querySelectorAll("table caption, table th, table td").forEach((el) => {
              if (!el.dataset.i18nFallbackSportLabel) {
                el.dataset.i18nFallbackSportLabel = el.textContent.trim();
              }
              const original = el.dataset.i18nFallbackSportLabel;
              const translated = lang === "en" ? original : sportLabels[original];
              if (!translated) return;

              if (el.tagName === "A") {
                el.textContent = translated;
                return;
              }
              if (el.tagName === "TD" && el.querySelector("a")) {
                el.querySelectorAll("a").forEach((link) => {
                  if (!link.dataset.i18nFallbackSportLink) {
                    link.dataset.i18nFallbackSportLink = link.textContent.trim();
                  }
                  const linkText = link.dataset.i18nFallbackSportLink;
                  link.textContent = lang === "en" ? linkText : (sportLabels[linkText] || linkText);
                });
                return;
              }
              if (el.children.length === 0) {
                el.textContent = translated;
                return;
              }
              Array.from(el.childNodes).forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                  node.textContent = node.textContent.trim() === original
                    ? translated
                    : node.textContent.replace(original, translated);
                }
              });
            });
          }
        }
      });
    }

    const wordTranslations = {
      it: {
        "comment": "commento", "comments": "commenti", "comment line": "riga di commento",
        "This": "Questo", "is": "è", "a": "un", "the": "il", "file": "file",
        "files": "file", "line": "riga", "lines": "righe", "code": "codice",
        "list": "lista", "array": "array", "loop": "ciclo", "function": "funzione",
        "method": "metodo", "class": "classe", "variable": "variabile",
        "value": "valore", "values": "valori", "string": "stringa",
        "number": "numero", "true": "vero", "false": "falso",
        "input": "ingresso", "output": "uscita", "returns": "restituisce",
        "single": "singolo", "multiple": "multiplo", "copy": "copia",
        "copies": "copie", "copying": "copia", "runs": "viene eseguito",
        "once": "una volta", "continuous": "continuo", "continuously": "continuamente",
        "here": "qui", "overwrites": "sovrascrive", "current": "corrente",
        "active": "attivo", "target": "destinazione", "standard": "standard",
        "process": "processo", "processes": "processi", "error": "errore",
        "success": "successo", "connection": "connessione", "network": "rete",
        "file": "file", "directory": "cartella", "folder": "cartella",
        "permissions": "permessi", "read": "lettura", "write": "scrittura",
        "execute": "esecuzione", "executeable": "eseguibile",
        "background": "in secondo piano", "foreground": "in primo piano"
      },
      es: {
        "comment": "comentario", "comments": "comentarios", "comment line": "línea de comentario",
        "This": "Esto", "is": "es", "a": "un", "the": "el", "file": "archivo",
        "files": "archivos", "line": "línea", "lines": "líneas", "code": "código",
        "list": "lista", "array": "array", "loop": "bucle", "function": "función",
        "method": "método", "class": "clase", "variable": "variable",
        "value": "valor", "values": "valores", "string": "cadena",
        "number": "número", "true": "verdadero", "false": "falso",
        "input": "entrada", "output": "salida", "returns": "devuelve",
        "single": "único", "multiple": "múltiple", "copy": "copiar",
        "copies": "copias", "copying": "copiando", "runs": "se ejecuta",
        "once": "una vez", "continuous": "continuo", "continuously": "continuamente",
        "here": "aquí", "overwrites": "sobrescribe", "current": "actual",
        "active": "activo", "target": "objetivo", "standard": "estándar",
        "process": "proceso", "processes": "procesos", "error": "error",
        "success": "éxito", "connection": "conexión", "network": "red",
        "file": "archivo", "directory": "directorio", "folder": "carpeta",
        "permissions": "permisos", "read": "lectura", "write": "escritura",
        "execute": "ejecutar", "background": "segundo plano", "foreground": "primer plano"
      }
    };

    document.querySelectorAll(".cm").forEach((el) => {
      if (!el.dataset.i18nFallbackComment) {
        el.dataset.i18nFallbackComment = el.textContent;
      }
      const original = el.dataset.i18nFallbackComment;
      let translated = lang === "en" ? original : (CODE_COMMENT_TRANSLATIONS[lang] && CODE_COMMENT_TRANSLATIONS[lang][original]);

      if (!translated && lang !== "en") {
        translated = original;
        const replacements = wordTranslations[lang] || {};
        Object.keys(replacements).sort((a, b) => b.length - a.length).forEach((word) => {
          translated = translated.replace(new RegExp("\\b" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi"), replacements[word]);
        });
      }
      el.textContent = translated || original;
    });

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key in dict) {
        const attr = el.getAttribute("data-i18n-attr");
        let translated = dict[key];
        translated = translated.replace(/\{age\}/g, el.dataset.i18nAge || "");
        translated = translated.replace(/\{year\}/g, el.dataset.i18nYear || "");
        if (attr) {
          el.setAttribute(attr, translated);
        } else {
          el.innerHTML = translated;
        }
      }
    });

    const textAliases = {
      "Home": "nav_home",
      "Projects": "nav_projects",
      "Social": "nav_social",
      "About Me": "nav_aboutme",
      "Switch": "nav_switch",
      "Contact": "footer_contact",
      "Location": "footer_location_alt",
      "Back to Blog": "back_blog",
      "Back to Coding": "back_coding",
      "Back to Top": "back_top",
      "Copy": "footer_copy",
      "Copied!": "footer_copied"
    };
    const titleAliases = {
      "Home": "nav_home",
      "Projects": "nav_projects",
      "Social": "nav_social",
      "About Me": "nav_aboutme",
      "Toggle Theme": "theme_toggle_title"
    };

    document.querySelectorAll("[title]").forEach((el) => {
      if (el.hasAttribute("data-i18n")) return;
      if (!el.dataset.i18nFallbackTitle) {
        el.dataset.i18nFallbackTitle = el.getAttribute("title");
      }
      const key = titleAliases[el.dataset.i18nFallbackTitle];
      if (key && key in dict) el.setAttribute("title", dict[key]);
    });
    document.querySelectorAll("label, span").forEach((el) => {
      if (el.hasAttribute("data-i18n")) return;
      if (!el.dataset.i18nFallbackText) {
        el.dataset.i18nFallbackText = el.textContent.trim();
      }
      const key = textAliases[el.dataset.i18nFallbackText];
      if (key && key in dict) el.textContent = dict[key];
    });
    document.querySelectorAll(".copy-btn").forEach((el) => {
      const copied = el.innerHTML.includes("fa-check")
        || /Copiado|Copied|¡Copiado|Copiato/.test(el.textContent);
      const key = copied ? "footer_copied" : "footer_copy";
      if (key in dict) {
        el.innerHTML = copied
          ? `<i class="fa-solid fa-check"></i> ${dict[key]}`
          : `<i class="fa-regular fa-copy"></i> ${dict[key]}`;
      }
    });
    document.querySelectorAll("img[alt]").forEach((el) => {
      const altAliases = {
        "Contact": "footer_contact",
        "Location": "footer_location_alt",
        "Logo": "nav_logo",
        "Profile Logo": "footer_profile_logo"
      };
      if (!el.dataset.i18nFallbackAlt) {
        el.dataset.i18nFallbackAlt = el.getAttribute("alt");
      }
      const key = altAliases[el.dataset.i18nFallbackAlt];
      if (key && key in dict) el.setAttribute("alt", dict[key]);
    });

    document.documentElement.setAttribute("lang", lang);
    updateButtons(lang);
  }

  function updateButtons(lang) {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      const labels = {
        en: { en: "Switch to English", it: "Passa a inglese", es: "Cambiar a inglés" },
        it: { en: "Switch to Italian", it: "Passa a italiano", es: "Cambiar a italiano" },
        es: { en: "Switch to Spanish", it: "Passa a spagnolo", es: "Cambiar a español" }
      };
      btn.setAttribute("aria-label", labels[btn.dataset.lang][lang]);
    });
  }

  function setupLangButtons() {
    let container = document.querySelector(".lang-switcher");

    if (!container) {
      const switcher = document.querySelector(".theme-switcher");
      if (switcher && switcher.parentNode) {
        container = document.createElement("div");
        container.className = "lang-switcher";
        container.setAttribute("aria-label", "Language selector");

        const flags = { en: "🇬🇧", it: "🇮🇹", es: "🇪🇸" };
        const labels = { en: "English", it: "Italiano", es: "Español" };
        SUPPORTED.forEach((l) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "lang-btn";
          btn.dataset.lang = l;
          btn.setAttribute("aria-label", `Switch to ${labels[l] || l.toUpperCase()}`);
          btn.innerHTML = `<span class="flag-emoji">${flags[l] || ""}</span> <span>${l.toUpperCase()}</span>`;
          container.appendChild(btn);
        });

        switcher.parentNode.insertBefore(container, switcher);
      }
    }

    // Aggiungi click handler a tutti i bottoni lingua presenti
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener("click", () => {
          setLang(btn.dataset.lang);
        });
      }
    });
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    // Fade out
    document.body.style.transition = "opacity 0.25s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      applyTranslations(lang);
      // Aggiorna testo dei copy-btn non in stato "copied"
      document.querySelectorAll(".copy-btn:not(.copied)").forEach(btn => {
        const dict = COMMON_TRANSLATIONS[lang] || COMMON_TRANSLATIONS["en"];
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> ' + (dict.copy_btn || "Copy");
      });
      // Fade in
      document.body.style.opacity = "1";
    }, 250);
  }

  function setupCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      if (btn.dataset.copyBound) return;
      btn.dataset.copyBound = "true";
      btn.addEventListener("click", () => {
        setTimeout(() => applyTranslations(getCurrentLang()), 0);
        setTimeout(() => applyTranslations(getCurrentLang()), 1700);
      });
    });
  }

  function init() {
    const lang = getCurrentLang();
    setupLangButtons();
    setupCopyButtons();
    // Applica subito le traduzioni comuni prima ancora del fetch
    applyTranslations(lang);

    const pageId = getPageId();
    const jsonUrl = getJsonUrl(pageId);

    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`i18n fetch failed: ${jsonUrl} (${r.status})`);
        return r.json();
      })
      .then((data) => {
        pageTranslations = data;
        applyTranslations(getCurrentLang());
      })
      .catch((err) => {
        console.warn("[i18n]", err.message);
      });

  }

  window.setLang = setLang;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
