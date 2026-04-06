import type { ReactNode } from 'react'

type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export default function DataTable<T>({
  columns,
  rows,
  emptyText,
}: {
  columns: Column<T>[]
  rows: T[]
  emptyText: string
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e2ebf3]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#e9f0f5]">
          <thead className="bg-[#f7fafc]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-[#6d8195]">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf3f7] bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-[#73869a]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 align-top text-sm text-[#122131]">
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
