import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  category: "cleaning" | "education" | "healthcare" | "environment" | "social" | "other";
  image?: string;
  organizer: string; // Assuming this is the user ID
  requiredVolunteers: number;
  registeredVolunteers: string[]; // Array of user IDs
  impact: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;
  events: Event[];
  setFilteredEvents: (events: Event[]) => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  selectedStatus,
  setSelectedStatus,
  resetFilters,
  events,
  setFilteredEvents,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleApplyFilters = () => {
    let filtered = [...events];
    
    if (selectedLocation) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (event) => event.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (event) =>
          new Date(event.date).toDateString() === selectedDate.toDateString()
      );
    }

    setFilteredEvents(filtered);
    setIsOpen(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-12 mt-10">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search for community drives near you"
            className="pl-12 h-12 w-full rounded-full border-2 focus:border-primary shadow-sm bg-white/50 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="h-12 px-6 rounded-full border-2 bg-white/50 backdrop-blur-sm hover:bg-gray-50/50 transition-colors">
            Filters
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 p-4">
            <DropdownMenuLabel className="font-semibold mb-4">
              Filter Events
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="Enter location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  resetFilters();
                  setIsOpen(false);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Apply
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(selectedLocation || selectedDate || selectedStatus) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedLocation && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              📍 {selectedLocation}
              <button onClick={() => setSelectedLocation("")} className="ml-2">
                ×
              </button>
            </span>
          )}
          {selectedDate && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              📅 {selectedDate.toLocaleDateString()}
              <button onClick={() => setSelectedDate(null)} className="ml-2">
                ×
              </button>
            </span>
          )}
          {selectedStatus && (
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              🔄 {selectedStatus}
              <button onClick={() => setSelectedStatus("")} className="ml-2">
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};