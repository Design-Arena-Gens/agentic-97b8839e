"use client";

import { useEffect, useMemo, useState } from "react";
import { Routine, RoutineTask } from "@/lib/types";
import { loadRoutines, saveRoutines, loadSelectedRoutineId, saveSelectedRoutineId } from "@/lib/storage";
import { RoutineList } from "@/components/RoutineList";
import { RoutineEditor } from "@/components/RoutineEditor";
import { Schedule } from "@/components/Schedule";

export default function Page() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setRoutines(loadRoutines());
    const sel = loadSelectedRoutineId();
    if (sel) setSelectedId(sel);
  }, []);

  useEffect(() => {
    saveRoutines(routines);
  }, [routines]);

  useEffect(() => {
    saveSelectedRoutineId(selectedId);
  }, [selectedId]);

  const selected = useMemo(() => routines.find(r => r.id === selectedId) || null, [routines, selectedId]);

  function addRoutine() {
    const r: Routine = { id: crypto.randomUUID(), name: "My routine", color: randomColor(), tasks: [] };
    setRoutines(prev => [r, ...prev]);
    setSelectedId(r.id);
  }

  function deleteRoutine(id: string) {
    setRoutines(prev => prev.filter(r => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function updateRoutine(updated: Routine) {
    setRoutines(prev => prev.map(r => r.id === updated.id ? updated : r));
  }

  function deleteTask(taskId: string) {
    if (!selected) return;
    const updated: Routine = { ...selected, tasks: selected.tasks.filter(t => t.id !== taskId) };
    updateRoutine(updated);
  }

  function addTask(task: RoutineTask) {
    if (!selected) return;
    const updated: Routine = { ...selected, tasks: [...selected.tasks, task] };
    updateRoutine(updated);
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Routine Planner</h1>
        <div className="text-sm text-gray-600">Your routines, organized by week.</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RoutineList
            routines={routines}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAdd={addRoutine}
            onDelete={deleteRoutine}
          />
        </div>
        <div className="lg:col-span-3 space-y-6">
          {!selected && (
            <div className="card p-6 text-gray-600">Select a routine or create a new one to get started.</div>
          )}
          {selected && (
            <>
              <RoutineEditor routine={selected} onUpdate={updateRoutine} onDeleteTask={deleteTask} onAddTask={addTask} />
              <Schedule routine={selected} />
            </>
          )}
        </div>
      </div>

      <footer className="text-xs text-gray-500 text-center pt-6">
        Built with Next.js. Data is stored locally in your browser.
      </footer>
    </main>
  );
}

function randomColor(): string {
  const colors = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#14B8A6'];
  return colors[Math.floor(Math.random()*colors.length)];
}
