import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Types matching the database tables
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  created_at: Date;
}

export interface Quotation {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  product_type: 'WINDOW' | 'DOOR';
  product_style: string;
  width: number;
  height: number;
  quantity: number;
  glass_type: string;
  frame_color: string;
  hardware_quality: string;
  product_cost: number;
  installation_cost: number;
  gst: number;
  total_estimate: number;
  status: 'NEW' | 'CONTACTED' | 'SENT' | 'CLOSED';
  created_at: Date;
}

export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
}

const JSON_DB_DIR = path.join(__dirname, '../../database');
const JSON_DB_PATH = path.join(JSON_DB_DIR, 'db.json');

// Memory storage for JSON DB fallback
interface JsonDbSchema {
  admin_users: AdminUser[];
  inquiries: Inquiry[];
  quotations: Quotation[];
  system_config: SystemConfig[];
}

let pgPool: Pool | null = null;
let useJsonDb = true;
let jsonDbData: JsonDbSchema = {
  admin_users: [],
  inquiries: [],
  quotations: [],
  system_config: []
};

// Initialize DB Connections & Seeding
export async function initializeDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl) {
    try {
      console.log('Connecting to PostgreSQL database...');
      pgPool = new Pool({ connectionString: dbUrl });
      
      // Test the connection
      const client = await pgPool.connect();
      client.release();
      useJsonDb = false;
      console.log('Successfully connected to PostgreSQL.');
      
      // Ensure tables exist
      await createPgTables();
      await seedPgDatabase();
      return;
    } catch (err) {
      console.error('Failed to connect to PostgreSQL. Falling back to local JSON database.', err);
    }
  } else {
    console.log('No DATABASE_URL found. Using local JSON database fallback.');
  }
  
  // Initialize JSON database fallback
  useJsonDb = true;
  ensureJsonDbExists();
}

// Ensure the local database directory and file exist
function ensureJsonDbExists() {
  if (!fs.existsSync(JSON_DB_DIR)) {
    fs.mkdirSync(JSON_DB_DIR, { recursive: true });
  }
  
  if (fs.existsSync(JSON_DB_PATH)) {
    try {
      const content = fs.readFileSync(JSON_DB_PATH, 'utf8');
      jsonDbData = JSON.parse(content);
      // Ensure arrays are present
      jsonDbData.admin_users = jsonDbData.admin_users || [];
      jsonDbData.inquiries = jsonDbData.inquiries || [];
      jsonDbData.quotations = jsonDbData.quotations || [];
      jsonDbData.system_config = jsonDbData.system_config || [];
    } catch (err) {
      console.error('Error reading JSON DB file, initializing empty.', err);
      writeJsonDb();
    }
  } else {
    // Seed default configuration for JSON DB
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('AdminPass123', salt);
    
    jsonDbData = {
      admin_users: [
        {
          id: 1,
          username: 'admin',
          password_hash: defaultPasswordHash,
          created_at: new Date()
        }
      ],
      inquiries: [
        {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+919876543210',
          message: 'Looking for 3 double glazed sliding windows for my villa project in Chennai.',
          status: 'NEW',
          created_at: new Date(Date.now() - 86400000)
        },
        {
          id: 2,
          name: 'Meena Sundaram',
          email: 'meena.s@example.com',
          phone: '+919876543222',
          message: 'Interested in French doors in custom brown frame for balcony.',
          status: 'CONTACTED',
          created_at: new Date(Date.now() - 172800000)
        }
      ],
      quotations: [
        {
          id: 1,
          name: 'Anand Loganathan',
          email: 'anand.l@example.com',
          phone: '+919444012345',
          address: '12, Gandhi Street, Adyar',
          city: 'Chennai',
          product_type: 'WINDOW',
          product_style: 'Sliding',
          width: 1500,
          height: 1200,
          quantity: 2,
          glass_type: 'Double Glazed',
          frame_color: 'White',
          hardware_quality: 'Premium',
          product_cost: 32000,
          installation_cost: 3500,
          gst: 6390,
          total_estimate: 41890,
          status: 'NEW',
          created_at: new Date(Date.now() - 43200000)
        }
      ],
      system_config: getDefaultConfigs()
    };
    writeJsonDb();
    console.log('Local JSON database created and seeded with defaults.');
  }
}

function writeJsonDb() {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(jsonDbData, null, 2), 'utf8');
}

