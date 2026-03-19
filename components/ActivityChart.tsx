"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: 'Mon', mins: 45 },
  { day: 'Tue', mins: 120 },
  { day: 'Wed', mins: 0 },
  { day: 'Thu', mins: 60 },
  { day: 'Fri', mins: 150 }, // These will eventually come from your DB!
];

export default function ActivityChart() {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#B7A1CE', fontSize: 10}} 
          />
          <Tooltip 
            cursor={{fill: 'rgba(124, 105, 146, 0.1)'}}
            contentStyle={{backgroundColor: '#17153B', border: '1px solid #433D8B', borderRadius: '10px'}}
          />
          <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.mins > 60 ? '#7C6992' : '#433D8B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}