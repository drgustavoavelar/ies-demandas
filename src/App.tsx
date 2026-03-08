import { useState, useMemo } from "react";

// ── Constantes reais do IES ──────────────────────────────────────────────────
const RESPONSAVEIS = ["Dr. Gustavo", "Dra. Thaynara", "Thaynara Oliveira", "Vitória"];

const TIPOS = ["Exames", "Renovar Receitas", "Atestados", "Agendamentos", "Dúvidas", "Outros"];

const LOCAL_RESPOSTA = ["Botconversa", "Presencial", "Videochamada", "Outros"];

const STATUS_LIST = [
  "Aguardando anexar",
  "Pendência",
  "Em análise",
  "Anexado ao prontuário",
  "Agendado",
  "Anexados",
  "Finalizado",
];

const STATUS_STYLE = {
  "Aguardando anexar":      { dot: "bg-yellow-400",  badge: "bg-yellow-100 text-yellow-800",  col: "border-yellow-300" },
  "Pendência":              { dot: "bg-orange-400",  badge: "bg-orange-100 text-orange-800",  col: "border-orange-300" },
  "Em análise":             { dot: "bg-blue-400",    badge: "bg-blue-100 text-blue-800",      col: "border-blue-300" },
  "Anexado ao prontuário":  { dot: "bg-indigo-400",  badge: "bg-indigo-100 text-indigo-800",  col: "border-indigo-300" },
  "Agendado":               { dot: "bg-purple-400",  badge: "bg-purple-100 text-purple-800",  col: "border-purple-300" },
  "Anexados":               { dot: "bg-teal-400",    badge: "bg-teal-100 text-teal-800",      col: "border-teal-300" },
  "Finalizado":             { dot: "bg-green-400",   badge: "bg-green-100 text-green-800",    col: "border-green-300" },
};

const RESP_COLOR = {
  "Dr. Gustavo":        "bg-indigo-100 text-indigo-800",
  "Thaynara":           "bg-purple-100 text-purple-800",
  "Thay (Enfermagem)":  "bg-pink-100 text-pink-800",
  "Aliny (Secretária)": "bg-amber-100 text-amber-800",
};

const TIPO_ICON = {
  "Exames":          "🧪",
  "Renovar Receitas":"💊",
  "Atestados":       "📄",
  "Agendamentos":    "📅",
  "Dúvidas":         "❓",
  "Outros":          "📌",
};

// ── Dados iniciais (últimos registros reais) ─────────────────────────────────
const SEED = [
  { id:1,  data:"06/03/2026", paciente:"Amilton Moreira Damasceno Junior", tipo:"Exames",          localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Anexados",               obs:"" },
  { id:2,  data:"06/03/2026", paciente:"Daiana Cidrao Da Silva",           tipo:"Exames",          localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Anexados",               obs:"" },
  { id:3,  data:"03/03/2026", paciente:"Eliana Rodrigues",                 tipo:"Atestados",       localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Finalizado",             obs:"Paciente solicita atestado do período diurno" },
  { id:4,  data:"02/03/2026", paciente:"André Neves",                      tipo:"Renovar Receitas",localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Finalizado",             obs:"Paciente solicita prescrição de Tirzepatida para continuidade do tratamento" },
  { id:5,  data:"02/03/2026", paciente:"André Neves",                      tipo:"Exames",          localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Finalizado",             obs:"Anexado ao prontuário" },
  { id:6,  data:"02/03/2026", paciente:"Silvana Laureano",                 tipo:"Exames",          localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Finalizado",             obs:"Anexado ao prontuário" },
  { id:7,  data:"27/02/2026", paciente:"Maysa Regina Domingos De Sousa Morais", tipo:"Exames",     localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Anexado ao prontuário",  obs:"" },
  { id:8,  data:"25/02/2026", paciente:"ALESSANDRA MARTINS BORGES",        tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Anexados",               obs:"" },
  { id:9,  data:"23/02/2026", paciente:"Marina Fernandes E Silva",         tipo:"Renovar Receitas",localResposta:"Botconversa", responsavel:"Dr. Gustavo",        status:"Finalizado",             obs:"Paciente solicita prescrição de Mounjaro" },
  { id:10, data:"21/02/2026", paciente:"Marcelo Auad Paes Leme",           tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
  { id:11, data:"19/02/2026", paciente:"Laiza Andréia Carvalho Souza",     tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
  { id:12, data:"18/02/2026", paciente:"EVARISTO TRISTAO MOURA FILHO",     tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
  { id:13, data:"16/02/2026", paciente:"Kleiby Rocha Lourenço Gomes",      tipo:"Exames",          localResposta:"Videochamada",responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
  { id:14, data:"04/02/2026", paciente:"DANIEL FERNANDES DE OLIVEIRA LIMA",tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
  { id:15, data:"02/02/2026", paciente:"Susany Pereira de Oliveira",       tipo:"Exames",          localResposta:"Presencial",  responsavel:"Aliny (Secretária)", status:"Agendado",               obs:"" },
];

let nextId = 16;

// ── Helpers ──────────────────────────────────────────────────────────────────
const emAberto = (s) => !["Finalizado", "Agendado", "Anexados"].includes(s);

// ── Componente principal ─────────────────────────────────────────────────────
export default function App() {
  const [demandas, setDemandas]         = useState(SEED);
  const [view, setView]                 = useState("dashboard");
  const [filtroResp, setFiltroResp]     = useState("Todos");
  const [filtroTipo, setFiltroTipo]     = useState("Todos");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [busca, setBusca]               = useState("");
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(emptyForm());

  function emptyForm() {
    return { paciente:"", tipo:"Exames", localResposta:"Botconversa", responsavel:"Dr. Gustavo", status:"Pendência", data: new Date().toLocaleDateString("pt-BR"), obs:"" };
  }

  const salvar = () => {
    if (!form.paciente.trim()) return;
    if (editId !== null) {
      setDemandas(d => d.map(x => x.id === editId ? { ...form, id: editId } : x));
      setEditId(null);
    } else {
      setDemandas(d => [{ ...form, id: nextId++ }, ...d]);
    }
    setForm(emptyForm());
    setView("lista");
  };

  const deletar = (id) => setDemandas(d => d.filter(x => x.id !== id));
  const editar  = (dem) => { setForm({ ...dem }); setEditId(dem.id); setView("nova"); };
  const mudarStatus = (id, status) => setDemandas(d => d.map(x => x.id === id ? { ...x, status } : x));

  const filtradas = useMemo(() => demandas.filter(d => {
    const rOk = filtroResp   === "Todos" || d.responsavel  === filtroResp;
    const tOk = filtroTipo   === "Todos" || d.tipo         === filtroTipo;
    const sOk = filtroStatus === "Todos" || d.status       === filtroStatus;
    const bOk = busca === "" || d.paciente.toLowerCase().includes(busca.toLowerCase()) || d.obs.toLowerCase().includes(busca.toLowerCase());
    return rOk && tOk && sOk && bOk;
  }), [demandas, filtroResp, filtroTipo, filtroStatus, busca]);

  // Métricas dashboard
  const totalAberto    = demandas.filter(d => emAberto(d.status)).length;
  const porStatus      = STATUS_LIST.map(s => ({ s, n: demandas.filter(d => d.status === s).length }));
  const porResponsavel = RESPONSAVEIS.map(r => ({
    r,
    abertos:    demandas.filter(d => d.responsavel === r && emAberto(d.status)).length,
    finalizados:demandas.filter(d => d.responsavel === r && !emAberto(d.status)).length,
  }));
  const porTipo = TIPOS.map(t => ({ t, n: demandas.filter(d => d.tipo === t && emAberto(d.status)).length })).filter(x => x.n > 0);
  const recentes = demandas.filter(d => emAberto(d.status)).slice(0, 8);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"system-ui,sans-serif"}}>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Instituto Elo de Saúde</p>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Central de Demandas</h1>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {[["dashboard","📊 Resumo"],["kanban","🗂 Kanban"],["lista","📋 Lista"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view===v?"bg-indigo-600 text-white shadow":"text-gray-500 hover:bg-gray-100"}`}>
              {l}
            </button>
          ))}
          <button onClick={() => { setForm(emptyForm()); setEditId(null); setView("nova"); }}
            className="ml-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all">
            + Nova
          </button>
        </div>
      </div>

      <div className="px-4 py-5 max-w-6xl mx-auto">

        {/* ── DASHBOARD ────────────────────────────────────────────────────── */}
        {view === "dashboard" && (
          <div className="space-y-5">

            {/* Hero stat */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Demandas em aberto</p>
                <p className="text-5xl font-black text-indigo-600">{totalAberto}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Total registrado</p>
                <p className="text-2xl font-bold text-gray-700">{demandas.length}</p>
                <p className="text-xs text-gray-400 mt-1">Finalizados: {demandas.filter(d=>d.status==="Finalizado").length}</p>
              </div>
            </div>

            {/* Status pills */}
            <div className="grid grid-cols-4 gap-3">
              {porStatus.filter(x=>x.n>0).map(({s,n}) => (
                <div key={s} className={`bg-white rounded-lg border-l-4 ${STATUS_STYLE[s].col} shadow-sm p-3 cursor-pointer hover:shadow-md transition-all`}
                  onClick={()=>{setFiltroStatus(s);setView("lista");}}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${STATUS_STYLE[s].dot}`}></span>
                    <span className="text-xs text-gray-500 font-medium leading-tight">{s}</span>
                  </div>
                  <span className="text-2xl font-black text-gray-800">{n}</span>
                </div>
              ))}
            </div>

            {/* Por responsável */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Por responsável — em aberto</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {porResponsavel.map(({r,abertos,finalizados}) => (
                  <div key={r} className="border border-gray-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                    onClick={()=>{setFiltroResp(r);setFiltroStatus("Todos");setView("lista");}}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RESP_COLOR[r]}`}>{r}</span>
                    <div className="mt-2 flex gap-3">
                      <div><span className="text-xl font-black text-orange-500">{abertos}</span><span className="text-xs text-gray-400 ml-1">abertos</span></div>
                      <div><span className="text-xl font-black text-green-500">{finalizados}</span><span className="text-xs text-gray-400 ml-1">concl.</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Por tipo em aberto */}
            {porTipo.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tipos em aberto</p>
                <div className="flex flex-wrap gap-2">
                  {porTipo.map(({t,n})=>(
                    <button key={t} onClick={()=>{setFiltroTipo(t);setFiltroStatus("Todos");setView("lista");}}
                      className="flex items-center gap-1.5 bg-gray-50 hover:bg-indigo-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm transition-all">
                      <span>{TIPO_ICON[t]}</span>
                      <span className="font-medium text-gray-700">{t}</span>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-1.5 rounded-full">{n}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Demandas recentes em aberto */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recentes em aberto</p>
              {recentes.length === 0
                ? <p className="text-gray-300 text-sm text-center py-4">Nenhuma demanda em aberto 🎉</p>
                : <div className="space-y-2">
                  {recentes.map(d=>(
                    <div key={d.id} className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50 cursor-pointer transition-all" onClick={()=>editar(d)}>
                      <span className="text-lg">{TIPO_ICON[d.tipo]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{d.paciente}</p>
                        <div className="flex gap-1.5 mt-0.5 flex-wrap">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${RESP_COLOR[d.responsavel]}`}>{d.responsavel}</span>
                          <span className="text-xs text-gray-400 self-center">{d.localResposta}</span>
                          <span className="text-xs text-gray-400 self-center">· {d.data}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_STYLE[d.status]?.badge}`}>{d.status}</span>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        )}

        {/* ── KANBAN ───────────────────────────────────────────────────────── */}
        {view === "kanban" && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {STATUS_LIST.map(s => {
                const cards = demandas.filter(d => d.status === s);
                return (
                  <div key={s} className="w-56 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLE[s].dot}`}></span>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide leading-tight">{s}</span>
                      <span className="ml-auto text-xs font-black text-gray-400">{cards.length}</span>
                    </div>
                    <div className="space-y-2">
                      {cards.map(d=>(
                        <div key={d.id} className="border border-gray-100 rounded-lg p-2.5 hover:shadow-md cursor-pointer transition-all bg-gray-50" onClick={()=>editar(d)}>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs">{TIPO_ICON[d.tipo]}</span>
                            <span className="text-xs text-gray-400">{d.tipo}</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-800 leading-snug mb-1.5">{d.paciente}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${RESP_COLOR[d.responsavel]}`}>{d.responsavel}</span>
                          {d.obs && <p className="text-xs text-gray-400 mt-1 line-clamp-2 italic">{d.obs}</p>}
                        </div>
                      ))}
                      {cards.length===0 && <p className="text-xs text-gray-200 text-center py-3">Vazio</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LISTA ────────────────────────────────────────────────────────── */}
        {view === "lista" && (
          <div className="space-y-3">
            {/* Filtros */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-wrap gap-2 items-center">
              <input value={busca} onChange={e=>setBusca(e.target.value)}
                placeholder="🔍 Buscar paciente ou observação..."
                className="flex-1 min-w-40 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              <select value={filtroResp} onChange={e=>setFiltroResp(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
                <option value="Todos">Todos responsáveis</option>
                {RESPONSAVEIS.map(r=><option key={r}>{r}</option>)}
              </select>
              <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
                <option value="Todos">Todos os tipos</option>
                {TIPOS.map(t=><option key={t}>{t}</option>)}
              </select>
              <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
                <option value="Todos">Qualquer status</option>
                {STATUS_LIST.map(s=><option key={s}>{s}</option>)}
              </select>
              {(filtroResp!=="Todos"||filtroTipo!=="Todos"||filtroStatus!=="Todos"||busca) &&
                <button onClick={()=>{setFiltroResp("Todos");setFiltroTipo("Todos");setFiltroStatus("Todos");setBusca("");}}
                  className="text-xs text-red-400 hover:underline">Limpar</button>}
              <span className="ml-auto text-xs text-gray-400 font-medium">{filtradas.length} registro(s)</span>
            </div>

            {filtradas.length===0
              ? <p className="text-center text-gray-300 py-10">Nenhuma demanda encontrada.</p>
              : filtradas.map(d=>(
                <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap gap-2 items-start hover:shadow-md transition-all">
                  <span className="text-xl mt-0.5">{TIPO_ICON[d.tipo]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{d.paciente}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${RESP_COLOR[d.responsavel]}`}>{d.responsavel}</span>
                      <span className="text-xs text-gray-400">· {d.tipo}</span>
                      <span className="text-xs text-gray-400">· {d.localResposta}</span>
                      <span className="text-xs text-gray-400">· {d.data}</span>
                    </div>
                    {d.obs && <p className="text-xs text-gray-500 mt-1 italic leading-snug">{d.obs}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select value={d.status} onChange={e=>mudarStatus(d.id,e.target.value)}
                      className={`text-xs border-0 rounded-full px-2 py-1 font-semibold cursor-pointer ${STATUS_STYLE[d.status]?.badge}`}>
                      {STATUS_LIST.map(s=><option key={s}>{s}</option>)}
                    </select>
                    <button onClick={()=>editar(d)} className="text-xs text-indigo-500 hover:underline">Editar</button>
                    <button onClick={()=>deletar(d.id)} className="text-xs text-red-400 hover:underline">✕</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── NOVA / EDITAR ─────────────────────────────────────────────────── */}
        {view === "nova" && (
          <div className="max-w-lg mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800">{editId ? "✏️ Editar demanda" : "➕ Nova demanda"}</h2>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Paciente *</label>
              <input value={form.paciente} onChange={e=>setForm(f=>({...f,paciente:e.target.value}))}
                placeholder="Nome do paciente..."
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                <select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                  {TIPOS.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Responsável</label>
                <select value={form.responsavel} onChange={e=>setForm(f=>({...f,responsavel:e.target.value}))}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                  {RESPONSAVEIS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Local de Resposta</label>
                <select value={form.localResposta} onChange={e=>setForm(f=>({...f,localResposta:e.target.value}))}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                  {LOCAL_RESPOSTA.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                  {STATUS_LIST.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Data</label>
              <input value={form.data} onChange={e=>setForm(f=>({...f,data:e.target.value}))}
                placeholder="dd/mm/aaaa"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Observações</label>
              <textarea value={form.obs} onChange={e=>setForm(f=>({...f,obs:e.target.value}))}
                rows={3} placeholder="Detalhe da solicitação..."
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={salvar}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 text-sm font-bold transition-all">
                {editId ? "Salvar alterações" : "Criar demanda"}
              </button>
              <button onClick={()=>{setForm(emptyForm());setEditId(null);setView("lista");}}
                className="px-4 border border-gray-200 rounded-lg py-2 text-sm text-gray-500 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
