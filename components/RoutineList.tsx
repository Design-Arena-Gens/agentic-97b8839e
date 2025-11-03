"use client";

import { Routine } from "@/lib/types";

export function RoutineList(props: {
  routines: Routine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  const { routines, selectedId, onSelect, onAdd, onDelete } = props;
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700">Routines</h2>
        <button className="btn" onClick={onAdd}>New</button>
      </div>
      <ul className="space-y-1">
        {routines.length === 0 && (
          <li className="text-sm text-gray-500">No routines yet. Create one.</li>
        )}
        {routines.map((r) => (
          <li key={r.id}>
            <button
              className={`w-full text-left px-3 py-2 rounded-md border flex items-center justify-between ${
                selectedId === r.id ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(r.id)}
            >
              <span className="truncate">
                <span className="inline-block w-3 h-3 rounded-full mr-2 align-middle" style={{ background: r.color }} />
                {r.name}
              </span>
              <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); onDelete(r.id); }}>Delete</button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
