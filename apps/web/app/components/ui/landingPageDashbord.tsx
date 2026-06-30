import { MoreHorizontal } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Merchant Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-black text-white text-sm">Today</button>
          <button className="px-4 py-2 rounded-xl border text-sm">This week</button>
          <button className="px-4 py-2 rounded-xl border text-sm">This month</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total clicks", value: "35,567" },
          { title: "Total Revenue", value: "$89,450" },
          { title: "Payouts Pending", value: "35,567" },
          { title: "Conversions", value: "35,567" },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border">
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-xl font-semibold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Earnings Overview</h2>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>

          {/* Fake chart */}
          <div className="h-48 bg-liearn-to-r from-orange-100 to-orange-50 rounded-xl flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

        {/* Requests */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="font-semibold mb-4">Recent affiliate requests</h2>

          {[1, 2].map((_, i) => (
            <div key={i} className="mb-4 border rounded-xl p-3">
              <p className="font-medium">Sarah johnso</p>
              <p className="text-xs text-gray-500 mb-2">Fashion & lifestyle</p>

              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg bg-orange-500 text-white hover:bg-orange-600">
                  Approve
                </button>
                <button className="px-3 py-1.5 text-sm rounded-lg border">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