function getDefaultConfigs(): SystemConfig[] {
  return [
    { key: 'window_sliding_base_rate', value: '7500', description: 'Base rate per sqm for sliding windows (INR)' },
    { key: 'window_casement_base_rate', value: '8500', description: 'Base rate per sqm for casement windows (INR)' },
    { key: 'window_fixed_base_rate', value: '6000', description: 'Base rate per sqm for fixed windows (INR)' },
    { key: 'window_tilt_turn_base_rate', value: '9500', description: 'Base rate per sqm for tilt & turn windows (INR)' },
    { key: 'window_bay_base_rate', value: '11000', description: 'Base rate per sqm for bay windows (INR)' },
    
    { key: 'door_sliding_base_rate', value: '10000', description: 'Base rate per sqm for sliding doors (INR)' },
    { key: 'door_french_base_rate', value: '12000', description: 'Base rate per sqm for French doors (INR)' },
    { key: 'door_casement_base_rate', value: '11000', description: 'Base rate per sqm for casement doors (INR)' },
    { key: 'door_balcony_base_rate', value: '10500', description: 'Base rate per sqm for balcony doors (INR)' },
    { key: 'door_entrance_base_rate', value: '14000', description: 'Base rate per sqm for entrance doors (INR)' },
    
    { key: 'glass_clear_multiplier', value: '1.0', description: 'Multiplier for clear glass' },
    { key: 'glass_toughened_multiplier', value: '1.25', description: 'Multiplier for toughened glass' },
    { key: 'glass_double_glazed_multiplier', value: '1.5', description: 'Multiplier for double glazed glass' },
    
    { key: 'color_white_multiplier', value: '1.0', description: 'Multiplier for white frames' },
    { key: 'color_black_multiplier', value: '1.15', description: 'Multiplier for black frames' },
    { key: 'color_brown_multiplier', value: '1.15', description: 'Multiplier for brown frames' },
    { key: 'color_custom_multiplier', value: '1.25', description: 'Multiplier for custom laminated colors' },
    
    { key: 'hardware_standard_multiplier', value: '1.0', description: 'Multiplier for standard hardware' },
    { key: 'hardware_premium_multiplier', value: '1.3', description: 'Multiplier for premium hardware' },
    
    { key: 'installation_base_rate', value: '800', description: 'Installation base rate per square meter (INR)' },
    { key: 'gst_rate_percent', value: '18', description: 'GST percentage rate' }
  ];
}

