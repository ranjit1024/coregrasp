"use client";

interface Props {
  attempted: number;
  notAttempted: number;
}

export function AttemptStatus({ attempted, notAttempted }: Props) {
  const total = attempted + notAttempted || 1;
  const attemptedPct = Math.round((attempted / total) * 100);
  const notAttemptedPct = Math.round((notAttempted / total) * 100);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Attempt Status</h2>
      
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600">Attempted</span>
            <span className="font-medium text-green-600">{attempted} ({attemptedPct}%)</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${attemptedPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600">Not Attempted</span>
            <span className="font-medium text-red-500">{notAttempted} ({notAttemptedPct}%)</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-red-400"
              style={{ width: `${notAttemptedPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}