import fs from 'fs/promises';
import path from 'path';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  profession: string;
  bio: string;
  skills: string[];
  location: string;
  linkedin: string;
  github: string;
  avatarUrl: string;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');
const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

export async function getUsers(): Promise<User[]> {
  await ensureDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data).users || [];
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const users = await getUsers();
  
  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  await fs.writeFile(DB_PATH, JSON.stringify({ users }, null, 2));
  
  return newUser;
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>): Promise<User | null> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  await fs.writeFile(DB_PATH, JSON.stringify({ users }, null, 2));
  
  return users[index];
}

export async function setUserPassword(id: string, newPassword: string): Promise<boolean> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users[index].password = newPassword;
  await fs.writeFile(DB_PATH, JSON.stringify({ users }, null, 2));
  return true;
}
