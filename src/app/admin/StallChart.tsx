"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StallChart({ data }: { data: { name: string; revenue: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: -10 }}>
          <XAxis dataKey="name" tick={{ fill: "#f7f2f6", fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
          <YAxis tick={{ fill: "#f7f2f6", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#151515", border: "1px solid #33ff67" }} formatter={(v) => `₹${v}`} />
          <Bar dataKey="revenue" fill="#33ff67" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
