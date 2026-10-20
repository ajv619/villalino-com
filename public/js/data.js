/* SITE CONTENT — EDIT HERE, NOT IN index.html.
   js/render.js TURNS THESE INTO THE EXPERIENCE / PROJECTS / RESEARCH /
   EDUCATION CARDS; js/script.js THEN ADDS THE INTERACTIONS.

   PLAIN STRINGS ONLY (NO HTML). USE REAL CHARACTERS FOR PUNCTUATION
   (’ – − · &). THE ONLY MARKUP IS **bold** IN EXPERIENCE BULLETS.

   PROJECT FIELDS
     kind       "technical" | "creative"  → CARD COLOR + TAG (</> OR ✦)
     title, year
     stack      [..]   TECHNICAL: TOOLS LIST
     role, org         CREATIVE: CREDIT LINES
     credits    [..]   LINES BEFORE THE DESCRIPTION ("Dir. …"), ONE PER LINE
     desc
     github            REPO / SITE BUTTON (TECHNICAL ONLY)
     logo, logoLink    APP ICON / LOGO IN THE EXPANDED CARD (OPTIONAL LINK).
                       WITHOUT logo THE SLOT STAYS HIDDEN.
     fullLogo   true   SHOW THE LOGO WITHOUT THE APP-ICON TILE
     video      { type: "youtube"|"vimeo", id } | { type: "file", src }
                | { type: "link", href }  (CLICK-OUT BUTTON)
     delayed    true   STRIKE THROUGH THE CARD AND MARK "UPDATE: DELAYED."
   NEWEST FIRST. */

var EXPERIENCE = [
  {
    href: 'https://mpl.ucsd.edu/',
    label: 'Marine Physical Laboratory',
    logo: 'images/scripps-white.png',
    logoAlt: 'Scripps Institution of Oceanography seal',
    title: 'Electrical Manufacturing Assistant',
    meta: 'Scripps Institution of Oceanography · La Jolla Shores, CA · March 2024 – June 2026',
    bullets: [
      'Built **hydrophones**, an **embedded sensor system** for recording underwater acoustics.',
      'Developed a **PyTorch** anomaly-detection model for hydrophone power-health monitoring, integrated into the **MATLAB DL Toolbox**.',
      'Performed **signal processing** and analysis on acoustic data, deriving **transfer functions** to characterize hydrophone frequency response.',
      'Migrated legacy calibration software from **LabVIEW** to **MATLAB**, using **AI** tools to accelerate the code translation.',
      'Managed intern-led development of a **Raspberry Pi** (**Linux**) deep-sea camera control system for real-time field operation.',
      'Authored manufacturing procedures and assembly documentation to ensure repeatable, validated builds across deployments.'
    ]
  },
  {
    href: 'https://ieeeatucsd.org/',
    label: 'IEEE at UC San Diego',
    logo: 'images/ieee-white.png',
    logoAlt: 'IEEE logo',
    title: 'Project Member',
    meta: 'IEEE at UC San Diego · La Jolla, CA · December 2023 – March 2024',
    bullets: [
      'Designed a 2.4 GHz Wi-Fi/Bluetooth **low-noise amplifier (LNA)** in a 4-person team; the LNA is a receiver’s first stage, boosting faint signals without burying them in its own noise.',
      'Ran the **impedance-matching** and **bias-network** simulations in **Keysight ADS**, so incoming signal is absorbed rather than reflected; the design met its targets with a **noise figure under 2.5 dB** and input reflection (**S11**) below −15 dB.'
    ]
  }
];

