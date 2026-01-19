import type { Prospect } from "./prospects.types";

export const prospectsService = {
  async list(): Promise<Prospect[]> {
    const { prospects } = await import("@/data/prospects");
    return prospects;
  },

  async getById(id: string): Promise<Prospect> {
    const { prospects } = await import("@/data/prospects");
    const p = prospects.find((x: any) => x.id === id);
    if (!p) throw new Error("Prospecto no encontrado");
    return p;
  },

  async create(payload: { name: string; email: string; company?: string; sector_id?: string; status?: Prospect['status'] }): Promise<Prospect> {
    const newP: Prospect = {
      id: `p-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      sector_id: payload.sector_id,
      status: payload.status ?? 'new',
      metadata: {},
      createdAt: new Date().toISOString(),
    };
    console.log('Crear prospecto (mock):', newP);
    return newP;
  },

  async update(id: string, payload: { name: string; email: string; company?: string; sector_id?: string; status: Prospect['status'] }): Promise<Prospect> {
    const existing = await this.getById(id);
    const updated: Prospect = {
      ...existing,
      name: payload.name,
      email: payload.email,
      company: payload.company,
      sector_id: payload.sector_id,
      status: payload.status,
    };
    console.log('Actualizar prospecto (mock):', updated);
    return updated;
  },
};