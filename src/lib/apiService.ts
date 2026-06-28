import { Filamento } from "../types";

const API_URL = "http://localhost:3000";

export const api = {
  async getFilamentos(): Promise<Filamento[]> {
    const response = await fetch(`${API_URL}/filamentos`);
    if (!response.ok) throw new Error("Erro ao buscar filamentos");
    return response.json();
  },

  // POST: Adiciona um novo filamento
  async addFilamento(data: Omit<Filamento, "id">): Promise<Filamento> {
    const response = await fetch(`${API_URL}/filamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar filamento");
    return response.json();
  },

  // DELETE: Remove um filamento
  async deleteFilamento(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/filamentos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar filamento");
  },
};
