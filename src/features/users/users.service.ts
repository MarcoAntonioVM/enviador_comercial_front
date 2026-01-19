import type { User } from "./users.types";

// Simulamos un servicio para usuarios
export const usersService = {
  async list(): Promise<User[]> {
    const { users } = await import("@/data/users");
    return users;
  },

  async getById(id: string): Promise<User> {
    // Simularemos buscar en los datos mock por ahora
    const { users } = await import("@/data/users");
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    
    return user;
  },

  async create(payload: { name: string; email: string; role: "admin" | "user" | "viewer"; status?: "active" | "inactive" }): Promise<User> {
    // Simulamos la creación
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: payload.status || "active",
      createdAt: new Date().toISOString(),
    };

    // En un caso real, aquí haríamos un POST al API
    console.log("Creating user:", newUser);
    
    return newUser;
  },

  async update(id: string, payload: { name: string; email: string; role: "admin" | "user" | "viewer"; status?: "active" | "inactive" }): Promise<User> {
    // Simulamos la actualización
    const existingUser = await this.getById(id);
    
    const updatedUser: User = {
      ...existingUser,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: payload.status || existingUser.status,
    };

    // En un caso real, aquí haríamos un PUT/PATCH al API
    console.log("Updating user:", updatedUser);
    
    return updatedUser;
  },
};