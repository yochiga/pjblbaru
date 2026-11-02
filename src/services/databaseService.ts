import { SavedProjectIdea, SavedStudentSession } from '../types/recommender';

export interface DatabaseStatus {
  status: 'online' | 'offline';
  serverType: string;
  ideasCount: number;
  sessionsCount: number;
  lastUpdated?: string;
}

// -------------------------------------------------------------
// CLIENT API UNTUK SERVER DATABASE GRATIS
// -------------------------------------------------------------

export async function checkServerDatabaseStatus(): Promise<DatabaseStatus> {
  try {
    const res = await fetch('/api/database/status');
    if (!res.ok) throw new Error('Status server tidak dapat diakses');
    const data = await res.json();
    return {
      status: 'online',
      serverType: data.serverType || 'Express Server DB (Free Tier)',
      ideasCount: data.ideasCount ?? 0,
      sessionsCount: data.sessionsCount ?? 0,
      lastUpdated: data.lastUpdated,
    };
  } catch (err) {
    console.warn('Server database offline, menggunakan penyimpanan lokal browser:', err);
    return {
      status: 'offline',
      serverType: 'Local Device Storage (Fallback)',
      ideasCount: 0,
      sessionsCount: 0,
    };
  }
}

// Ide Proyek Tersimpan
export async function fetchServerIdeas(): Promise<SavedProjectIdea[]> {
  try {
    const res = await fetch('/api/database/ideas');
    if (!res.ok) throw new Error('Gagal mengambil ide dari server');
    const data = await res.json();
    return data.ideas || [];
  } catch (err) {
    console.warn('Gagal memuat ide dari database server:', err);
    return [];
  }
}

export async function saveServerIdea(idea: SavedProjectIdea): Promise<boolean> {
  try {
    const res = await fetch('/api/database/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Gagal menyimpan ide ke database server, tetap tersimpan lokal:', err);
    return false;
  }
}

export async function deleteServerIdea(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/database/ideas/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Gagal menghapus ide dari database server:', err);
    return false;
  }
}

// Sesi Lembar Kerja / Jobsheet Tersimpan
export async function fetchServerSessions(): Promise<SavedStudentSession[]> {
  try {
    const res = await fetch('/api/database/sessions');
    if (!res.ok) throw new Error('Gagal mengambil sesi dari server');
    const data = await res.json();
    return data.sessions || [];
  } catch (err) {
    console.warn('Gagal memuat sesi dari database server:', err);
    return [];
  }
}

export async function saveServerSession(session: SavedStudentSession): Promise<boolean> {
  try {
    const res = await fetch('/api/database/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Gagal menyimpan sesi ke database server, tetap tersimpan lokal:', err);
    return false;
  }
}

export async function deleteServerSession(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/database/sessions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Gagal menghapus sesi dari database server:', err);
    return false;
  }
}
