import React, { useState } from "react";
import { Printer, Plus, Edit2, Trash2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("filamentos");

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

            {/* Tabs */}
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

        {/* Área de Conteúdo */}
        <div className="p-8">
          {/* ABA: FILAMENTOS */}
          {activeTab === "filamentos" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Filamentos em Estoque
                </h2>
                <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20">
                  <Plus size={18} /> Novo Filamento
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card PLA */}
                <div className="bg-[#2a364a] rounded-xl p-5 border border-slate-700/50 shadow-inner flex flex-col items-center relative group">
                  <div className="w-28 h-28 rounded-full bg-[#dc2626] mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] border-4 border-[#334155]"></div>
                  <div className="w-full flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">PLA</h3>
                      <p className="text-sm text-slate-400">Voolt3D</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 border border-indigo-500/30 text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full bg-[#1e293b] rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-[#10b981] h-full rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-[#10b981]">
                      650g <span className="text-slate-500">/ 1000g</span>
                    </p>
                  </div>
                </div>

                {/* Card ABS */}
                <div className="bg-[#2a364a] rounded-xl p-5 border border-slate-700/50 shadow-inner flex flex-col items-center relative group">
                  <div className="w-28 h-28 rounded-full bg-[#262626] mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 border-[#334155]"></div>
                  <div className="w-full flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">ABS</h3>
                      <p className="text-sm text-slate-400">Voolt3D</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 border border-indigo-500/30 text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full bg-[#1e293b] rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-[#ef4444] h-full rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-[#ef4444]">
                      200g <span className="text-slate-500">/ 1000g</span>
                    </p>
                  </div>
                </div>

                {/* Card PETG */}
                <div className="bg-[#2a364a] rounded-xl p-5 border border-slate-700/50 shadow-inner flex flex-col items-center relative group">
                  <div className="w-28 h-28 rounded-full bg-[#2563eb] mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] border-4 border-[#334155]"></div>
                  <div className="w-full flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">PETG</h3>
                      <p className="text-sm text-slate-400">Voolt3D</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 border border-indigo-500/30 text-indigo-400 rounded-md hover:bg-indigo-500/10 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full bg-[#1e293b] rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-[#10b981] h-full rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-[#10b981]">
                      920g <span className="text-slate-500">/ 1000g</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA: IMPRESSÕES */}
          {activeTab === "impressoes" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Histórico de Impressões
                </h2>
                <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-orange-500/20">
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-200">
                        Suporte de fone
                      </td>
                      <td className="px-6 py-4 text-slate-400">PLA Vermelho</td>
                      <td className="px-6 py-4 text-slate-400">45g</td>
                      <td className="px-6 py-4 text-slate-400">3.5h</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                          Concluída
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-200">
                        Vaso geométrico
                      </td>
                      <td className="px-6 py-4 text-slate-400">PETG Azul</td>
                      <td className="px-6 py-4 text-slate-400">120g</td>
                      <td className="px-6 py-4 text-slate-400">7h</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/50 text-yellow-400 bg-yellow-500/10">
                          Imprimindo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-200">Engrenagem</td>
                      <td className="px-6 py-4 text-slate-400">ABS Preto</td>
                      <td className="px-6 py-4 text-slate-400">15g</td>
                      <td className="px-6 py-4 text-slate-400">1.2h</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-slate-400/50 text-slate-300 bg-slate-400/10">
                          Na fila
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
