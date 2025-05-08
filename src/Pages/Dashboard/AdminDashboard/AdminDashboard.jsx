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
    reviewsCount: 0,
    doctorsCount: 0,
    usersCount: 0,
    adoptedPetsCount: 0,
    productsCount: 0,
    missingPetsCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          adoptedPetsRes,
          missingPetsRes,
          reviewsRes,
          doctorsRes,
          productsRes,
          usersRes,
        ] = await Promise.all([
          axios.get("https://pawkie-server.vercel.app/api/adoptedPets"),
          axios.get("https://pawkie-server.vercel.app/api/missing-pet"),
          axios.get("https://pawkie-server.vercel.app/reviews"),
          axios.get("https://pawkie-server.vercel.app/doctors"),
          axios.get("https://pawkie-server.vercel.app/api/products"),
          axios.get("https://pawkie-server.vercel.app/users"),
        ]);

        const usersData = usersRes.data;
        const doctorsCount = usersData.filter(user => user.role === "doctor").length;
        const usersCount = usersData.filter(user => !user.role || user.role === "user").length;

        const postsOverTime = [
          { date: "Jan", adoptions: 5, missing: 2 },
          { date: "Feb", adoptions: 8, missing: 4 },
          { date: "Mar", adoptions: 12, missing: 3 },
        ];

        setStats({
          totalAdoptions: adoptedPetsRes.data.length,
          totalMissing: missingPetsRes.data.length,
          reviewsCount: reviewsRes.data.length,
          doctorsCount,
          usersCount,
          adoptedPetsCount: adoptedPetsRes.data.length,
          productsCount: productsRes.data.length,
          missingPetsCount: missingPetsRes.data.length,
          postsOverTime,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
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

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatBox label="Reviews" count={stats.reviewsCount} color="#5F040D" />
        <StatBox label="Doctors" count={stats.doctorsCount} color="#9C3346" />
        <StatBox label="Users" count={stats.usersCount} color="#5F040D" />
        <StatBox label="Adopted Pets" count={stats.adoptedPetsCount} color="#FFE8DA" textColor="#5F040D" />
        <StatBox label="Products" count={stats.productsCount} color="#FFD6BE" textColor="#5F040D" />
        <StatBox label="Missing Pets" count={stats.missingPetsCount} color="#9C3346" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Post Distribution</h2>
          {pieData.every(item => item.value > 0) ? (
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
          ) : (
            <p className="text-center text-gray-500">No data available for pie chart.</p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Posts Over Time</h2>
          {stats.postsOverTime.length > 0 ? (
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
          ) : (
            <p className="text-center text-gray-500">No data available for bar chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, count, color, textColor = "#FFFFFF" }) => (
  <div className="rounded-2xl shadow-lg p-6 text-center" style={{ backgroundColor: color, color: textColor }}>
    <h3 className="text-lg font-semibold mb-2">{label}</h3>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default AdminDashboard;
