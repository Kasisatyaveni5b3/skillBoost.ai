import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Single-file TypeScript React Month View Task Planner
// Save as MonthTaskPlanner.tsx (make sure your project supports TSX)

type Category = "To Do" | "In Progress" | "Review" | "Completed";

type Task = {
  id: string;
  name: string;
  category: Category;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;   // ISO yyyy-mm-dd
  startTime?: string; // optional
  endTime?: string;   // optional
};

type Filters = {
  categories: Category[];
  duration: string | null; // '1' | '2' | '3' or null
  search: string;
};

// ---------- Utilities ----------
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const fromISO = (s: string) => new Date(s + "T00:00:00");
const addDaysISO = (iso: string, n: number) => toISO(new Date(Date.parse(iso + "T00:00:00") + n * 86400000));
const cmpISO = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => !(aEnd < bStart || aStart > bEnd);

function getMonthGrid(reference = new Date()) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const first = new Date(year, month, 1);
  const startDay = new Date(first);
  startDay.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // previous Monday
  const days: { iso: string; date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 6 * 7; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    days.push({ iso: toISO(d), date: d, inMonth: d.getMonth() === month });
  }
  return days;
}

// ---------- Components (all in single file) ----------

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

const categoryList: Category[] = ["To Do", "In Progress", "Review", "Completed"];

// Filter Panel
function FilterPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  return (
    <aside style={{ width: 260, padding: 16, borderRight: '1px solid #eee', boxSizing: 'border-box' }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <div>
        <strong>Categories</strong>
        {categoryList.map((c) => (
          <div key={c} style={{ marginTop: 6 }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.categories.includes(c)}
                onChange={(e) => {
                  setFilters({
                    ...filters,
                    categories: e.target.checked ? [...filters.categories, c] : filters.categories.filter(x => x !== c)
                  });
                }}
              />
              {' '}{c}
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Time (from month start)</strong>
        <div style={{ marginTop: 6 }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="dur" checked={!filters.duration} onChange={() => setFilters({ ...filters, duration: null })} /> All
          </label>
        </div>
        {[1,2,3].map(w => (
          <div key={w}>
            <label style={{ cursor: 'pointer' }}>
              <input type="radio" name="dur" checked={filters.duration === String(w)} onChange={() => setFilters({ ...filters, duration: String(w) })} /> {w} week{w>1? 's':''}
            </label>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Search</strong>
        <div>
          <input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: '100%', padding: 6, marginTop: 6, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => setFilters({ categories: [], duration: null, search: '' })}>Reset</button>
      </div>
    </aside>
  );
}

// Modal for creating/editing tasks
function TaskModal({ visible, range, onClose, onSave, initial }: {
  visible: boolean;
  range: { start: string; end: string } | null;
  onClose: () => void;
  onSave: (payload: { name: string; category: Category; startDate: string; endDate: string }, editId?: string) => void;
  initial?: Task | null;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('To Do');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setCategory(initial.category);
    } else {
      setName('');
      setCategory('To Do');
    }
  }, [initial, visible]);

  if (!visible || !range) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onMouseDown={onClose}>
      <div style={{ background: '#fff', padding: 16, minWidth: 320, borderRadius: 8 }} onMouseDown={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{initial ? 'Edit Task' : 'New Task'}</h3>
        <div>Range: {range.start} → {range.end}</div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Task name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: 8, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginTop: 8 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} style={{ width: '100%', padding: 8 }}>
            {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => {
            if (!name.trim()) return alert('Enter task name');
            if (initial) onSave({ name: name.trim(), category, startDate: range.start, endDate: range.end }, initial.id);
            else onSave({ name: name.trim(), category, startDate: range.start, endDate: range.end });
          }}>{initial ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </div>
  );
}

// TaskBar: visual pill with move/resize handlers (retained)

function TaskBar({
  task,
  gridRef,
  onUpdate,
}: {
  task: Task;
  gridRef: React.RefObject<HTMLDivElement>;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}) {
  const dragRef = useRef<{
    type: "move" | "left" | "right" | null;
    startX?: number;
    origStart?: string;
    origEnd?: string;
  } | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current || !dragRef.current.type) return;
      if (!gridRef.current) return;

      const deltaX = e.clientX - (dragRef.current.startX || 0);
      const gridWidth = gridRef.current.clientWidth;
      if (gridWidth === 0) return; // avoid division by zero

      const dayWidth = gridWidth / 7; // width of a day cell
      const deltaDays = Math.round(deltaX / dayWidth);

      // No change if deltaDays is 0 to reduce updates
      if (deltaDays === 0) return;

      if (dragRef.current.type === "move") {
        const origStart = dragRef.current.origStart!;
        const origEnd = dragRef.current.origEnd!;
        const duration =
          (Date.parse(origEnd + "T00:00:00") - Date.parse(origStart + "T00:00:00")) /
          86400000;
        const newStart = addDaysISO(origStart, deltaDays);
        const newEnd = addDaysISO(newStart, duration);
        onUpdate(task.id, { startDate: newStart, endDate: newEnd });
      } else if (dragRef.current.type === "left") {
        const newStart = addDaysISO(dragRef.current.origStart!, deltaDays);

        // Enforce newStart <= endDate - 1 day (at least 1 day task)
        const minStart = addDaysISO(task.endDate, -1);
        if (cmpISO(newStart, minStart) <= 0) {
          onUpdate(task.id, { startDate: newStart });
        }
      } else if (dragRef.current.type === "right") {
        const newEnd = addDaysISO(dragRef.current.origEnd!, deltaDays);

        // Enforce newEnd >= startDate + 1 day
        const minEnd = addDaysISO(task.startDate, 1);
        if (cmpISO(newEnd, minEnd) >= 0) {
          onUpdate(task.id, { endDate: newEnd });
        }
      }
    }

    function onUp() {
      dragRef.current = null;
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [gridRef, onUpdate, task]);

  function startDrag(e: React.MouseEvent, type: "move" | "left" | "right") {
    e.stopPropagation();
    dragRef.current = {
      type,
      startX: e.clientX,
      origStart: task.startDate,
      origEnd: task.endDate,
    };
    document.body.style.userSelect = "none";
  }

  const colorMap: Record<Category, string> = {
    "To Do": "#1890ff",
    "In Progress": "#52c41a",
    Review: "#faad14",
    Completed: "#9254de",
  };

  return (
    <div style={{ position: "relative", marginBottom: 6 }}>
      <div
        onMouseDown={(e) => startDrag(e, "move")}
        style={{
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: 8,
          background: colorMap[task.category],
          color: "#fff",
          cursor: "grab",
          minWidth: 80,
          userSelect: "none",
        }}
        title={`${task.name} (${task.startDate} → ${task.endDate})`}
      >
        <strong style={{ fontSize: 12 }}>{task.name}</strong>
      </div>
      {/* left handle */}
      <div
        onMouseDown={(e) => startDrag(e, "left")}
        style={{
          position: "absolute",
          left: -8,
          top: 0,
          bottom: 0,
          width: 16,
          cursor: "ew-resize",
          zIndex: 10,
          userSelect: "none",
        }}
      />
      {/* right handle */}
      <div
        onMouseDown={(e) => startDrag(e, "right")}
        style={{
          position: "absolute",
          right: -8,
          top: 0,
          bottom: 0,
          width: 16,
          cursor: "ew-resize",
          zIndex: 10,
          userSelect: "none",
        }}
      />
    </div>
  );
}


// Task card used in DnD wrapper
function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: (t: Task) => void; onDelete: (id: string) => void }) {
  const colorMap: Record<Category, string> = { 'To Do': '#1890ff', 'In Progress': '#52c41a', 'Review': '#faad14', 'Completed': '#9254de' };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: 6, background: colorMap[task.category], color: '#fff', marginBottom: 6, cursor: 'grab' }}>
      <div style={{ fontSize: 12, fontWeight: 600 }}>
        <div>{task.name}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>Edit</button>
        
      </div>
    </div>
  );
}

