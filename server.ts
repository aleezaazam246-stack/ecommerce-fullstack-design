import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// File-based JSON Database Engine
const DB_PATH = path.join(process.cwd(), "server-db.json");

// Bootstrapping Seed Data (matching types.ts & product specs perfectly)
const INITIAL_PRODUCTS = [
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

function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      products: INITIAL_PRODUCTS,
      orders: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch (err) {
    console.error("Failed to parse db.json, returning defaults", err);
    return { products: INITIAL_PRODUCTS, orders: [] };
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db.json", err);
  }
}

// Simple Admin Authenticate Middleware
const AUTH_TOKEN = "mock-admin-jwt-token-val";

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized. Admin privileges required." });
  }
  next();
}

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not set. AI Features will be disabled.");
}

// === AUTHENTICATION ENDPOINTS ===
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    return res.json({
      token: AUTH_TOKEN,
      user: {
        username: "admin",
        role: "admin"
      }
    });
  }
  return res.status(401).json({ error: "Invalid username or password credentials." });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${AUTH_TOKEN}`) {
    return res.json({ user: { username: "admin", role: "admin" } });
  }
  return res.status(401).json({ error: "Not logged in." });
});

// === RESTFUL PRODUCTS ENDPOINTS ===

// GET /api/products - Retrieve all products
app.get("/api/products", (req, res) => {
  const db = getDb();
  res.json(db.products);
});

// GET /api/products/:id - Retrieve a single product
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const product = db.products.find((p: any) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found with reference ID." });
  }
  res.json(product);
});

// POST /api/products - Create a new product (admin only)
app.post("/api/products", requireAdmin, (req, res) => {
  const db = getDb();
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.price || !newProduct.category) {
    return res.status(400).json({ error: "Name, price, and category are required parameters." });
  }

  // Create clean ID if missing
  const productWithId = {
    ...newProduct,
    id: newProduct.id || `prod-${Date.now()}`,
    rating: newProduct.rating || 5.0,
    ratingCount: newProduct.ratingCount || 1,
    features: newProduct.features || [],
    specifications: newProduct.specifications || {},
    colors: newProduct.colors || ["Slate Grey"],
    stock: typeof newProduct.stock === "number" ? newProduct.stock : 10
  };

  db.products.unshift(productWithId);
  saveDb(db);

  res.status(201).json(productWithId);
});

// PUT /api/products/:id - Update product specs / stock (admin only)
app.put("/api/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.products.findIndex((p: any) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found for updates." });
  }

  const updatedProduct = {
    ...db.products[index],
    ...req.body,
    id // lock original ID
  };

  db.products[index] = updatedProduct;
  saveDb(db);

  res.json(updatedProduct);
});

// DELETE /api/products/:id - Remove product listings (admin only)
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const filtered = db.products.filter((p: any) => p.id !== id);

  if (filtered.length === db.products.length) {
    return res.status(404).json({ error: "Product not found for deletion." });
  }

  db.products = filtered;
  saveDb(db);

  res.json({ success: true, message: "Product successfully deleted." });
});

// === ORDER SUBMISSION ENDPOINT ===
app.post("/api/orders", (req, res) => {
  const db = getDb();
  const newOrder = req.body;

  if (!newOrder.items || !newOrder.total || !newOrder.shippingAddress) {
    return res.status(400).json({ error: "Incomplete order specifications." });
  }

  // Persist order details
  const finalizedOrder = {
    ...newOrder,
    id: newOrder.id || `ord-${Date.now()}`,
    date: newOrder.date || new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    status: newOrder.status || "Processing"
  };

  // Adjust product stocks
  for (const item of finalizedOrder.items) {
    const prod = db.products.find((p: any) => p.id === item.product.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  db.orders.unshift(finalizedOrder);
  saveDb(db);

  res.status(201).json(finalizedOrder);
});

// GET /api/orders - Retrieve order records
app.get("/api/orders", (req, res) => {
  const db = getDb();
  res.json(db.orders);
});

// AI Shopping Concierge Proxy Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    if (!ai) {
      return res.json({
        text: "I'm sorry, but my AI core is currently offline because the `GEMINI_API_KEY` is not configured. Please add your key in the Settings > Secrets panel of AI Studio, and I'll be ready to assist you!"
      });
    }

    // Load actual database products dynamically for high-fidelity stylist coordination!
    const db = getDb();

    // Build model prompt containing our dynamically updated product catalog
    const systemInstruction = `You are Aura's Premium AI Shopping Concierge, a highly sophisticated, helpful, and eloquent personal stylist and product advisor.
You represent Aura—a boutique, minimalist, ultra-high-end e-commerce platform.

Here is the exact real-time product catalog available in our database. Rely ONLY on these real products:
${JSON.stringify(db.products, null, 2)}

Your goals:
1. Guide users to find the perfect products based on their style, workspace setup, audio preferences, or lifestyle goals.
2. Recommend products that actually exist in the store (the live list above). Always reference their exact price, colors, or key features.
3. Keep your tone polished, warm, sophisticated, professional, and slightly conversational.
4. When users ask about workspace design, productivity, coffee brewing, music, or travel, connect your answers to our curated catalog.
5. Do not write markdown titles or headings like '# Title' - keep paragraphs elegant and readable. Bold text using **bold** is fine.
6. Speak directly, and be concise.`;

    // Map history to model-acceptable contents format if history exists
    const chatContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        chatContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    // Append current message
    chatContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to formulate a response. Please try again.";
    res.json({ text: replyText });

  } catch (error: any) {
    console.error("Gemini API Error in /api/gemini/chat:", error);
    res.status(500).json({
      error: "Error generating response from Gemini API.",
      details: error.message
    });
  }
});

// App Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", aiEnabled: !!ai });
});

// Setup Vite Development Middleware or Serve Production Build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
