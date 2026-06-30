import React, { useState, useEffect } from "react";

import { Printer, Plus, Edit2, Trash2 } from "lucide-react";

import { api } from "./lib/apiService";

import { Filamento, Impressao, StatusImpressao } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("filamentos");

  // Estados para integração com o Banco de Dados

  const [filamentos, setFilamentos] = useState<Filamento[]>([]);

  const [impressoes, setImpressoes] = useState<Impressao[]>([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    material: "PLA",

    brand: "Voolt3D",

    colorName: "Preto",

    colorHex: "#000000",

    currentWeight: 1000,

    totalWeight: 1000,
  });

  const [isImpressaoModalOpen, setIsImpressaoModalOpen] = useState(false);

  const [editingImpressaoId, setEditingImpressaoId] = useState<string | null>(
    null,
  );

  const [impressaoFormData, setImpressaoFormData] = useState<{
    partName: string;
    filamentId: string;
    weightGrams: number;
    timeHours: number;
    status: StatusImpressao;
  }>({
    partName: "",
    filamentId: "",
    weightGrams: 0,
    timeHours: 0,
    status: "QUEUED",
  });

  const carregarFilamentos = async () => {
    try {
      const dados = await api.getFilamentos();

      setFilamentos(dados);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarImpressoes = async () => {
    try {
      const dados = await api.getImpressoes();

      setImpressoes(dados);
    } catch (error) {
      console.error("Erro ao carregar impressões:", error);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      await Promise.all([carregarFilamentos(), carregarImpressoes()]);
    };

    inicializar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetarFormulario = () => {
    setEditingId(null);

    setFormData({
      material: "PLA",

      brand: "Voolt3D",

      colorName: "Preto",

      colorHex: "#000000",

      currentWeight: 1000,

      totalWeight: 1000,
    });
  };

  const fecharModal = () => {
    setIsModalOpen(false);

    resetarFormulario();
  };

  const handleEditar = (filamento: Filamento) => {
    setEditingId(filamento.id);

    setFormData({
      material: filamento.material,

      brand: filamento.brand,

      colorName: filamento.colorName,

      colorHex: filamento.colorHex,

      currentWeight: filamento.currentWeight,

      totalWeight: filamento.totalWeight,
    });

    setIsModalOpen(true);
  };

  const salvarFilamento = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.updateFilamento(editingId, formData);
      } else {
        await api.addFilamento(formData);
      }

      await carregarFilamentos();

      setIsModalOpen(false);

      resetarFormulario();
    } catch {
      alert(
        "Erro ao salvar! Verifique se a sua API (porta 3000) está ativa no terminal.",
      );
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este filamento do estoque?")) {
      try {
        await api.deleteFilamento(id);

        await carregarFilamentos();
      } catch {
        alert("Erro ao remover o filamento.");
      }
    }
  };

  const resetarImpressaoForm = () => {
    setEditingImpressaoId(null);
    setImpressaoFormData({
      partName: "",
      filamentId: filamentos[0]?.id ?? "",
      weightGrams: 0,
      timeHours: 0,
      status: "QUEUED",
    });
  };

  const abrirImpressaoModal = () => {
    if (filamentos.length === 0) {
      alert("Cadastre ao menos um filamento antes de criar uma impressão.");
      return;
    }
    resetarImpressaoForm();
    setIsImpressaoModalOpen(true);
  };

  const fecharImpressaoModal = () => {
    setIsImpressaoModalOpen(false);
    resetarImpressaoForm();
  };

  const handleDeletarImpressao = async (id: string) => {
    if (confirm("Tem certeza que deseja remover esta impressão?")) {
      try {
        await api.deleteImpressao(id);
        await Promise.all([carregarImpressoes(), carregarFilamentos()]);
      } catch {
        alert("Erro ao remover a impressão.");
      }
    }
  };

  const handleEditarImpressao = (imp: Impressao) => {
    setEditingImpressaoId(imp.id);
    setImpressaoFormData({
      partName: imp.partName,
      filamentId: imp.filamentId,
      weightGrams: imp.weightGrams,
      timeHours: imp.timeHours,
      status: imp.status,
    });
    setIsImpressaoModalOpen(true);
  };

  const salvarImpressao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!impressaoFormData.filamentId) {
      alert("Selecione um filamento.");
      return;
    }

    try {
      if (editingImpressaoId) {
        await api.updateImpressao(editingImpressaoId, impressaoFormData);
      } else {
        await api.addImpressao(impressaoFormData);
      }

      await Promise.all([carregarImpressoes(), carregarFilamentos()]);

      setIsImpressaoModalOpen(false);
      resetarImpressaoForm();
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro ao salvar impressão.";
      alert(mensagem);
    }
  };

  const statusLabel: Record<StatusImpressao, string> = {
    COMPLETED: "Concluída",
    PRINTING: "Imprimindo",
    QUEUED: "Na fila",
  };

  const statusBadgeClass: Record<StatusImpressao, string> = {
    COMPLETED: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
    PRINTING: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
    QUEUED: "border-slate-400/50 text-slate-300 bg-slate-400/10",
  };

  const formatarTempo = (horas: number) => {
    if (horas >= 1) return `${horas}h`;
    return `${Math.round(horas * 60)}min`;
  };

  const formatarFilamento = (f?: Filamento) => {
    if (!f) return "Filamento removido";
    return `${f.material} ${f.colorName}`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border border-slate-800 h-fit">
        <div className="px-6 pt-6 border-b border-slate-800">
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-3">
              <Printer className="text-indigo-500" size={24} />

              <h1 className="text-xl font-bold text-white tracking-wide">
                Print3D Manager
              </h1>
            </div>

            <div className="ml-10 flex gap-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("filamentos")}
                className={`pb-4 border-b-2 transition-colors relative top-[1px] ${
                  activeTab === "filamentos"
                    ? "border-indigo-500 text-slate-100"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                Filamentos
              </button>

              <button
                onClick={() => setActiveTab("impressoes")}
                className={`pb-4 border-b-2 transition-colors relative top-[1px] ${
                  activeTab === "impressoes"
                    ? "border-indigo-500 text-slate-100"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                Impressões
              </button>
            </div>
          </div>
        </div>

        {/* Área de Conteúdo principal */}

        <div className="p-8">
          {activeTab === "filamentos" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Filamentos em Estoque
                </h2>

                <button
                  onClick={() => {
                    resetarFormulario();
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 cursor-pointer

 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Plus size={18} /> Novo Filamento
                </button>
              </div>

              {loading ? (
                <div className="text-slate-400 text-center py-10">
                  Carregando estoque do banco de dados...
                </div>
              ) : filamentos.length === 0 ? (
                <div className="text-slate-400 text-center py-10">
                  Nenhum filamento cadastrado ainda. Clique em "Novo Filamento".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filamentos.map((f) => {
                    const porcentagem = Math.min(
                      (f.currentWeight / f.totalWeight) * 100,

                      100,
                    );

                    const isLow = porcentagem <= 20;

                    return (
                      <div
                        key={f.id}
                        className="bg-[#2a364a] rounded-xl p-5 border border-slate-700/50 shadow-inner flex flex-col items-center relative group"
                      >
                        <div
                          className="w-28 h-28 rounded-full mb-6 border-4 border-[#334155] transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: f.colorHex,

                            boxShadow: `0 0 30px ${f.colorHex}4d`,
                          }}
                        ></div>

                        <div className="w-full flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {f.material}
                            </h3>

                            <p className="text-sm text-slate-400">
                              {f.brand} - {f.colorName}
                            </p>
                          </div>

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditar(f)}
                              className="p-1.5 border border-indigo-500/30 text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              onClick={() => handleDeletar(f.id)}
                              className="p-1.5 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Barra de Consumo/Quantidade */}

                        <div className="w-full">
                          <div className="w-full bg-[#1e293b] rounded-full h-2 mb-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-[#ef4444]" : "bg-[#10b981]"}`}
                              style={{ width: `${porcentagem}%` }}
                            ></div>
                          </div>

                          <p
                            className={`text-sm font-medium ${isLow ? "text-[#ef4444]" : "text-[#10b981]"}`}
                          >
                            {f.currentWeight}g{" "}
                            <span className="text-slate-500">
                              / {f.totalWeight}g
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "impressoes" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Histórico de Impressões
                </h2>

                <button
                  onClick={abrirImpressaoModal}
                  className="flex items-center gap-2 cursor-pointer bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Plus size={18} /> Nova Impressão
                </button>
              </div>

              <div className="bg-[#2a364a] border border-slate-700/50 rounded-xl overflow-hidden shadow-inner">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#2a364a] border-b border-slate-700/50 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Peça</th>

                      <th className="px-6 py-4 font-medium">Filamento</th>

                      <th className="px-6 py-4 font-medium">Gramas</th>

                      <th className="px-6 py-4 font-medium">Tempo</th>

                      <th className="px-6 py-4 font-medium">Status</th>

                      <th className="px-6 py-4 font-medium text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/50">
                    {impressoes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-slate-400"
                        >
                          Nenhuma impressão cadastrada ainda. Clique em "Nova
                          Impressão".
                        </td>
                      </tr>
                    ) : (
                      impressoes.map((imp) => (
                        <tr
                          key={imp.id}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-slate-200">
                            {imp.partName}
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {formatarFilamento(imp.filament)}
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {imp.weightGrams}g
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {formatarTempo(imp.timeHours)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeClass[imp.status]}`}
                            >
                              {statusLabel[imp.status]}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditarImpressao(imp)}
                                className="p-1.5 border border-indigo-500/30 text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletarImpressao(imp.id)}
                                className="p-1.5 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingId ? "Editar Filamento" : "Cadastrar Novo Filamento"}
            </h3>

            <form onSubmit={salvarFilamento} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Material</label>

                  <select
                    required
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="PLA">PLA</option>

                    <option value="PETG">PETG</option>

                    <option value="ABS">ABS</option>

                    <option value="ASA">ASA</option>

                    <option value="TPU">TPU</option>

                    <option value="TPE">TPE</option>

                    <option value="Nylon">Nylon</option>

                    <option value="Outro">Outro...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Marca</label>

                  <input
                    required
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Nome da Cor
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.colorName}
                    onChange={(e) =>
                      setFormData({ ...formData, colorName: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Cor Visual
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.colorHex}
                      onChange={(e) =>
                        setFormData({ ...formData, colorHex: e.target.value })
                      }
                      className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                    />

                    <input
                      required
                      type="text"
                      value={formData.colorHex}
                      onChange={(e) =>
                        setFormData({ ...formData, colorHex: e.target.value })
                      }
                      className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Peso Atual (g)
                  </label>

                  <input
                    required
                    type="number"
                    value={formData.currentWeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        currentWeight: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Peso Total (g)
                  </label>

                  <input
                    required
                    type="number"
                    value={formData.totalWeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        totalWeight: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="px-4 py-2 rounded cursor-pointer text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-[#ea580c] cursor-pointer text-white px-4 py-2 rounded font-semibold transition-colors shadow-lg shadow-orange-500/20"
                >
                  {editingId ? "Salvar Alterações" : "Salvar Filamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImpressaoModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] p-6 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingImpressaoId ? "Editar Impressão" : "Nova Impressão"}
            </h3>

            <form onSubmit={salvarImpressao} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">
                  Nome da Peça
                </label>

                <input
                  required
                  type="text"
                  value={impressaoFormData.partName}
                  onChange={(e) =>
                    setImpressaoFormData({
                      ...impressaoFormData,
                      partName: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Filamento</label>

                <select
                  required
                  value={impressaoFormData.filamentId}
                  onChange={(e) =>
                    setImpressaoFormData({
                      ...impressaoFormData,
                      filamentId: e.target.value,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                >
                  <option value="" disabled>
                    Selecione um filamento...
                  </option>
                  {filamentos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.material} - {f.colorName} ({f.brand}) —{" "}
                      {f.currentWeight}g disponíveis
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Gramas Consumidas
                  </label>

                  <input
                    required
                    type="number"
                    min={0}
                    step="0.1"
                    value={impressaoFormData.weightGrams}
                    onChange={(e) =>
                      setImpressaoFormData({
                        ...impressaoFormData,
                        weightGrams: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Tempo (horas)
                  </label>

                  <input
                    required
                    type="number"
                    min={0}
                    step="0.1"
                    value={impressaoFormData.timeHours}
                    onChange={(e) =>
                      setImpressaoFormData({
                        ...impressaoFormData,
                        timeHours: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Status</label>

                <select
                  required
                  value={impressaoFormData.status}
                  onChange={(e) =>
                    setImpressaoFormData({
                      ...impressaoFormData,
                      status: e.target.value as StatusImpressao,
                    })
                  }
                  className="w-full bg-[#0f172a] border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                >
                  <option value="QUEUED">Na fila</option>
                  <option value="PRINTING">Imprimindo</option>
                  <option value="COMPLETED">Concluída</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={fecharImpressaoModal}
                  className="px-4 py-2 rounded cursor-pointer text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#f97316] hover:bg-[#ea580c] cursor-pointer text-white px-4 py-2 rounded font-semibold transition-colors shadow-lg shadow-orange-500/20"
                >
                  {editingImpressaoId
                    ? "Salvar Alterações"
                    : "Salvar Impressão"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
