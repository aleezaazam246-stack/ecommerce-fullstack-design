import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aether Mechanical Keyboard",
    description: "A compact 75% layout mechanical keyboard featuring a solid CNC-milled aluminum chassis, gasket-mounted brass plate, and custom pre-lubed linear switches. Crafted for tactile perfection and typing resonance.",
    price: 189,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000",
    category: "Workspace",
    rating: 4.9,
    ratingCount: 124,
    stock: 12,
    features: [
      "75% compact form factor with rotary knob",
      "Gasket mounted for responsive, cushioned typing",
      "Hot-swappable 5-pin PCB with south-facing LEDs",
      "PBT double-shot keycaps in slate grey theme"
    ],
    specifications: {
      "Weight": "1.4 kg",
      "Layout": "ANSI (US) 75%",
      "Connectivity": "USB-C, Bluetooth 5.1, 2.4G Wireless",
      "Switches": "Aether Linear (45g actuation)",
      "Battery Life": "Up to 200 hours (LEDs off)"
    },
    colors: ["Slate Grey", "Onyx Black", "Sand Beige"]
  },
  {
    id: "prod-2",
    name: "Nordic Felt Desk Mat",
    description: "Made from premium double-layered Merino wool felt, this desk mat offers exceptional texture and mouse tracking, while protecting your tabletop and dampening noise from keystrokes.",
    price: 49,
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=1000",
    category: "Workspace",
    rating: 4.7,
    ratingCount: 312,
    stock: 45,
    features: [
      "100% natural, biodegradable Merino wool felt",
      "Non-slip cork backing prevents desk movement",
      "Laser-cut precision edges resist fraying",
      "Spill-resistant coating for easy cleaning"
    ],
    specifications: {
      "Dimensions": "900mm x 300mm x 4mm",
      "Material": "Merino Wool Felt & Natural Cork",
      "Origin": "Designed in Copenhagen",
      "Care": "Spot clean with damp cloth"
    },
    colors: ["Sand Beige", "Charcoal Slate", "Sage Green"]
  },
  {
    id: "prod-3",
    name: "Hemi Noise-Canceling Headphones",
    description: "Immersive wireless audio engineered with hybrid active noise cancellation and custom-tuned 40mm beryllium drivers. Beautifully contoured matte finish over a flexible carbon-fiber head band.",
    price: 349,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    category: "Audio",
    rating: 4.8,
    ratingCount: 198,
    stock: 8,
    features: [
      "Hybrid ANC with 4 adaptive ambient microphones",
      "Beryllium-coated drivers for ultra-low distortion",
      "Memory foam cups wrapped in ultra-soft vegan leather",
      "Multi-point Bluetooth pairing"
    ],
    specifications: {
      "Weight": "250g",
      "Driver Size": "40mm Beryllium",
      "Frequency Response": "10Hz - 40kHz",
      "Battery Life": "40 hours with ANC active",
      "Charging": "USB-C Fast Charge (5 mins = 4 hrs)"
    },
    colors: ["Onyx Black", "Alpine White", "Chalk Bronze"]
  },
  {
    id: "prod-4",
    name: "Stria Ceramic Coffee Dripper",
    description: "Handcrafted speckled clay pour-over cone. Featuring unique internal spiral ridges optimized for steady flow rate control, maximizing extraction clarity and body in every brew.",
    price: 38,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000",
    category: "Lifestyle",
    rating: 4.9,
    ratingCount: 86,
    stock: 22,
    features: [
      "High-fire stoneware ceramic retain heat perfectly",
      "Spiral interior channels control extraction speed",
      "Comfortable wide-grip handle design",
      "Fits standard size 02 conical filters"
    ],
    specifications: {
      "Material": "Speckled Stoneware",
      "Capacity": "1 - 4 Cups",
      "Dishwasher Safe": "Yes",
      "Thermal Resistance": "Up to 220°C"
    },
    colors: ["Speckled Clay", "Matte Alabaster", "Terrazzo Grey"]
  },
  {
    id: "prod-5",
    name: "Lumen Ambient Desk Lamp",
    description: "An elegant, minimalist cylindrical smart lamp constructed from sandblasted anodized aluminum. Emits high-CRI diffused light with step-less temperature and brightness adjustments.",
    price: 119,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=1000",
    category: "Workspace",
    rating: 4.6,
    ratingCount: 147,
    stock: 19,
    features: [
      "Sandblasted aircraft-grade aluminum alloy housing",
      "Flicker-free high-CRI LEDs mimic natural daylight",
      "Capacitive touch top panel for intuitive control",
      "Integrates with major smart home platforms"
    ],
    specifications: {
      "Dimensions": "320mm Height x 80mm Diameter",
      "Brightness": "Up to 800 Lumens",
      "Color Temp": "2200K (Warm candle) - 6500K (Daylight)",
      "Power": "12W USB-C input",
      "CRI Rating": "Ra > 95"
    },
    colors: ["Anodized Silver", "Matte Carbon", "Brass Gold"]
  },
  {
    id: "prod-6",
    name: "Vessel Commuter Backpack",
    description: "A sleek, water-resistant roll-top backpack designed for modern commuters. Combines a structured aesthetic with highly organized interior storage and an independent suspended laptop compartment.",
    price: 145,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000",
    category: "Lifestyle",
    rating: 4.7,
    ratingCount: 235,
    stock: 15,
    features: [
      "Waterproof 840D ballistic nylon shell",
      "Suspended 16-inch protective laptop pocket",
      "Ergonomic molded EVA back panel with luggage pass-through",
      "Magnetic quick-access front storage pocket"
    ],
    specifications: {
      "Capacity": "22 Liters (expandable to 26L)",
      "Weight": "0.95 kg",
      "Laptop Fit": "Up to 16-inch MacBook Pro",
      "Waterproofing": "IPX4 water-resistant shell and zippers"
    },
    colors: ["Charcoal Black", "Sage Olive", "Alpine Navy"]
  },
  {
    id: "prod-7",
    name: "Mono Steel Wall Chronometer",
    description: "A minimalist wall clock featuring a brushed stainless steel case, clean indices, and a completely silent sweeping movement. Adds architectural elegance to any modern living or work environment.",
    price: 75,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000",
    category: "Lifestyle",
    rating: 4.5,
    ratingCount: 78,
    stock: 30,
    features: [
      "Brushed stainless steel outer casing",
      "Silent, high-accuracy quartz sweep movement",
      "Tempered crystal glass cover protects indices",
      "Easy mounting recessed keyhole bracket"
    ],
    specifications: {
      "Diameter": "30 cm",
      "Thickness": "4.5 cm",
      "Power": "1x AA Battery (included)",
      "Movement Type": "Quartz Sweep (No Ticking)"
    },
    colors: ["Brushed Steel", "Pitch Black", "Champagne Gold"]
  }
];
