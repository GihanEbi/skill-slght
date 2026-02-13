export default function Dashboard() {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard
          icon="dataset"
          val="1,284"
          label="Profiles Indexed"
          color="var(--primary)"
        />
        <StatCard
          icon="bolt"
          val="42"
          label="Live Nodes"
          color="var(--secondary)"
        />
        <StatCard
          icon="verified"
          val="156"
          label="Smart Hires"
          color="var(--accent)"
        />
        <StatCard icon="auto_graph" val="89" label="Qualified" color="gray" />
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]/30">
          <h2 className="text-2xl font-black">All Candidates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--background)] text-[12px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              <tr>
                <th className="px-10 py-6">Profile Entity</th>
                <th className="px-10 py-6">Position</th>
                <th className="px-10 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              <TableRow
                name="Julian Jameson"
                role="Product Architect"
                email="julian.j@vector.ai"
                status="ACTIVE"
              />
              <TableRow
                name="Sarah Chen"
                role="Rust Engineer"
                email="s.chen@nexus.sh"
                status="PASSIVE"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, val, label, color }: any) {
  return (
    <div className="p-8 glass-panel rounded-3xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <span className="material-symbols-outlined text-3xl font-bold">
            {icon}
          </span>
        </div>
      </div>
      <h3 className="text-5xl font-black tracking-tighter">{val}</h3>
      <p className="text-sm font-extrabold text-[var(--text-muted)] uppercase mt-2">
        {label}
      </p>
    </div>
  );
}

function TableRow({ name, role, email, status }: any) {
  return (
    <tr className="hover:bg-[var(--primary)]/5 transition-all cursor-pointer">
      <td className="px-10 py-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div>
            <p className="font-extrabold">{name}</p>
            <p className="text-sm text-[var(--text-muted)]">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-10 py-8 font-bold">{role}</td>
      <td className="px-10 py-8">
        <span className="px-3 py-1 rounded-full border text-[10px] font-black border-emerald-500/50 text-emerald-500">
          {status}
        </span>
      </td>
    </tr>
  );
}