var PROJECTS = [
  {
    kind: 'technical',
    title: 'BARELY SEE THE BEACH',
    year: 'FROM ANTH WITH LOVE · Present',
    stack: ['HTML / CSS / JS'],
    desc: 'Redesigning the web storefront for local streetwear brand Barely See The Beach to improve the shopping experience and better showcase the brand.',
    github: 'https://ajv619.github.io/barelyseethebeach-redesign/',
    logo: 'images/bstb-favicon.svg'
  },
  {
    kind: 'technical',
    title: '********',
    year: 'FROM ANTH WITH LOVE · Present',
    stack: ['TypeScript', 'Rust', 'PostgreSQL', 'Cloud Infrastructure'],
    desc: 'Building software for music collaboration.'
  },
  {
    kind: 'technical',
    title: 'Pomona',
    year: 'FROM ANTH WITH LOVE · Present',
    stack: ['C++', 'ESP32', 'MQTT', 'React', 'PlatformIO'],
    desc: 'Building a connected hardware-and-software system as a personal gift for my grandpa, combining embedded control, sensing, and a web interface.',
    logo: 'images/pomona-icon.svg'
  },
  {
    kind: 'creative',
    title: 'Taal',
    year: 'Short Film · Present',
    role: 'Composer',
    org: 'Triton Television Production',
    credits: ['Dir. Vaish Kurupath.'],
    desc: 'A dramedy about Arjun, a canceled young comedian who returns to the tabla after his estranged teacher dies and names him to perform at the memorial.',
    logo: 'images/taal-logo.svg',
    delayed: true
  },
  {
    kind: 'technical',
    title: 'Pukka: Sneaker Authentication Platform',
    year: 'ECE 140B · Spring 2026',
    stack: ['SwiftUI', 'FastAPI', 'PostgreSQL', 'Docker', 'OpenCV', 'Raspberry Pi', 'Pi Camera / NIR / Load Cell'],
    desc: 'In a team of 3, we built a physical sneaker authentication system that combines image, near-infrared, and weight data to identify counterfeit shoes with a confidence score. Awarded 2nd place at The Basement at UCSD’s Demo Day.',
    github: 'https://github.com/ajv619/pukka',
    logo: 'images/pukka.svg',
    fullLogo: true
  },
  {
    kind: 'technical',
    title: 'PICO-9: Custom ISA & Processor',
    year: 'CSE 141L · Spring 2026',
    stack: ['SystemVerilog', 'Python', 'ModelSim', 'Quartus'],
    desc: 'Designed a custom 9-bit RISC processor and two-pass assembler from scratch, then validated it with programs for Hamming distance, arithmetic, and signed multiplication.',
    github: 'https://github.com/ajv619/pico-9'
  },
  {
    kind: 'technical',
    title: 'The False Tremor: Sampling, Aliasing & Reconstruction',
    year: 'ECE 101 · Spring 2026',
    stack: ['MATLAB', 'DSP', 'FIR Filter Design'],
    desc: 'Demonstrated how undersampling can turn high-frequency machine noise into a false structural tremor, then designed an anti-aliasing filter to prevent it.',
    github: 'https://github.com/ajv619/the-false-tremor'
  },
  {
    kind: 'technical',
    title: 'Edge-AI Thermal Sensing IoT System',
    year: 'ECE 140A · Winter 2026',
    stack: ['C++ / Arduino', 'ESP32', 'FastAPI', 'MQTT', 'WebSockets', 'TensorFlow Lite Micro'],
    desc: 'Built an end-to-end thermal sensing system that streams sensor data, trains a presence-detection model, and deploys quantized inference directly on an ESP32.',
    github: 'https://github.com/ajv619/edge-ai-thermal-sensing-iot'
  },
  {
    kind: 'technical',
    title: 'Transformer from Scratch & Retrieval-Augmented Generation',
    year: 'CSE 156 · Winter 2026',
    stack: ['Python', 'PyTorch', 'LangChain', 'FAISS'],
    desc: 'Implemented a Transformer from scratch and built generation and retrieval pipelines with beam search, vector search, and ColBERT-style reranking.',
    github: 'https://github.com/ajv619/transformer-from-scratch-rag'
  },
  {
    kind: 'technical',
    title: 'Viterbi Decoder: FPGA Convolutional-Code Error Correction',
    year: 'ECE 111 · Winter 2026',
    stack: ['SystemVerilog', 'FPGA', 'Quartus', 'ModelSim'],
    desc: 'Built and verified an FPGA Viterbi decoder for convolutional error correction, achieving 256/256 correctly decoded test bits and stress-testing its limits under channel errors.',
    github: 'https://github.com/ajv619/viterbi-decoder-ece111'
  },
  {
    kind: 'creative',
    title: 'After Hours',
    year: 'Short Film · Winter 2026',
    role: 'Co-Producer / Composer / Boom Operator',
    org: 'Triton Television Production',
    credits: ['Dir. Ian Kiar.', 'DP: Hayk Atshemyan.'],
    desc: 'Co-produced the shoot and composed an original score for a 48-hour short film.'
  },
  {
    kind: 'technical',
    title: 'SocialCircle: Social-Network Link Prediction',
    year: 'CSE 158 · Fall 2025',
    stack: ['Python', 'pandas', 'NumPy', 'NetworkX', 'scikit-learn'],
    desc: 'Built a link-prediction system across 1.39 million friend pairs using graph-based features and machine learning, with the strongest models reaching roughly 0.86–0.89 ROC-AUC.',
    github: 'https://github.com/ajv619/socialcircle'
  },
  {
    kind: 'technical',
    title: 'Library Loop',
    year: 'CSE 170 · Fall 2025',
    stack: ['HTML / CSS / JS', 'Figma'],
    desc: 'Designed and built a web prototype that makes local library events, programs, resources, and services easier to discover and navigate.',
    github: 'https://github.com/ajv619/library-loop'
  },
  {
    kind: 'technical',
    title: 'Symbolic Music Generation',
    year: 'CSE 153 · Spring 2025',
    stack: ['Python', 'PyTorch', 'MIDI', 'REMI'],
    desc: 'Built generative music models that create piano performances and chord-conditioned melodies from MIDI, then evaluated the results using music-specific quality metrics.',
    github: 'https://github.com/ajv619/symbolic-music-generation'
  },
  {
    kind: 'creative',
    title: 'Darling, Forgive Me',
    year: 'Short Film · 2025',
    role: 'Writer / Co-Director / Composer',
    org: 'Freelance, in support by MPRO Productions.',
    credits: ['Dir. Ronald Bagsic & Anthony Jared', 'DP: Griffin Edwards.'],
    desc: 'Scouted locations and composed an original score for an accepted SDSU Film School audition.',
    logo: 'images/darling-forgive-me.svg',
    video: { type: 'link', href: 'https://www.youtube.com/watch?v=qkw4jfSjXQM' }
  },
  {
    kind: 'technical',
    title: 'Supervised Learning Models for Binary Classification',
    year: 'COGS 118A · Fall 2024',
    stack: ['Python', 'scikit-learn', 'NumPy', 'pandas'],
    desc: 'Compared five machine-learning models across four classification datasets, evaluating how model choice and training-set size affected performance through cross-validation and hyperparameter tuning.',
    github: 'https://github.com/ajv619/supervised-learning-models'
  },
  {
    kind: 'technical',
    title: 'Band Pass Filter',
    year: 'ENGR 210 · Spring 2023',
    stack: ['Multisim', 'MATLAB', 'Simulink', 'Arduino'],
    desc: 'Designed, simulated, built, and tested an RLC band-pass filter, validating its measured frequency response against calculated and simulated results.'
  },
  {
    kind: 'creative',
    title: 'Griffin Radio',
    year: 'Radio Play / Audio Drama · 2023',
    role: 'Co-Writer / Recording Engineer',
    org: 'Grossmont College Media Communications Department Production',
    credits: ['Produced by Dr. Evan Wirig.'],
    desc: 'Our team of 8 produced an hour-long radio play with narration-driven storytelling, cast direction, and SFX/foley design.',
    logo: 'images/griffin-radio-logo-transparent.png'
  },
  {
    kind: 'creative',
    title: 'A Fork in the Road',
    year: 'Short Film · 2023',
    role: 'Composer',
    org: 'Southwestern College (FTMA) Production',
    credits: ['Dir. E. McCall.'],
    desc: 'Composed a thematic score and assisted in rigging for two weekend shoots.',
    logo: 'images/a-fork-in-the-road.svg'
  },
  {
    kind: 'technical',
    title: 'Drone Recon Data Service',
    year: 'CSIS 294 · Spring 2021',
    stack: ['Java Servlets', 'JSP', 'REST API', 'JDBC/SQL', 'Apache Tomcat'],
    desc: 'Built a Java web application that simulates drone surveys, stores reconnaissance data, and exposes summarized results through a database-backed REST service.',
    github: 'https://github.com/ajv619/drone-recon-data-service'
  },
  {
    kind: 'technical',
    title: 'P2P Blockchain Miner',
    year: 'CSIS 294 · Spring 2021',
    stack: ['Java', 'Multithreading', 'TCP Sockets'],
    desc: 'Built a multithreaded peer-to-peer blockchain node that mines proof-of-work blocks and exchanges transactions and blocks with other networked peers.',
    github: 'https://github.com/ajv619/p2p-blockchain-miner'
  },
  {
    kind: 'creative',
    title: 'SCPA Graduation Video: Class of 2020',
    year: 'Video · 2020',
    role: 'Producer',
    org: 'San Diego SCPA Production',
    credits: ['Dir. Thomas Antl.'],
    desc: 'As Senior Class President, handled logistics and personnel sourcing across three weeks.',
    video: { type: 'link', href: 'https://www.youtube.com/watch?v=Aml_D5DN-T4' }
  },
  {
    kind: 'creative',
    title: 'Life’s A Fight',
    year: 'Short Film · 2019',
    role: 'Writer / Director / Editor',
    org: 'San Diego City College (c/o San Diego SCPA) Production',
    credits: ['Dir. A.J. Villalino.'],
    desc: 'Led a 4-person unit for a 24-hour film accepted into Grossmont College’s Directing Short Change Film Festival.',
    video: { type: 'link', href: 'https://www.youtube.com/watch?v=sNqVX0tSDfc' }
  },
  {
    kind: 'creative',
    title: 'Under the Tulips',
    year: 'Short Film · 2018',
    role: 'Sound Designer / Boom Operator',
    org: 'San Diego SCPA Production',
    credits: ['Dir. Lucia Wallin.'],
    desc: 'Oversaw all audio assets for a thesis film in the SCPA film department.',
    video: { type: 'vimeo', id: '269207192' }
  }
];

