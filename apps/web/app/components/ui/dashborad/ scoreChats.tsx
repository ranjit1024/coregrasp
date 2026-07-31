"use client";

interface Props {
  distribution: { range: string; count: number }[];
}

export function ScoreChart({ distribution }: Props) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Score Distribution</h2>
      <div className="space-y-3">
        {distribution.map((item) => (
          <div key={item.range} className="flex items-center gap-3">
            <span className="w-16 text-sm font-medium text-gray-600">{item.range}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-4 rounded-full bg-blue-500 transition-all"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm text-gray-500">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}