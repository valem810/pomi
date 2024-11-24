import { Search } from 'lucide-react';

function TopBar() {
  return (
    <div className="bg-white shadow-md p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;

