import { Request, Response } from 'express';
import { ConfigRepository } from '../config/db';

export async function getConfigs(req: Request, res: Response) {
  try {
    const configs = await ConfigRepository.getAll();
    // Convert array to a clean key-value object
    const configObj: { [key: string]: string } = {};
    configs.forEach(c => {
      configObj[c.key] = c.value;
    });
    return res.json(configObj);
  } catch (err) {
    console.error('Error fetching system configurations:', err);
    return res.status(500).json({ message: 'Failed to fetch configurations.' });
  }
}

export async function updateConfig(req: Request, res: Response) {
  const settings = req.body; // Key-value object, e.g. { "installation_base_rate": "850" }

  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ message: 'Invalid payload structure. Object expected.' });
  }

  try {
    const promises = Object.keys(settings).map(key => {
      const val = String(settings[key]);
      return ConfigRepository.set(key, val);
    });

    await Promise.all(promises);
    return res.json({ success: true, message: 'Pricing configuration updated successfully.' });
  } catch (err) {
    console.error('Error updating pricing configurations:', err);
    return res.status(500).json({ message: 'Failed to update configurations.' });
  }
}
