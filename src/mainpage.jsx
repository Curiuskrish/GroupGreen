import React from 'react';

const MainPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937] text-white flex flex-col px-6 py-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-10 tracking-wider">🚀 DashZen</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">🏠 Home</a>
          <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">📊 Analytics</a>
          <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">📁 Projects</a>
          <a href="#" className="hover:bg-gray-700 px-4 py-2 rounded">⚙️ Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              AC
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Cards */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">📈 Performance</h3>
            <p className="text-gray-600">View your growth stats here.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">🧾 Recent Activity</h3>
            <p className="text-gray-600">What you've been working on.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">🔔 Notifications</h3>
            <p className="text-gray-600">Stay updated with alerts.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