/* RESEARCH — body is a list of text runs; { text, href } RUNS BECOME LINKS.
   logoShape "wide" (WORDMARK) OR "mark" (SQUARE-ISH EMBLEM). */
var RESEARCH = [
  {
    href: 'https://mbarc.ucsd.edu/',
    label: 'Marine Bioacoustics Research Collaborative',
    logo: 'images/MBARC_white.png',
    logoShape: 'wide',
    body: [
      'Designed, developed, and deployed hydrophones for the High-frequency Acoustic Recording Package (HARP), supporting research on biological and non-biological soundscapes across the Southern California Bight, Gulf of Mexico, Azores, and the Canadian Arctic, where I specialized. This work supports the ',
      { text: 'Scripps Whale Acoustics Laboratory', href: 'https://www.cetus.ucsd.edu/index.html' },
      ' in collaboration with ',
      { text: 'Oceans North', href: 'https://oceansnorth.org/' },
      '.'
    ]
  },
  {
    href: 'https://www.cuyamaca.edu/academics/academic-and-career-pathways/stem/physics/index.php',
    label: 'Cuyamaca College',
    logo: 'images/cuyamaca-white.png',
    logoShape: 'mark',
    body: [
      'Modeled a variable parallel-plate capacitor to analyze how dielectric material, plate area, and plate separation affect capacitance. Findings have reinforced that capacitance increases with a higher dielectric constant, larger plate area, and smaller gap, connecting these principles to RAM and EV regenerative braking.'
    ]
  }
];

