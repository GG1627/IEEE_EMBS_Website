export const careerFields = [
  {
    name: "Medical Imaging", //! MEDICAL IMAGING
    description: "MRI, CT, Image Reconstruction/Enhancement Techniques",
    uf_research_professors: [
      {
        name: "Dr. Ruogo Fang (BME)",
        linkedin: "https://www.linkedin.com/in/ruogu-fang-a015bb15/",
        lab: "https://lab-smile.github.io/",
      },
      {
        name: "Dr. Wesley Bolch (BME)",
        linkedin: "https://www.linkedin.com/in/wesley-bolch-68b80618/",
        lab: "https://medphysics.med.ufl.edu/medical-physics-graduate-program/faculty-facilities/research-labs/advanced-laboratory-for-radiation-dosimetry-studies/",
      },
      {
        name: "Dr. Kuang Gong (BME)",
        linkedin: "https://www.linkedin.com/in/kuang-gong-49501223/",
        lab: "https://gong-lab.com/",
      },
      {
        name: "Dr. Pinaki Sarder (ECE)",
        linkedin: "https://www.linkedin.com/in/pinaki-sarder-94a9b99/",
        lab: "https://cmilab.nephrology.medicine.ufl.edu/",
      },
      {
        name: "Dr. Baba C. Vemuri (CISE)",
        linkedin: "https://www.linkedin.com/in/baba-vemuri-22955545/",
        lab: "https://www.cise.ufl.edu/~vemuri/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Peirong Liu (Johns Hopkins)",
        linkedin: "https://www.linkedin.com/in/peirongliu/",
        lab: "https://peirong26.github.io/",
      },
    ],
    companies: [
      "GE Healthcare",
      "NVIDIA Healthcare",
      "Siemens Healthineers",
      "Johnson & Johnson MedTech",
      "Philips Healthcare",
    ],
    skills: [
      "Image Processing",
      "Python",
      "MATLAB",
      "Signal Processing",
      "Machine Learning",
      "Medical Physics",
      "3D Visualization",
      "MONAI",
      "PyTorch",
      "TensorFlow",
      "Keras",
    ],
    classes: [
      "BME4531 - Medical Imaging",
      "EEL4930/5934 - Special Topics in Electrical Engineering: Intro Biomedical Image Analysis",
      "EEL6935 - Special Topics in Electrical Engineering: Deep Learning in Medical Image Analysis",
      "BME6535 - Radiological Physics, Measurements and Dosimetry",
    ],
    projectIdeas: [
      "Develop a deep learning model to classify MRI brain scans for early tumor detection.",
      "Implement an image reconstruction algorithm for low-dose CT scans to reduce patient radiation.",
      "Build an open-source DICOM viewer with real-time 3D visualization capabilities.",
      "Research photoacoustic imaging for detecting early-stage skin cancer.",
      "Create an AI-powered tool for automatic segmentation of cardiac MRI images.",
    ],
  },
  {
    name: "Signal Processing", //! SIGNAL PROCESSING
    description: "ECG, EEG, Biosignal Analysis/Manipulation",
    uf_research_professors: [
      {
        name: "Dr. Mingzhou Ding (BME)",
        linkedin: "https://www.linkedin.com/in/mingzhou-ding-6a348a88/",
        lab: "https://bme.ufl.edu/dept-member/ding_mingzhou/",
      },
      {
        name: "Dr. Nicholas Napoli (ECE)",
        linkedin:
          "https://www.linkedin.com/in/nicholas-joseph-napoli-phd-26238b24/",
        lab: "https://hippo.ece.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: [
      "Texas Instruments",
      "Analog Devices",
      "PLUX",
      "NASA Human Health and Performance",
    ],
    skills: ["Python", "MATLAB", "Signal Processing", "Linear Algebra"],
    classes: [
      "EEL3135 - Introduction to Signals and Systems",
      "EEL4750/EEE5502 - Foundations of Digital Signal Processing",
      "EEE4511 - Real-time DSP Applications",
      "EEL3008 - Physics of Electrical Engineering",
      "BME3508 - Biosignals and Systems",
      "BME4503 - Biomedical Instrumentation",
      "EEL6537 - Spectrum Sensing and Sparse Signal Recovery",
      "EEE5283 - Neural Signals, Systems and Technology",
      "BME6522 - Multivariate Biomedical Signal Processing",
    ],
    projectIdeas: [
      "Design a real-time ECG signal filter to remove motion artifacts in wearable devices.",
      "Implement EEG-based brain–computer interface for controlling a robotic arm.",
      "Analyze EMG signals to detect early signs of muscle fatigue in athletes.",
      "Create a mobile app for remote heart-rate variability monitoring using biosignals.",
      "Build a Python-based pipeline for automated seizure detection from EEG data.",
    ],
  },
  {
    name: "Medical Devices", //! MEDICAL DEVICES
    description: "Pacemakers, Smart Prosthetics, Artificial Pancreas",
    // uf_research_professors: [],
    uf_teaching_professors: [
      {
        name: "Dr. Mansy",
        linkedin: "https://www.linkedin.com/in/maymansy/",
      },
    ],
    // external_professors: [],
    companies: [
      "Johnson & Johnson MedTech",
      "Medtronic",
      "Arthrex",
      "Edwards Lifesciences",
      "Texas Instruments",
      "Boston Scientific",
    ],
    skills: [
      "PCB Design",
      "Circuit Design",
      "KiCAD",
      "LTspice",
      "Oscilloscope",
      "SolidWorks",
      "AutoCAD",
      "3D Printing",
      "Prototyping",
      "Microprocessors",
    ],
    classes: ["BME4503 - Biomedical Instrumentation"],
    projectIdeas: [
      "Prototype a smart insulin pump with continuous glucose monitoring integration.",
      "Develop a low-cost, 3D-printed prosthetic limb with myoelectric control.",
      "Design a pacemaker simulator for medical training applications.",
      "Create an app-connected portable ECG monitoring device.",
      "Research and develop a wearable respiratory rate monitor for ICU patients.",
    ],
  },
  {
    name: "Neuroengineering", //! NEUROENGINEERING
    description: "Neuromodulation, Computational Neuroscience",
    uf_research_professors: [
      {
        name: "Dr. Aprinda I. Queen (Public Health)",
        linkedin: "https://www.linkedin.com/in/aprinda/",
        lab: "https://mbi.ufl.edu/tag/aprinda-i-queen/",
      },
      {
        name: "Dr. Jack Judy (ECE)",
        linkedin: "https://www.linkedin.com/in/jack-judy/",
        lab: "https://judylab.ece.ufl.edu/",
      },
      {
        name: "Dr. Karim Oweiss (ECE)",
        linkedin: "https://www.linkedin.com/in/karim-oweiss-49221314/",
        lab: "https://oweisslab.ece.ufl.edu/",
      },
      {
        name: "Dr. Adam Khalifa (ECE)",
        linkedin: "https://www.linkedin.com/in/adam-khalifa-bb62b6138/",
        lab: "https://www.khalifaadam.com/",
      },
      {
        name: "Dr. Erin Patrick (ECE)",
        linkedin: "https://www.linkedin.com/in/erin-patrick-6921a913/",
        lab: "https://epatrick.ece.ufl.edu/home/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Krishna Jayant (Purdue)",
        linkedin: "https://www.linkedin.com/in/krishna-jayant/",
        lab: "https://nanoneurotech.com/",
      },
      {
        name: "Dr. George Malliaras (Cambridge)",
        linkedin:
          "https://www.linkedin.com/in/georgemalliaras/?originalSubdomain=uk",
        lab: "https://bioelectronics.eng.cam.ac.uk/",
      },
      {
        name: "Dr. Sergey Stavisky (UC Davis)",
        linkedin: "https://www.linkedin.com/in/sergey-stavisky-2aab924/",
        lab: "https://neuroprosthetics.science/",
      },
      {
        name: "Dr. David Brandman (UC Davis)",
        linkedin: "https://www.linkedin.com/in/david-brandman-md-phd-4172b973/",
        lab: "https://neuroprosthetics.science/",
      },
      {
        name: "Dr. Tomasz M. Rutkowski (Tokyo)",
        linkedin:
          "https://www.linkedin.com/in/tomasz-maciej-rutkowski/?originalSubdomain=jp",
        lab: "https://tomek.bci-lab.info/",
      },
    ],
    companies: [
      "Blackrock Neurotech",
      "Precision Neuroscience",
      "Neurolink",
      "Paradronics",
    ],
    skills: ["Signal Processing", "Python", "Machine Learning"],
    classes: ["EEE4260 - Bioelectrical Systems"],
    projectIdeas: [
      "Build a non-invasive neurostimulation device for migraine relief.",
      "Implement neural network models to predict neural firing patterns from recorded data.",
      "Design a brain–computer interface game for neurorehabilitation therapy.",
      "Research adaptive deep brain stimulation control algorithms.",
      "Create a system for real-time analysis of multi-electrode neural recordings.",
    ],
  },
  {
    name: "AI & ML", //! AI & ML
    description:
      "Digital twins, Precision Medicine, Predictive Analytics/Diagnosis",
    // uf_research_professors: []
    uf_teaching_professors: [
      {
        name: "Dr. Catia Silva (ECE)",
        linkedin: "https://www.linkedin.com/in/c%C3%A1tia-silva-a9215430/",
      },
    ],
    // external_professors: [],
    companies: ["IBM Digital Health", "Microsoft Research", "Verily"],
    skills: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "Keras",
      "Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "Natural Language Processing",
    ],
    classes: [
      "EEL3872 - Artificial Intelligence Fundamentals",
      "EEE3773 - Introduction to Machine Learning",
      "EEE4773 - Fundamentals of Machine Learning",
      "EEL5934 - Special Topics in Electrical Engineering:Applied Machine Learning Systems",
      "EGN5216 - Machine Learning for AI Systems",
      "EGN6216 - Artificial Intelligence Systems",
      "CAP5416 - Computer Vision",
      "EEL4403/5406 - Computational Photography",
      "EEE6512 - Image Processing and Computer Vision",
      "EGN6217 - Applied Deep Learning",
    ],
    projectIdeas: [
      "Develop a predictive model for hospital readmission using patient EHR data.",
      "Create a deep learning framework for multi-modal medical data fusion.",
      "Implement an AI “digital twin” for personalized heart disease risk prediction.",
      "Build a computer vision system for detecting diabetic retinopathy from eye scans.",
      "Research reinforcement learning algorithms for adaptive radiation therapy planning.",
    ],
  },
  {
    name: "Bioinformatics & Genomics", //! BIOINFORMATICS & GENOMICS
    description: "Computational Genomics, Multi-omics data, Synthetic Biology",
    uf_research_professors: [
      {
        name: "Dr. Xiao Fan (BME)",
        linkedin: "https://www.linkedin.com/in/xiao-fan-26520625/",
        lab: "https://xiaofan-lab.github.io/",
      },
      {
        name: "Dr. Tamer Kahveci (CISE)",
        linkedin: "https://www.linkedin.com/in/tamer-kahveci-3a210111/",
        lab: "https://www.cise.ufl.edu/~tamer/",
      },
      {
        name: "Dr. Kiley Graim (BME)",
        linkedin: "https://www.linkedin.com/in/kiley-graim-5a8510b/",
        lab: "https://graimlab.org/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Ernest Fraenkel (MIT)",
        linkein: "https://www.linkedin.com/in/ernest-fraenkel-22982b162/",
        lab: "https://fraenkel.mit.edu/",
      },
    ],
    companies: ["IBM Digital Health", "The DNA Company"],
    skills: ["N/A"],
    classes: [
      "BSC2891 - Python Programming for Biologists",
      "BSC4434C - Introduction to Bioinformatics",
      "MCB4320C - The Microbiome",
      "BSC4913 - Independent Research in Bioinformatics",
      "MAP4484/5489 - Modeling in Mathematical Biology",
      "PCB3063 - Genetics",
      "PCB4674 - Evolution ",
      "PCB5065 - Advanced Genetics",
      "MCB4934 - Special Topics in Microbiology and Cell Science (Advanced Bioinformatics)",
    ],
    projectIdeas: [
      "Develop a pipeline for analyzing RNA-Seq data from cancer patient samples.",
      "Create a web tool to visualize gene expression patterns across different tissues.",
      "Implement machine learning models to predict protein–protein interactions.",
      "Analyze microbiome data to find correlations with dietary patterns.",
      "Research CRISPR target site prediction algorithms for genome editing.",
    ],
  },
  {
    name: "Digital Health & Wearables", //! DIGITAL HEALTH & WEARABLES
    description: "Smartwatches, Telehealth",
    // uf_research_professors: [],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: [
      "Apple",
      "Samsung",
      "FitBit",
      "Google",
      "Magic Leap",
      "Microsoft (HoloLens)",
    ],
    skills: ["Signal Processing"],
    classes: [
      "HSC4064 - Wearable Technology, Robotics, and Artificial Intelligence for Health",
      "DIG4634 - Wearable and Mobile App Development",
      "HSA4191 - Health Informatics & Emerging Healthcare Technologies",
    ],
    projectIdeas: [
      "Design a smartwatch app to track stress levels using heart-rate variability.",
      "Develop a wearable hydration monitoring patch for athletes.",
      "Create a remote patient monitoring platform for chronic disease management.",
      "Research AI-driven fall detection systems for elderly care.",
      "Build a fitness tracker that integrates with telehealth platforms.",
    ],
  },
  {
    name: "Healthcare Robotics", //! HEALTHCARE ROBOTICS
    description: "Surgical Robotics, Autonomous Labs",
    // uf_research_professors: [],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Intuitive", "Disney Research", "Figure", "Humanoid"],
    skills: ["FPGA", "Microprocessors", "Circuitry"],
    classes: [
      "HSC4064 - Wearable Technology, Robotics, and Artificial Intelligence for Health",
    ],
    projectIdeas: [
      "Build a robotic arm for performing repetitive physical therapy exercises.",
      "Design a minimally invasive surgical robot simulator for training purposes.",
      "Create a mobile assistive robot to help hospital staff transport supplies.",
      "Research AI path-planning algorithms for autonomous disinfection robots.",
      "Develop a robot-assisted ultrasound scanning system.",
    ],
  },
  {
    name: "Modeling & Simulation", //! MODELING & SIMULATION
    description:
      "Computational Modeling of Organs, In-silico clinical trials, Finite Element Analysis",
    uf_research_professors: [
      {
        name: "Dr. Markus Santoso (DAS)",
        linkedin: "https://www.linkedin.com/in/markus-santoso-779172354/",
        lab: "https://ufblockchain.org/markus-santoso/",
      },
      {
        name: "Dr. Angelos Barmpoutis (DAS)",
        linkedin: "https://www.linkedin.com/in/angelos-barmpoutis-147b19a/",
        lab: "https://codingplusfun.com/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Relevate Health", "Dassault Systèmes", "Ansys"],
    skills: ["Unity", "Virtual Reality", "Augmented Reality"],
    classes: [
      "EGM4585 - Modeling and Control of Biomolecular Machines",
      "EGM4590 - Biodynamics",
      "EGM4592 - Bio-Solid Mechanics",
      "ABE5643C - Biological Systems Modeling",
      "ABE5646 - Biological and Agricultural Systems Simulation",
    ],
    projectIdeas: [
      "Create a finite element model of the human knee joint under various loads.",
      "Develop a computational model for simulating blood flow in arteries with stenosis.",
      "Implement an in-silico clinical trial simulator for cardiac devices.",
      "Build a multi-scale model linking cellular and organ-level cardiac dynamics.",
      "Research virtual patient simulations for personalized medicine testing.",
    ],
  },
  {
    name: "Cyber-BioSecurity", //! CYBER-BIOSECURITY
    description: "Human-Body Communication, Biometric Authentication",
    uf_research_professors: [
      {
        name: "Dr. Chatterjee (ECE)",
        linkedin: "https://www.linkedin.com/in/baibhabchatterjee/",
        lab: "https://chatterjee.ece.ufl.edu/",
      },
      {
        name: "Dr. Swarup Bhunia (ECE)",
        linkedin: "https://www.linkedin.com/in/swarup-bhunia-1281825/",
        lab: "https://swarup.ece.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    // external_professors: [],
    companies: ["Ixana"],
    skills: ["N/A"],
    classes: ["CIS4930 - Special Topics in CISE: Adversarial Cyber Tradecraft"],
    projectIdeas: [
      "Prototype a secure wireless communication protocol for implanted medical devices.",
      "Develop biometric authentication using ECG or EEG patterns.",
      "Analyze vulnerabilities in Bluetooth-enabled health wearables.",
      "Research methods to detect spoofing in biosignal-based authentication systems.",
      "Build a simulation environment for testing cyber attacks on medical IoT devices.",
    ],
  },
  {
    name: "Nano & Microtech", //! NANO & MICROTECH
    description: "Bio-MEMS, Lab-on-a-Chip, Biological VLSI",
    uf_research_professors: [
      {
        name: "Dr. Hugh Fan (MAE)",
        linkedin: "https://www.linkedin.com/in/hughfan/",
        lab: "https://web.mae.ufl.edu/hfan/",
      },
      {
        name: "Dr. Domenic Forte (ECE)",
        linkedin: "https://www.linkedin.com/in/domenic-forte-13233153/",
        lab: "https://scannlab.psych.ufl.edu/",
      },
    ],
    // uf_teaching_professors: [],
    external_professors: [
      {
        name: "Dr. Rahul Sarpeshkar (Dartmouth)",
        linkedin:
          "https://engineering.dartmouth.edu/community/faculty/rahul-sarpeshkar",
        lab: "https://physics.dartmouth.edu/people/rahul-sarpeshkar",
      },
    ],
    companies: ["N/A"],
    skills: ["VLSI", "Digital Logic"],
    classes: [
      "EEE4420 - Introduction to Nanodevices",
      "EEL5934 - Special Topics in Electrical Engineering: Future of Micro/Nano Sys",
      "BME5580 - Introduction to Microfluidics and BioMEMS",
      "EEE5354L - Semiconductor Device Fabrication Laboratory",
      "EEE5405 - Microelectronic Fabrication Technologies",
      "EEE4329/5400 - Future of Microelectronics Technology",
    ],
    projectIdeas: [
      "Design a lab-on-a-chip device for rapid COVID-19 diagnostics.",
      "Develop a microfluidic platform for sorting circulating tumor cells from blood samples.",
      "Research nanosensors for continuous glucose monitoring.",
      "Build a MEMS-based pressure sensor for catheter applications.",
      "Create a wearable microfluidic sweat analysis patch.",
    ],
  },
];
