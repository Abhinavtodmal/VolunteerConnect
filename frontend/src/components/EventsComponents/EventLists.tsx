import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Calendar,
  MapPin,
  Users,
  Leaf,
  HeartHandshake,
  Trash,
  BookOpen,
  Users2,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchAndFilter } from "./renderSearchAndFilter";

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

const EventLists = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatusRibbon = (status: Event['status']) => {
    if (!status) return null;

    const statusColor = {
      ongoing: "from-green-500 to-green-600",
      completed: "from-blue-500 to-blue-600",
      cancelled: "from-red-500 to-red-600",
      upcoming: "from-yellow-500 to-yellow-600"
    }[status];

    return (
      <div className="absolute -right-[40px] top-[20px] z-20 w-[170px] transform rotate-45 overflow-hidden">
        <div
          className={`py-1.5 text-center bg-gradient-to-r ${statusColor} text-white text-xs font-semibold uppercase tracking-wider shadow-lg`}
        >
          {status}
        </div>
      </div>
    );
  };

  const handleLearnMore = (id: string) => {
    navigate(`/events/${id}`);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const res = await axios.get<{ data: Event[] }>("http://localhost:5000/api/events", {
          withCredentials: true,
        });
        
        setEvents(res.data.data);
        setFilteredEvents(res.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // More specific error handling for unauthorized access
            setError("Your session has expired. Please log in again.");
            setTimeout(() => navigate("/login"), 2000); // Give user time to see the message
            return;
          }
          
          // Handle other HTTP errors
          if (error.response) {
            setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Please try again later'}`);
          } else if (error.request) {
            setError("Network error - please check your connection");
          } else {
            setError("Failed to fetch events. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred");
        }
        
        console.error("Event fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllEvents();
  }, [navigate]);

  useEffect(() => {
    let result = [...events];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.impact.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation) {
      result = result.filter((event) =>
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Date filter
    if (selectedDate) {
      result = result.filter(
        (event) =>
          new Date(event.date).toDateString() === selectedDate.toDateString()
      );
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter(
        (event) => event.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    setFilteredEvents(result);
  }, [searchQuery, selectedLocation, selectedDate, selectedStatus, events]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedDate(null);
    setSelectedStatus("");
  };

  const getCategoryIcon = (category: Event['category']) => {
    const icons = {
      environment: <Leaf className="w-4 h-4" />,
      healthcare: <HeartHandshake className="w-4 h-4" />,
      cleaning: <Trash className="w-4 h-4" />,
      education: <BookOpen className="w-4 h-4" />,
      social: <Users2 className="w-4 h-4" />,
      other: <Globe className="w-4 h-4" />
    };
    return icons[category] || <Globe className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        {SearchAndFilter({
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
        })}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center">
        {SearchAndFilter({
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
        })}
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {SearchAndFilter({
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
        })}

        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
          Community Drives Near You
        </h1>
        <p className="text-xl text-green-700 mb-12 text-center max-w-3xl mx-auto">
          Join hands with fellow volunteers and make a positive impact on our
          environment. Every action counts!
        </p>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-xl">
                No events found matching your criteria
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card
                key={event._id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-green-200 bg-white group h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                <img
  src={
    event.image
      ? `http://localhost:5000/uploads/${event.image.split('/').pop()}`
      : "https://img.freepik.com/premium-photo/world-charity-day-backgrounds_1198941-10278.jpg?w=740"
  }
  alt={event.title}
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://img.freepik.com/premium-photo/world-charity-day-backgrounds_1198941-10278.jpg?w=740";
  }}
/>
                  {getStatusRibbon(event.status)}
                </div>

                <CardContent className="p-6 flex-grow">
                  <Badge
                    className="mb-2 bg-green-100 text-green-800 hover:bg-green-200"
                    variant="secondary"
                  >
                    {getCategoryIcon(event.category)}
                    <span className="ml-1 capitalize">{event.category}</span>
                  </Badge>
                  <h3 className="text-xl font-bold text-green-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-green-700 mb-4 line-clamp-3">{event.description}</p>
                  <div className="space-y-2 text-sm text-green-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      {event.registeredVolunteers.length}/{event.requiredVolunteers} volunteers
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 bg-green-50 mt-auto">
                  <Button
                    onClick={() => handleLearnMore(event._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {event.status === "ongoing" || event.status === "upcoming"
                      ? "Learn More"
                      : "Event Completed or Cancelled"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLists;