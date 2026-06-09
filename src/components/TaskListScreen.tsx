import React, { useState, useMemo } from 'react';
import {
  CheckCircle, Settings, Trash2, Plus, Calendar, Pencil,
  X, ChevronUp, ChevronDown, SlidersHorizontal, Smile, AlertCircle
} from 'lucide-react';
import { Tarea, UserProfile } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterEstado    = 'todos' | 'pendientes' | 'completadas';
type FilterPrioridad = 'todas' | 'alta' | 'media' | 'baja';
type SortBy          = 'fecha' | 'prioridad' | 'fechaVencimiento' | 'updatedAt';
type SortDir         = 'asc' | 'desc';

interface Props {
  tareas: Tarea[];
  onAddTarea: (datos: Omit<Tarea, 'id' | 'fecha' | 'updatedAt'>) => void;
  onToggleTarea: (id: string) => void;
  onDeleteTarea: (id: string) => void;
  onUpdateTarea: (id: string, updates: Partial<Omit<Tarea, 'id' | 'fecha'>>) => void;
  onNavigateToSettings: () => void;
  userProfile: UserProfile;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRIORIDAD_WEIGHT: Record<string, number> = { alta: 3, media: 2, baja: 1 };

const PRIORIDAD_BADGE: Record<string, string> = {
  alta:  'bg-yellow-100 text-yellow-800 border border-yellow-200',
  media: 'bg-blue-100 text-blue-800 border border-blue-200',
  baja:  'bg-gray-100 text-gray-600 border border-gray-200',
};

const PRIORIDAD_ACCENT: Record<string, string> = {
  alta:  'bg-yellow-400',
  media: 'bg-blue-400',
  baja:  'bg-gray-300',
};

const PRIORIDAD_LABEL: Record<string, string> = {
  alta: '🟡 Alta',
  media: '🔵 Media',
  baja: '⬜ Baja',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

const todayISO = () => new Date().toISOString().slice(0, 10);

const isExpired = (iso: string) => new Date(iso) < new Date();

// ─── Shared style constants (from AGENTS.md) ──────────────────────────────────
const INPUT_CLS    = 'border-2 border-gray-300 rounded-md p-2 w-full bg-white text-gray-800 focus:border-primary focus:outline-none transition-colors text-sm';
const TEXTAREA_CLS = 'border-2 border-gray-300 rounded-md p-2 w-full bg-white text-gray-800 focus:border-primary focus:outline-none transition-colors text-sm resize-none';
const SELECT_CLS   = 'border-2 border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:border-primary focus:outline-none transition-colors cursor-pointer text-sm';
const BTN_CLS      = 'border-2 border-gray-300 rounded-md p-2 bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer text-sm font-medium';

// ─── Component ────────────────────────────────────────────────────────────────
export default function TaskListScreen({
  tareas,
  onAddTarea,
  onToggleTarea,
  onDeleteTarea,
  onUpdateTarea,
  onNavigateToSettings,
  userProfile,
}: Props) {

  // Form state
  const [showForm, setShowForm]               = useState(false);
  const [formTitulo, setFormTitulo]           = useState('');
  const [formDesc, setFormDesc]               = useState('');
  const [formPrioridad, setFormPrioridad]     = useState<'alta' | 'media' | 'baja'>('media');
  const [formVencimiento, setFormVencimiento] = useState('');
  const [formError, setFormError]             = useState('');

  // Filter & sort state
  const [filterEstado, setFilterEstado]       = useState<FilterEstado>('todos');
  const [filterPrioridad, setFilterPrioridad] = useState<FilterPrioridad>('todas');
  const [sortBy, setSortBy]                   = useState<SortBy>('fecha');
  const [sortDir, setSortDir]                 = useState<SortDir>('desc');

  // Edit modal state
  const [editTarea, setEditTarea]                 = useState<Tarea | null>(null);
  const [editTitulo, setEditTitulo]               = useState('');
  const [editDesc, setEditDesc]                   = useState('');
  const [editPrioridad, setEditPrioridad]         = useState<'alta' | 'media' | 'baja'>('media');
  const [editVencimiento, setEditVencimiento]     = useState('');
  const [editError, setEditError]                 = useState('');

  const defaultProfileUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4wfiyp2OkAWYsJUyOEGdUepqi89fL1TcLen7eBXWe68SGoUwuuV9VBHx6UPExhg1Lj4CNdYmbOmgOMBPNtK7QHYegTCVMlimFK46VhEyhq-B6QToh62c6jFvB60D0tM6KVIQ7z0l_biD6h1KIXUf0xbaCs2yDPsw0HmU0s1PuUuMpAWoZx1C2J89CB3ZCjHVowN2sBErWE7eIXlX4BRsNxGDd32RmC-Ma00EJlzI_Kx_GzPsqaoUKPl0ii4Ifw7IWYS0vfwJkvdw";

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!formTitulo.trim()) { setFormError('El título es obligatorio.'); return; }
    onAddTarea({
      titulo: formTitulo.trim(),
      descripcion: formDesc.trim(),
      prioridad: formPrioridad,
      fechaVencimiento: formVencimiento
        ? new Date(formVencimiento).toISOString()
        : new Date(Date.now() + 86400000 * 7).toISOString(),
      completada: false,
    });
    setFormTitulo(''); setFormDesc(''); setFormPrioridad('media');
    setFormVencimiento(''); setFormError(''); setShowForm(false);
  };

