"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ActivityChart() {
  // 1. We start with an empty list instead of hardcoded Mon/Tue data
  const [chartData, setChartData] = useState<{ day: string; mins: number }[]>([]);

  useEffect(() => {
    const fetchStudyLogs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Fetch logs for the last 7 days from Supabase
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs } = await supabase
        .from('study_logs')
        .select('minutes_spent, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // 3. Create the labels for the last 7 days dynamically
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = [];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push({
          fullDate: d.toISOString().split('T')[0],
          dayName: days[d.getDay()],
          mins: 0
        });
      }

      // 4. Map your real database minutes into those days
      const finalData = last7Days.map(slot => {
        const dayTotal = logs
          ? logs.filter(log => log.created_at.startsWith(slot.fullDate))
                .reduce((sum, log) => sum + log.minutes_spent, 0)
          : 0;
        
        return { day: slot.dayName, mins: dayTotal };
      });

      setChartData(finalData);
    };

    fetchStudyLogs();
  }, []);

  return (
    <div className="h-[200px] w-full mt-4">
      {/* 5. If data hasn't loaded yet, show a tiny loading space */}
      {chartData.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-[10px] text-[#B7A1CE] opacity-50">
          Loading Activity...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#B7A1CE', fontSize: 9}} 
            />
            <Tooltip 
              cursor={{fill: 'rgba(124, 105, 146, 0.1)'}}
              contentStyle={{
                backgroundColor: '#17153B', 
                border: '1px solid #433D8B', 
                borderRadius: '10px',
                fontSize: '10px'
              }}
            />
            <Bar dataKey="mins" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.mins > 0 ? '#7C6992' : '#433D8B'} 
                  fillOpacity={entry.mins > 0 ? 1 : 0.3} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}