// Main App
export default function MonthTaskPlanner() {
  const [refDate, setRefDate] = useState<Date>(() => new Date());
  const days = useMemo(() => getMonthGrid(refDate), [refDate]);
  const monthStartIso = useMemo(() => days.find(d => d.inMonth)!.iso, [days]);

  const [tasks, setTasks] = useLocalStorage<Task[]>('month-planner.tasks', []);
  const [filters, setFilters] = useLocalStorage<Filters>('month-planner.filters', { categories: [], duration: null, search: '' });

  const gridRef = useRef<any>(null);

  // Selection state
  const drag = useRef<{ start: string; end: string } | null>(null);
  const [selection, setSelection] = useState<{ start: string; end: string } | null>(null);
  const [modalRange, setModalRange] = useState<{ start: string; end: string } | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // anchors map: tasks anchored by startDate
  const anchors = useMemo(() => {
    const map = new Map<string, Task[]>();
    days.forEach(d => map.set(d.iso, []));
    tasks.forEach(t => {
      if (!map.has(t.startDate)) map.set(t.startDate, []);
      map.get(t.startDate)!.push(t);
    });
    // sort using Array.from to avoid downlevelIteration issues
    Array.from(map.values()).forEach(arr => arr.sort((a,b) => (a.name || '').localeCompare(b.name || '')));
    return map;
  }, [tasks, days]);

  // Filtered tasks (apply filters)
  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filters.categories.length && !filters.categories.includes(t.category)) return false;
      if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.duration) {
        const weeks = parseInt(filters.duration, 10);
        const cutoff = addDaysISO(monthStartIso, weeks * 7 - 1);
        if (t.endDate < monthStartIso || t.startDate > cutoff) return false;
      }
      return true;
    });
  }, [tasks, filters, monthStartIso]);

  // Create or update
  function createTask(payload: { name: string; category: Category; startDate: string; endDate: string }) {
    const t: Task = { id: String(Date.now()) + Math.random().toString(36).slice(2,6), ...payload };
    setTasks(prev => [...prev, t]);
  }
  function updateTask(id: string, updates: Partial<Task>) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }
  function removeTask(id: string) { setTasks(prev => prev.filter(t => t.id !== id)); }

  // Mouse handlers for selection
  function onDayMouseDown(dayIso: string) {
    return (e: React.MouseEvent) => {
      drag.current = { start: dayIso, end: dayIso };
      setSelection({ start: dayIso, end: dayIso });
    };
  }
  function onDayMouseEnter(dayIso: string) {
    return (e: React.MouseEvent) => {
      if (!drag.current) return;
      drag.current.end = dayIso;
      const s = cmpISO(drag.current.start, drag.current.end) <= 0 ? drag.current.start : drag.current.end;
      const en = cmpISO(drag.current.start, drag.current.end) <= 0 ? drag.current.end : drag.current.start;
      setSelection({ start: s, end: en });
    };
  }
  function onDayMouseUp(dayIso: string) {
    return (e: React.MouseEvent) => {
      if (!drag.current) return;
      const s = cmpISO(drag.current.start, drag.current.end) <= 0 ? drag.current.start : drag.current.end;
      const en = cmpISO(drag.current.start, drag.current.end) <= 0 ? drag.current.end : drag.current.start;
      setModalRange({ start: s, end: en });
      drag.current = null;
      setSelection(null);
    };
  }

  // When clicking an existing task pill we open edit modal
  function onTaskClick(task: Task) {
    setEditTask(task);
    setModalRange({ start: task.startDate, end: task.endDate });
  }

  // DnD: move task between days by shifting start/end by delta days
  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    const taskId = res.draggableId;
    const from = res.source.droppableId;
    const to = res.destination.droppableId;
    if (from === to) {
      // same-day drag — ignoring reorder persistence for now
      return;
    }
    const t = tasks.find(x => x.id === taskId);
    if (!t) return;
    const diff = Math.round((new Date(to + 'T00:00:00').getTime() - new Date(from + 'T00:00:00').getTime()) / 86400000);
    const newStart = addDaysISO(t.startDate, diff);
    const newEnd = addDaysISO(t.endDate, diff);
    updateTask(t.id, { startDate: newStart, endDate: newEnd });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <FilterPanel filters={filters} setFilters={setFilters} />

      <div style={{ flex: 1, padding: 16, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Month Planner</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1))}>Prev</button>
            <button onClick={() => setRefDate(new Date())}>Today</button>
            <button onClick={() => setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1))}>Next</button>
          </div>
        </div>

        <div ref={gridRef}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '110px', gap: 0, border: '1px solid #eee' }}>
              {days.map(d => {
                const isSelecting = selection && cmpISO(selection.start, d.iso) <= 0 && cmpISO(d.iso, selection.end) <= 0;
                // anchored tasks for this day (startDate === d.iso) filtered by active filters
                const anchored = (anchors.get(d.iso) || []).filter(t => filtered.includes(t));
                const continued = filtered.filter(t => t.startDate < d.iso && t.endDate >= d.iso);

                return (
                  <div key={d.iso}
                    onMouseDown={onDayMouseDown(d.iso)}
                    onMouseEnter={onDayMouseEnter(d.iso)}
                    onMouseUp={onDayMouseUp(d.iso)}
                    style={{ padding: 8, borderLeft: '1px solid #f5f5f5', borderTop: '1px solid #f5f5f5', background: isSelecting ? '#e6f7ff' : (d.iso === toISO(new Date()) ? '#fffbe6' : '#fff'), boxSizing: 'border-box' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: d.inMonth ? '#111' : '#bbb', fontWeight: d.iso === toISO(new Date()) ? 700 : 500 }}>{d.date.getDate()}</div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      {continued.map(t => (
                        <div key={t.id} style={{ marginBottom: 6, padding: '4px 6px', borderRadius: 6, background: 'rgba(0,0,0,0.06)', fontSize: 11 }} title={`${t.name} (${t.startDate} → ${t.endDate})`}>
                          ↳ {t.name}
                        </div>
                      ))}

                     <Droppable droppableId={d.iso} type="TASKS">
  {(provided: any) => (
    <div ref={provided.innerRef} {...provided.droppableProps}>
      {anchored.map((task, i) => (
        <Draggable draggableId={task.id} index={i} key={task.id}>
          {(prov: any) => (
            <div
              ref={prov.innerRef}
              {...prov.draggableProps}
              {...(prov.dragHandleProps ?? {})}
              style={{ ...prov.draggableProps.style }}
            >
              <div onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}>
                {/* REPLACE TaskCard with TaskBar here: */}
                <TaskBar task={task} gridRef={gridRef} onUpdate={updateTask} />
              </div>
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </div>
  )}
</Droppable>


                    </div>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

      </div>

      <TaskModal
        visible={!!modalRange}
        range={modalRange}
        initial={editTask}
        onClose={() => { setModalRange(null); setEditTask(null); }}
        onSave={(payload, editId) => {
          if (editId) {
            updateTask(editId, payload);
          } else {
            createTask(payload);
          }
          setModalRange(null);
          setEditTask(null);
        }}
      />

    </div>
  );
}
