"use client";

import { Routine, RoutineTask, DayIndex } from "@/lib/types";
import { useMemo, useState } from "react";

const DAYS: { label: string; value: DayIndex }[] = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

export function RoutineEditor(props: {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: RoutineTask) => void;
}) {
  const { routine, onUpdate, onDeleteTask, onAddTask } = props;
  const [name, setName] = useState(routine.name);
  const [color, setColor] = useState(routine.color);

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");
  const [days, setDays] = useState<DayIndex[]>([1,2,3,4,5]);

  const canAdd = useMemo(() => title.trim().length > 0 && start < end && days.length > 0, [title, start, end, days]);

  function updateMeta() {
    if (name !== routine.name || color !== routine.color) {
      onUpdate({ ...routine, name, color });
    }
  }

  function toggleDay(d: DayIndex) {
    setDays((prev) => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());
  }

  function addTask() {
    if (!canAdd) return;
    const task: RoutineTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      startTime: start,
      endTime: end,
      days: days.slice().sort(),
    };
    onAddTask(task);
    setTitle("");
  }

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Routine details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} onBlur={updateMeta} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input className="input" type="color" value={color} onChange={(e) => { setColor(e.target.value); }} onBlur={updateMeta} />
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add task</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Workout" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input className="input" type="time" value={start} onChange={(e)=>setStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
            <input className="input" type="time" value={end} onChange={(e)=>setEnd(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => (
                <button key={d.value} type="button" className={`px-2 py-1 rounded-md text-sm border ${days.includes(d.value) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={()=>toggleDay(d.value)}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3"><button className="btn" disabled={!canAdd} onClick={addTask}>Add task</button></div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Tasks</h3>
        <ul className="divide-y divide-gray-200">
          {routine.tasks.length === 0 && <li className="text-sm text-gray-500 py-2">No tasks yet.</li>}
          {routine.tasks.map(t => (
            <li key={t.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-600">{t.startTime} - {t.endTime} ? {t.days.map(d=>DAYS[d].label).join(', ')}</div>
              </div>
              <button className="btn-secondary" onClick={()=>onDeleteTask(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
