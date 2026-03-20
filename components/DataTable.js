"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ViewToggle from "./ViewToggle";

export default function DataTable({ columns, data, onRowClick, searchPlaceholder = "Buscar...", pageSize = 8, renderCard }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [view, setView] = useState("list");

  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = col.accessor ? (typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]) : "";
      return String(val).toLowerCase().includes(search.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="bg-transparent text-sm flex-1 border-none"
            />
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>
      {view === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {columns.map((col, i) => (
                  <th key={i} className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-muted text-sm">
                    No se encontraron registros
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={i}
                    className={`table-row border-t border-border ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((col, j) => (
                      <td key={j} className="px-4 py-3 text-sm">
                        {col.render ? col.render(row) : (typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4">
          {paginated.length === 0 ? (
            <div className="text-center py-10 text-muted text-sm">
              No se encontraron registros
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((row, i) => (
                <div
                  key={i}
                  className={`border border-border rounded-lg p-4 hover:shadow-md transition-shadow ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {renderCard ? renderCard(row) : (
                    <div className="space-y-2">
                      {columns.map((col, j) => (
                        <div key={j}>
                          <p className="text-xs text-muted font-medium">{col.header}</p>
                          <div className="text-sm">
                            {col.render ? col.render(row) : (typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor])}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
