import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

const COLORS = ["#FF6384", "#36A2EB"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdoptions: 0,
    totalMissing: 0,
    postsOverTime: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch adoption posts
        const adoptionRes = await axios.get("http://localhost:5000/api/adopt");
        const missingRes = await axios.get("http://localhost:5000/api/missing-posts");

        // Count the total posts
        const totalAdoptions = adoptionRes.data.length;
        const totalMissing = missingRes.data.length;

        // Combine data to calculate posts over time (example logic)
        const postsOverTime = []; // you can replace this with actual logic if needed

        setStats({
          totalAdoptions,
          totalMissing,
          postsOverTime, // Placeholder for actual data logic
        });
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: "Adoptions", value: stats.totalAdoptions },
    { name: "Missing", value: stats.totalMissing },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-[#840B36]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Post Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Posts Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.postsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="adoptions" fill="#FF6384" name="Adoptions" />
              <Bar dataKey="missing" fill="#36A2EB" name="Missing" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
