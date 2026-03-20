"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ActivityChart() {
  const [chartData, setChartData] = useState<{ day: string; mins: number }[]>([]);

  useEffect(() => {
    const fetchStudyLogs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get logs from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs, error } = await supabase
        .from('study_logs')
        .select('minutes_spent, created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (error) {
        console.error("Error fetching logs:", error);
        return;
      }

      // 2. Prepare the last 7 days of the week (Dynamic)
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

      // 3. Fill the days with real minutes from Supabase
      const finalData = last7Days.map(slot => {
        const dayTotal = logs
          .filter(log => log.created_at.startsWith(slot.fullDate))
          .reduce((sum, log) => sum + log.minutes_spent, 0);
        
        return { day: slot.dayName, mins: dayTotal };
      });

      setChartData(finalData);
    };

    fetchStudyLogs();
  }, []);

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#B7A1CE', fontSize: 9}} // Slightly smaller for mobile
          />
          <Tooltip 
            cursor={{fill: 'rgba(124, 105, 146, 0.1)'}}
            contentStyle={{
              backgroundColor: '#17153B', 
              border: '1px solid #433D8B', 
              borderRadius: '10px',
              fontSize: '12px'
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
    </div>
  );
}