import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Availability = 
  "Full-time" | 
  "Part-time" | 
  "Weekends only" | 
  "Evenings only" | 
  "Flexible";

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  availability: Availability;
  appliedAt: string | Date;
  skills: string;
  experience: string;
  motivation: string;
}

interface VolunteerListProps {
  eventId: string;
}

const VolunteerList: React.FC<VolunteerListProps> = ({ eventId }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get<{ data: Volunteer[] }>(
          `http://localhost:5000/api/events/${eventId}/volunteer`,
          { withCredentials: true }
        );
        setVolunteers(response.data.data);
      } catch (err) {
        setError("Failed to load volunteers");
        console.error("Error fetching volunteers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          Total Volunteers: {volunteers.length}
        </h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((volunteer) => (
            <TableRow key={volunteer._id}>
              <TableCell className="font-medium">{volunteer.name}</TableCell>
              <TableCell>{volunteer.email}</TableCell>
              <TableCell>{volunteer.availability}</TableCell>
              <TableCell>
                {new Date(volunteer.appliedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{volunteer.skills}</TableCell>
              <TableCell>{volunteer.experience}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {volunteers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No volunteers have signed up yet.
        </div>
      )}
    </div>
  );
};

export default VolunteerList;