/* EDUCATION — activities: { role, org, href } ("Role, Org" WITH Org
   LINKED WHEN href IS SET); nowrap KEEPS THAT PAIR ON ONE LINE. */
var EDUCATION = [
  {
    name: 'University of California, San Diego',
    logo: 'images/uc_san_diego_tritons_logo_secondary_2018_sportslogosnet-1120.png',
    logoAlt: 'UC San Diego trident',
    meta: 'La Jolla, CA · September 2023 – June 2026',
    degrees: ['B.S. ECE: Computer Engineering'],
    activities: [
      { role: 'Project Lead', org: 'IEEE', href: 'https://ieeeatucsd.org/' },
      { role: 'Hack Student', org: 'ACM', href: 'https://acmucsd.com/' },
      { role: 'Producer', org: 'Triton Television', href: 'https://www.ttvucsd.com/', nowrap: true }
    ]
  },
  {
    name: 'Grossmont College',
    logo: 'images/grossmont-crest.svg',
    logoAlt: 'Grossmont College crest',
    meta: 'El Cajon, CA · August 2020 – June 2023',
    degrees: ['A.S. Mathematics', 'A.S. Physics', 'A.S. Computer Science'],
    activities: [
      { role: 'Founding Member', org: 'Grossmont Cuyamaca CS' }
    ]
  }
];