  const openEdit = (t: Tarea) => {
    setEditTarea(t);
    setEditTitulo(t.titulo);
    setEditDesc(t.descripcion);
    setEditPrioridad(t.prioridad);
    setEditVencimiento(t.fechaVencimiento.slice(0, 10));
    setEditError('');
  };

  const handleSaveEdit = () => {
    if (!editTarea) return;
    if (!editTitulo.trim()) { setEditError('El título es obligatorio.'); return; }
    onUpdateTarea(editTarea.id, {
      titulo: editTitulo.trim(),
      descripcion: editDesc.trim(),
      prioridad: editPrioridad,
      fechaVencimiento: editVencimiento
        ? new Date(editVencimiento).toISOString()
        : editTarea.fechaVencimiento,
    });
    setEditTarea(null);
  };

  const closeEdit = () => { setEditTarea(null); setEditError(''); };

  // ─── Derived list ────────────────────────────────────────────────────────────
  const tareasFiltradas = useMemo(() => {
    let list = [...tareas];
    if (filterEstado === 'pendientes')  list = list.filter(t => !t.completada);
    if (filterEstado === 'completadas') list = list.filter(t => t.completada);
    if (filterPrioridad !== 'todas')    list = list.filter(t => t.prioridad === filterPrioridad);

    list.sort((a, b) => {
      const valA = sortBy === 'prioridad'
        ? PRIORIDAD_WEIGHT[a.prioridad]
        : new Date(a[sortBy]).getTime();
      const valB = sortBy === 'prioridad'
        ? PRIORIDAD_WEIGHT[b.prioridad]
        : new Date(b[sortBy]).getTime();
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  }, [tareas, filterEstado, filterPrioridad, sortBy, sortDir]);

  const pendientesCount  = tareas.filter(t => !t.completada).length;
  const completadasCount = tareas.filter(t => t.completada).length;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div id="taskListScreenContainer" className="min-h-screen flex flex-col bg-surface overflow-x-hidden">

      {/* ── NavBar ── */}
      <nav
        id="topNavBar"
        className="sticky top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-surface-variant px-4 md:px-8 py-3 flex justify-between items-center shadow-sm"
      >
        <div id="logoContainer" className="flex items-center gap-2">
          <CheckCircle className="text-primary w-7 h-7" />
          <span className="font-bold text-xl text-primary tracking-tight">Tareas</span>
        </div>

        <div id="navActions" className="flex items-center gap-2">
          <button
            id="settingsBtn"
            aria-label="Configuración"
            className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
            onClick={onNavigateToSettings}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            id="userProfileTrigger"
            aria-label="Perfil de usuario"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer p-0 bg-transparent"
            onClick={onNavigateToSettings}
          >
            <img alt="Perfil de usuario" className="w-full h-full object-cover rounded-full" src={defaultProfileUrl} />
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main id="mainContent" className="flex-grow pb-16 px-4 md:px-8 max-w-3xl w-full mx-auto flex flex-col gap-6 pt-6">

        {/* Header */}
        <header id="screenHeader" className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl text-on-surface tracking-tight">Mis Tareas</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''} · {completadasCount} completada{completadasCount !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            id="addTaskToggleBtn"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow cursor-pointer flex-shrink-0"
            onClick={() => { setShowForm(s => !s); setFormError(''); }}
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </header>

        {/* ── New Task Form ── */}
        {showForm && (
          <section
            id="newTaskForm"
            className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-on-surface text-base">Nueva tarea</h2>
              <button
                aria-label="Cerrar formulario"
                className="p-1 hover:bg-surface-container rounded-full transition-colors cursor-pointer text-on-surface-variant"
                onClick={() => { setShowForm(false); setFormError(''); }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formError}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="formTitulo" className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="formTitulo"
                  type="text"
                  className={INPUT_CLS}
                  placeholder="Título de la tarea"
                  value={formTitulo}
                  onChange={e => { setFormTitulo(e.target.value); setFormError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="formDesc" className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Descripción
                </label>
                <textarea
                  id="formDesc"
                  className={TEXTAREA_CLS}
                  rows={2}
                  placeholder="Descripción de la tarea (opcional)"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="formPrioridad" className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Prioridad
                  </label>
                  <select
                    id="formPrioridad"
                    className={SELECT_CLS + ' w-full'}
                    value={formPrioridad}
                    onChange={e => setFormPrioridad(e.target.value as 'alta' | 'media' | 'baja')}
                  >
                    <option value="alta">🟡 Alta</option>
                    <option value="media">🔵 Media</option>
                    <option value="baja">⬜ Baja</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="formVencimiento" className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Fecha de vencimiento
                  </label>
                  <input
                    id="formVencimiento"
                    type="date"
                    className={INPUT_CLS}
                    min={todayISO()}
                    value={formVencimiento}
                    onChange={e => setFormVencimiento(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-surface-variant">
              <button
                id="cancelFormBtn"
                className={BTN_CLS}
                onClick={() => { setShowForm(false); setFormError(''); }}
              >
                Cancelar
              </button>
              <button
                id="submitFormBtn"
                className="border-2 border-primary rounded-md p-2 bg-primary text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                onClick={handleSubmit}
              >
                Crear Tarea
              </button>
            </div>
          </section>
        )}

        {/* ── Filters & Sort ── */}
        <section id="controlsSection" className="flex flex-col gap-3">

          {/* Estado filter pills */}
          <div
            id="filterEstadoContainer"
            className="flex gap-1 bg-surface-container-high p-1 rounded-xl border border-surface-variant self-start"
          >
            {(['todos', 'pendientes', 'completadas'] as const).map(f => (
              <button
                key={f}
                id={`filterEstado-${f}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterEstado === f
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setFilterEstado(f)}
              >
                {f === 'todos' ? 'Todos' : f === 'pendientes' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>

          {/* Priority filter + sort row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SlidersHorizontal className="w-4 h-4 text-on-surface-variant flex-shrink-0" />

            {/* Filter by prioridad */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filterPrioridad" className="text-xs text-on-surface-variant font-medium whitespace-nowrap">
                Prioridad:
              </label>
              <select
                id="filterPrioridad"
                className="border-2 border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-700 focus:border-primary focus:outline-none cursor-pointer"
                value={filterPrioridad}
                onChange={e => setFilterPrioridad(e.target.value as FilterPrioridad)}
              >
                <option value="todas">Todas</option>
                <option value="alta">🟡 Alta</option>
                <option value="media">🔵 Media</option>
                <option value="baja">⬜ Baja</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sortBy" className="text-xs text-on-surface-variant font-medium whitespace-nowrap">
                Ordenar:
              </label>
              <select
                id="sortBy"
                className="border-2 border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-700 focus:border-primary focus:outline-none cursor-pointer"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortBy)}
              >
                <option value="fecha">Fecha creación</option>
                <option value="prioridad">Prioridad</option>
                <option value="fechaVencimiento">Vencimiento</option>
                <option value="updatedAt">Actualización</option>
              </select>
              <button
                id="sortDirBtn"
                aria-label={sortDir === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
                className="border-2 border-gray-300 rounded-md p-1.5 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                title={sortDir === 'asc' ? 'Ascendente' : 'Descendente'}
                onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              >
                {sortDir === 'asc'
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />
                }
              </button>
            </div>
          </div>
        </section>

        {/* ── Task list ── */}
        <section id="taskListSection" className="min-h-[300px]">
          {tareasFiltradas.length === 0 ? (
            <div id="emptyStateContainer" className="flex flex-col items-center justify-center py-24 text-center">
              <Smile className="w-16 h-16 text-outline-variant mb-4 stroke-1" />
              <h2 className="font-bold text-xl text-on-surface mb-2">Sin tareas aquí</h2>
              <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
                No hay tareas que coincidan con los filtros. Prueba con otro filtro o crea una nueva tarea.
              </p>
            </div>
          ) : (
            <ul id="taskListElement" className="flex flex-col gap-3">
              {tareasFiltradas.map(tarea => {
                const expired = !tarea.completada && isExpired(tarea.fechaVencimiento);
                const accentColor = tarea.completada ? 'bg-green-500' : PRIORIDAD_ACCENT[tarea.prioridad];
                return (
                  <li
                    key={tarea.id}
                    id={`task-item-${tarea.id}`}
                    className={`task-card bg-surface-container-lowest rounded-xl border border-surface-variant flex flex-col overflow-hidden shadow-sm ${
                      tarea.completada ? 'task-completed opacity-75' : ''
                    }`}
                  >
                    {/* Colored left accent bar */}
                    <div className="flex">
                      <div className={`w-1.5 flex-shrink-0 ${accentColor}`} />
                      <div className="flex-grow p-4 flex flex-col gap-2">

                        {/* Top row: checkbox + title + badge */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id={`checkbox-${tarea.id}`}
                            checked={tarea.completada}
                            className="custom-checkbox flex-shrink-0 mt-0.5"
                            onChange={() => onToggleTarea(tarea.id)}
                          />
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`task-text font-semibold text-sm text-on-surface leading-snug ${
                                  tarea.completada ? 'line-through opacity-50' : ''
                                }`}
                              >
                                {tarea.titulo}
                              </span>
                              <span
                                className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORIDAD_BADGE[tarea.prioridad]}`}
                              >
                                {PRIORIDAD_LABEL[tarea.prioridad]}
                              </span>
                            </div>
                            {tarea.descripcion && (
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                {tarea.descripcion}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom row: date + actions */}
                        <div className="flex items-center justify-between pl-9 mt-1">
                          <div className={`flex items-center gap-1 text-xs ${expired ? 'text-red-500 font-semibold' : 'text-on-surface-variant'}`}>
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Vence: {formatDate(tarea.fechaVencimiento)}</span>
                            {expired && <span className="ml-1 text-red-500">⚠ Vencida</span>}
                          </div>
                          <div className="flex items-center gap-1">
                            {!tarea.completada && (
                              <button
                                aria-label="Editar tarea"
                                className="text-on-surface-variant hover:text-primary hover:bg-primary-container/30 p-1.5 rounded-full transition-colors cursor-pointer"
                                onClick={() => openEdit(tarea)}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              aria-label="Eliminar tarea"
                              className="text-on-surface-variant hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                              onClick={() => onDeleteTarea(tarea.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* ── Edit Modal ── */}
      {editTarea && (
        <div
          id="editModal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">Editar tarea</h2>
              <button
                id="closeEditBtn"
                aria-label="Cerrar"
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500 border-2 border-gray-300"
                onClick={closeEdit}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {editError}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="editTitulo" className="block text-xs font-semibold text-gray-500 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  id="editTitulo"
                  type="text"
                  className={INPUT_CLS}
                  value={editTitulo}
                  onChange={e => { setEditTitulo(e.target.value); setEditError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="editDesc" className="block text-xs font-semibold text-gray-500 mb-1">
                  Descripción
                </label>
                <textarea
                  id="editDesc"
                  className={TEXTAREA_CLS}
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="editPrioridad" className="block text-xs font-semibold text-gray-500 mb-1">
                    Prioridad
                  </label>
                  <select
                    id="editPrioridad"
                    className={SELECT_CLS + ' w-full'}
                    value={editPrioridad}
                    onChange={e => setEditPrioridad(e.target.value as 'alta' | 'media' | 'baja')}
                  >
                    <option value="alta">🟡 Alta</option>
                    <option value="media">🔵 Media</option>
                    <option value="baja">⬜ Baja</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="editVencimiento" className="block text-xs font-semibold text-gray-500 mb-1">
                    Vencimiento
                  </label>
                  <input
                    id="editVencimiento"
                    type="date"
                    className={INPUT_CLS}
                    value={editVencimiento}
                    onChange={e => setEditVencimiento(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <button
                id="cancelEditBtn"
                className={BTN_CLS}
                onClick={closeEdit}
              >
                Cancelar
              </button>
              <button
                id="saveEditBtn"
                className="border-2 border-primary rounded-md p-2 bg-primary text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                onClick={handleSaveEdit}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer id="footerContainer" className="w-full py-4 bg-surface border-t border-outline-variant mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 md:px-8 max-w-3xl mx-auto gap-2">
          <div className="text-xs text-on-surface-variant">
            © 2024 Gestión de Tareas
          </div>
          <div className="flex gap-4 text-xs font-medium text-on-surface-variant">
            <button className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0">
              Política de privacidad
            </button>
            <button className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0">
              Términos de uso
            </button>
            <button className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0">
              Contacto
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
