import { Filamento, Impressao } from "../types";

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

  // PUT: Atualiza um filamento existente
  async updateFilamento(
    id: string,
    data: Omit<Filamento, "id">,
  ): Promise<Filamento> {
    const response = await fetch(`${API_URL}/filamentos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar filamento");
    return response.json();
  },

  // DELETE: Remove um filamento
  async deleteFilamento(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/filamentos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar filamento");
  },

  // GET: Lista todas as impressões (já com filamento vinculado)
  async getImpressoes(): Promise<Impressao[]> {
    const response = await fetch(`${API_URL}/impressoes`);
    if (!response.ok) throw new Error("Erro ao buscar impressões");
    return response.json();
  },

  // POST: Cria uma nova impressão e subtrai o peso do filamento
  async addImpressao(
    data: Omit<Impressao, "id" | "filament">,
  ): Promise<Impressao> {
    const response = await fetch(`${API_URL}/impressoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw new Error(erro.error || "Erro ao criar impressão");
    }
    return response.json();
  },

  // PUT: Atualiza uma impressão e reconcilia o peso dos filamentos envolvidos
  async updateImpressao(
    id: string,
    data: Omit<Impressao, "id" | "filament">,
  ): Promise<Impressao> {
    const response = await fetch(`${API_URL}/impressoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw new Error(erro.error || "Erro ao atualizar impressão");
    }
    return response.json();
  },

  // DELETE: Remove uma impressão e devolve o peso ao filamento
  async deleteImpressao(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/impressoes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar impressão");
  },
};
