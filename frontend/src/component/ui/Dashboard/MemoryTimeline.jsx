import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Activity } from "lucide-react";
import API from "../../../lib/api";

export const MemoryTimeline = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate some chronological emotion data from memories
    // In a real app, sentiment analysis would provide the 'sentiment' score
    const fetchTimeline = async () => {
      try {
        const res = await API.get("/memory");
        // Mock sentiment mapping for visual demonstration based on memory existence
        const mappedData = res.data.slice(0, 10).reverse().map((mem, i) => ({
          date: new Date(mem.created_at || Date.now() - (10 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sentiment: Math.floor(Math.random() * 60) + 40, // 40-100 random for positive growth visuals
          content: mem.content.substring(0, 30) + "..."
        }));

        if (mappedData.length === 0) {
          setData([{ date: "Today", sentiment: 50, content: "Start writing!" }]);
        } else {
          setData(mappedData);
        }
      } catch (err) {
        console.error("Timeline error");
      }
    };
    fetchTimeline();
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Activity className="text-cyan-400" size={18} />
            Emotional Timeline
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Your mood variations over recent memories</p>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#06b6d4' }}
            />
            <Area type="monotone" dataKey="sentiment" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