// PostgreSQL Table Creation SQL
async function createPgTables() {
  if (!pgPool) return;
  const client = await pgPool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS quotations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        product_type VARCHAR(20) NOT NULL,
        product_style VARCHAR(50) NOT NULL,
        width INT NOT NULL,
        height INT NOT NULL,
        quantity INT NOT NULL,
        glass_type VARCHAR(50) NOT NULL,
        frame_color VARCHAR(50) NOT NULL,
        hardware_quality VARCHAR(50) NOT NULL,
        product_cost DECIMAL(12, 2) NOT NULL,
        installation_cost DECIMAL(12, 2) NOT NULL,
        gst DECIMAL(12, 2) NOT NULL,
        total_estimate DECIMAL(12, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS system_config (
        key VARCHAR(100) PRIMARY KEY,
        value VARCHAR(255) NOT NULL,
        description VARCHAR(255)
      );
    `);
  } finally {
    client.release();
  }
}

// PostgreSQL Seeding
async function seedPgDatabase() {
  if (!pgPool) return;
  const client = await pgPool.connect();
  try {
    // Check if admin user exists
    const adminRes = await client.query('SELECT 1 FROM admin_users LIMIT 1');
    if (adminRes.rowCount === 0) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('AdminPass123', salt);
      await client.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', passwordHash]);
      console.log('Seeded PostgreSQL admin user.');
    }
    
    // Seed configurations
    const configs = getDefaultConfigs();
    for (const conf of configs) {
      await client.query(
        'INSERT INTO system_config (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
        [conf.key, conf.value, conf.description || '']
      );
    }
    console.log('Seeded PostgreSQL pricing configs.');
  } finally {
    client.release();
  }
}

// --- REPOSITORY IMPLEMENTATIONS ---

// 1. Admin Repository
export const AdminRepository = {
  async findByUsername(username: string): Promise<AdminUser | null> {
    if (useJsonDb) {
      const user = jsonDbData.admin_users.find(u => u.username === username);
      return user || null;
    } else {
      const res = await pgPool!.query('SELECT * FROM admin_users WHERE username = $1', [username]);
      return res.rows[0] || null;
    }
  },
  
  async create(username: string, passwordHash: string): Promise<AdminUser> {
    if (useJsonDb) {
      const newUser: AdminUser = {
        id: jsonDbData.admin_users.length ? Math.max(...jsonDbData.admin_users.map(u => u.id)) + 1 : 1,
        username,
        password_hash: passwordHash,
        created_at: new Date()
      };
      jsonDbData.admin_users.push(newUser);
      writeJsonDb();
      return newUser;
    } else {
      const res = await pgPool!.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING *',
        [username, passwordHash]
      );
      return res.rows[0];
    }
  }
};

// 2. Inquiries Repository
export const InquiriesRepository = {
  async findAll(): Promise<Inquiry[]> {
    if (useJsonDb) {
      return [...jsonDbData.inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      const res = await pgPool!.query('SELECT * FROM inquiries ORDER BY created_at DESC');
      return res.rows;
    }
  },
  
  async create(data: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<Inquiry> {
    if (useJsonDb) {
      const newInquiry: Inquiry = {
        id: jsonDbData.inquiries.length ? Math.max(...jsonDbData.inquiries.map(i => i.id)) + 1 : 1,
        ...data,
        status: 'NEW',
        created_at: new Date()
      };
      jsonDbData.inquiries.push(newInquiry);
      writeJsonDb();
      return newInquiry;
    } else {
      const res = await pgPool!.query(
        'INSERT INTO inquiries (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.name, data.email, data.phone, data.message]
      );
      return res.rows[0];
    }
  },
  
  async updateStatus(id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED'): Promise<Inquiry | null> {
    if (useJsonDb) {
      const idx = jsonDbData.inquiries.findIndex(i => i.id === id);
      if (idx === -1) return null;
      jsonDbData.inquiries[idx].status = status;
      writeJsonDb();
      return jsonDbData.inquiries[idx];
    } else {
      const res = await pgPool!.query(
        'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0] || null;
    }
  },
  
  async delete(id: number): Promise<boolean> {
    if (useJsonDb) {
      const lengthBefore = jsonDbData.inquiries.length;
      jsonDbData.inquiries = jsonDbData.inquiries.filter(i => i.id !== id);
      writeJsonDb();
      return jsonDbData.inquiries.length < lengthBefore;
    } else {
      const res = await pgPool!.query('DELETE FROM inquiries WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    }
  }
};

// 3. Quotations Repository
export const QuotationsRepository = {
  async findAll(): Promise<Quotation[]> {
    if (useJsonDb) {
      return [...jsonDbData.quotations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      const res = await pgPool!.query('SELECT * FROM quotations ORDER BY created_at DESC');
      return res.rows;
    }
  },
  
  async create(data: Omit<Quotation, 'id' | 'status' | 'created_at'>): Promise<Quotation> {
    if (useJsonDb) {
      const newQuote: Quotation = {
        id: jsonDbData.quotations.length ? Math.max(...jsonDbData.quotations.map(q => q.id)) + 1 : 1,
        ...data,
        status: 'NEW',
        created_at: new Date()
      };
      jsonDbData.quotations.push(newQuote);
      writeJsonDb();
      return newQuote;
    } else {
      const res = await pgPool!.query(
        `INSERT INTO quotations (
          name, email, phone, address, city, product_type, product_style, 
          width, height, quantity, glass_type, frame_color, hardware_quality, 
          product_cost, installation_cost, gst, total_estimate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [
          data.name, data.email, data.phone, data.address, data.city, data.product_type, data.product_style,
          data.width, data.height, data.quantity, data.glass_type, data.frame_color, data.hardware_quality,
          data.product_cost, data.installation_cost, data.gst, data.total_estimate
        ]
      );
      return res.rows[0];
    }
  },
  
  async updateStatus(id: number, status: 'NEW' | 'CONTACTED' | 'SENT' | 'CLOSED'): Promise<Quotation | null> {
    if (useJsonDb) {
      const idx = jsonDbData.quotations.findIndex(q => q.id === id);
      if (idx === -1) return null;
      jsonDbData.quotations[idx].status = status;
      writeJsonDb();
      return jsonDbData.quotations[idx];
    } else {
      const res = await pgPool!.query(
        'UPDATE quotations SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      return res.rows[0] || null;
    }
  },
  
  async delete(id: number): Promise<boolean> {
    if (useJsonDb) {
      const lengthBefore = jsonDbData.quotations.length;
      jsonDbData.quotations = jsonDbData.quotations.filter(q => q.id !== id);
      writeJsonDb();
      return jsonDbData.quotations.length < lengthBefore;
    } else {
      const res = await pgPool!.query('DELETE FROM quotations WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    }
  }
};

// 4. Config Repository
export const ConfigRepository = {
  async getAll(): Promise<SystemConfig[]> {
    if (useJsonDb) {
      return jsonDbData.system_config;
    } else {
      const res = await pgPool!.query('SELECT * FROM system_config');
      return res.rows;
    }
  },
  
  async get(key: string, defaultValue: string): Promise<string> {
    if (useJsonDb) {
      const item = jsonDbData.system_config.find(c => c.key === key);
      return item ? item.value : defaultValue;
    } else {
      const res = await pgPool!.query('SELECT value FROM system_config WHERE key = $1', [key]);
      return res.rows[0] ? res.rows[0].value : defaultValue;
    }
  },
  
  async set(key: string, value: string): Promise<boolean> {
    if (useJsonDb) {
      const item = jsonDbData.system_config.find(c => c.key === key);
      if (item) {
        item.value = value;
      } else {
        jsonDbData.system_config.push({ key, value });
      }
      writeJsonDb();
      return true;
    } else {
      await pgPool!.query(
        'INSERT INTO system_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
        [key, value]
      );
      return true;
    }
  }
};
