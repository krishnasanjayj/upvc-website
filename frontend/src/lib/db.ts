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

// ---- PostgreSQL Connection Pool (singleton) ----
let pgPool: Pool | null = null;

function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pgPool) {
    const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    pgPool = new Pool({
      connectionString: dbUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pgPool;
}

// ---- In-Memory Fallback ----
interface InMemoryDb {
  admin_users: AdminUser[];
  inquiries: Inquiry[];
  quotations: Quotation[];
  system_config: SystemConfig[];
  initialized: boolean;
}

const memDb: InMemoryDb = {
  admin_users: [],
  inquiries: [],
  quotations: [],
  system_config: [],
  initialized: false,
};

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
    { key: 'gst_rate_percent', value: '18', description: 'GST percentage rate' },
  ];
}

function ensureMemDbInitialized() {
  if (memDb.initialized) return;

  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('AdminPass123', salt);

  memDb.admin_users = [
    { id: 1, username: 'admin', password_hash: defaultPasswordHash, created_at: new Date() },
  ];
  memDb.inquiries = [];
  memDb.quotations = [];
  memDb.system_config = getDefaultConfigs();
  memDb.initialized = true;
}

// ---- Initialize PostgreSQL Tables ----
let pgInitialized = false;

async function ensurePgTables(pool: Pool) {
  if (pgInitialized) return;

  const client = await pool.connect();
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

    // Seed admin user if missing
    const adminRes = await client.query('SELECT 1 FROM admin_users LIMIT 1');
    if (adminRes.rowCount === 0) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('AdminPass123', salt);
      await client.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', passwordHash]);
    }

    // Seed default configs
    const configs = getDefaultConfigs();
    for (const conf of configs) {
      await client.query(
        'INSERT INTO system_config (key, value, description) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
        [conf.key, conf.value, conf.description || '']
      );
    }

    pgInitialized = true;
  } finally {
    client.release();
  }
}

// ---- Helper: determine which DB mode to use ----
async function getDb(): Promise<{ pool: Pool } | { mem: true }> {
  const pool = getPool();
  if (pool) {
    try {
      await ensurePgTables(pool);
      return { pool };
    } catch (err) {
      console.error('Failed to initialize PostgreSQL connection, falling back to in-memory database:', err);
    }
  }
  ensureMemDbInitialized();
  return { mem: true };
}

// ============================================================
// REPOSITORIES
// ============================================================

// 1. Admin Repository
export const AdminRepository = {
  async findByUsername(username: string): Promise<AdminUser | null> {
    const db = await getDb();
    if ('mem' in db) {
      return memDb.admin_users.find((u) => u.username === username) || null;
    }
    const res = await db.pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    return res.rows[0] || null;
  },
};

// 2. Inquiries Repository
export const InquiriesRepository = {
  async findAll(): Promise<Inquiry[]> {
    const db = await getDb();
    if ('mem' in db) {
      return [...memDb.inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    const res = await db.pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    return res.rows;
  },

  async create(data: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<Inquiry> {
    const db = await getDb();
    if ('mem' in db) {
      const newInquiry: Inquiry = {
        id: memDb.inquiries.length ? Math.max(...memDb.inquiries.map((i) => i.id)) + 1 : 1,
        ...data,
        status: 'NEW',
        created_at: new Date(),
      };
      memDb.inquiries.push(newInquiry);
      return newInquiry;
    }
    const res = await db.pool.query(
      'INSERT INTO inquiries (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.name, data.email, data.phone, data.message]
    );
    return res.rows[0];
  },

  async updateStatus(id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED'): Promise<Inquiry | null> {
    const db = await getDb();
    if ('mem' in db) {
      const idx = memDb.inquiries.findIndex((i) => i.id === id);
      if (idx === -1) return null;
      memDb.inquiries[idx].status = status;
      return memDb.inquiries[idx];
    }
    const res = await db.pool.query('UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return res.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const db = await getDb();
    if ('mem' in db) {
      const lengthBefore = memDb.inquiries.length;
      memDb.inquiries = memDb.inquiries.filter((i) => i.id !== id);
      return memDb.inquiries.length < lengthBefore;
    }
    const res = await db.pool.query('DELETE FROM inquiries WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  },
};

// 3. Quotations Repository
export const QuotationsRepository = {
  async findAll(): Promise<Quotation[]> {
    const db = await getDb();
    if ('mem' in db) {
      return [...memDb.quotations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    const res = await db.pool.query('SELECT * FROM quotations ORDER BY created_at DESC');
    return res.rows;
  },

  async create(data: Omit<Quotation, 'id' | 'status' | 'created_at'>): Promise<Quotation> {
    const db = await getDb();
    if ('mem' in db) {
      const newQuote: Quotation = {
        id: memDb.quotations.length ? Math.max(...memDb.quotations.map((q) => q.id)) + 1 : 1,
        ...data,
        status: 'NEW',
        created_at: new Date(),
      };
      memDb.quotations.push(newQuote);
      return newQuote;
    }
    const res = await db.pool.query(
      `INSERT INTO quotations (
        name, email, phone, address, city, product_type, product_style,
        width, height, quantity, glass_type, frame_color, hardware_quality,
        product_cost, installation_cost, gst, total_estimate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        data.name, data.email, data.phone, data.address, data.city, data.product_type, data.product_style,
        data.width, data.height, data.quantity, data.glass_type, data.frame_color, data.hardware_quality,
        data.product_cost, data.installation_cost, data.gst, data.total_estimate,
      ]
    );
    return res.rows[0];
  },

  async updateStatus(id: number, status: 'NEW' | 'CONTACTED' | 'SENT' | 'CLOSED'): Promise<Quotation | null> {
    const db = await getDb();
    if ('mem' in db) {
      const idx = memDb.quotations.findIndex((q) => q.id === id);
      if (idx === -1) return null;
      memDb.quotations[idx].status = status;
      return memDb.quotations[idx];
    }
    const res = await db.pool.query('UPDATE quotations SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return res.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const db = await getDb();
    if ('mem' in db) {
      const lengthBefore = memDb.quotations.length;
      memDb.quotations = memDb.quotations.filter((q) => q.id !== id);
      return memDb.quotations.length < lengthBefore;
    }
    const res = await db.pool.query('DELETE FROM quotations WHERE id = $1', [id]);
    return (res.rowCount ?? 0) > 0;
  },
};

// 4. Config Repository
export const ConfigRepository = {
  async getAll(): Promise<SystemConfig[]> {
    const db = await getDb();
    if ('mem' in db) {
      return memDb.system_config;
    }
    const res = await db.pool.query('SELECT * FROM system_config');
    return res.rows;
  },

  async get(key: string, defaultValue: string): Promise<string> {
    const db = await getDb();
    if ('mem' in db) {
      const item = memDb.system_config.find((c) => c.key === key);
      return item ? item.value : defaultValue;
    }
    const res = await db.pool.query('SELECT value FROM system_config WHERE key = $1', [key]);
    return res.rows[0] ? res.rows[0].value : defaultValue;
  },

  async set(key: string, value: string): Promise<boolean> {
    const db = await getDb();
    if ('mem' in db) {
      const item = memDb.system_config.find((c) => c.key === key);
      if (item) {
        item.value = value;
      } else {
        memDb.system_config.push({ key, value });
      }
      return true;
    }
    await db.pool.query(
      'INSERT INTO system_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      [key, value]
    );
    return true;
  },
};
