import { List, LayoutGrid } from "lucide-react";

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-md transition-colors ${
          view === "list"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Vista de lista"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange("cards")}
        className={`p-2 rounded-md transition-colors ${
          view === "cards"
            ? "bg-white shadow-sm text-gray-900"
            : "text-gray-500 hover:text-gray-700"
        }`}
        title="Vista de tarjetas"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}
