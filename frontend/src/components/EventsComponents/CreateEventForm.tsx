import { FC, useState, FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPinIcon, UsersIcon, ImageIcon, SparklesIcon, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16) // Format: "YYYY-MM-DDThh:mm"
}

const CreateEventForm: FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    image: null as File | null,
    requiredVolunteers: '',
    impact: ''
  })

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      const formattedDate = formData.date ? new Date(formData.date).toISOString() : ''
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          submitData.append(key, value)
        } else if (typeof value === 'string') {
          submitData.append(key, value)
        }
      })

      await axios.post(
        'http://localhost:5000/api/events',
        submitData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      toast.success('Event created successfully!')
      navigate('/events')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to create event')
        if (err.response?.status === 401) {
          navigate('/login')
        }
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "cleaning",
    "education",
    "healthcare",
    "environment",
    "social",
    "other"
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create Your Event
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Craft an unforgettable experience that inspires and engages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider">
                  Event Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  placeholder="Enter captivating event title"
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider">
                  Category
                </Label>
                <Select name="category" value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-200/80 shadow-lg">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        className="hover:bg-indigo-50 focus:bg-indigo-50 rounded-lg transition-colors"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all min-h-[120px]"
                  placeholder="Describe your event in vivid detail..."
                />
              </div>

              {/* Date and Time */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  Date and Time
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all justify-start text-left font-normal",
                        !formData.date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                      {formData.date ? format(new Date(formData.date), "PPP") : <span>Select event date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl border border-gray-200/80 shadow-lg">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={(date) => handleInputChange('date', date ? date.toISOString() : '')}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-indigo-600" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter event location"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Event Image */}
              <div className="space-y-3">
                <Label htmlFor="image" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  Event Image
                </Label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <span className="sr-only">Choose event image</span>
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                    />
                  </label>
                </div>
              </div>

              {/* Required Volunteers */}
              <div className="space-y-3">
                <Label htmlFor="requiredVolunteers" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-indigo-600" />
                  Required Volunteers
                </Label>
                <Input
                  id="requiredVolunteers"
                  type="number"
                  name="requiredVolunteers"
                  value={formData.requiredVolunteers}
                  onChange={(e) => handleInputChange('requiredVolunteers', e.target.value)}
                  min="1"
                  placeholder="Enter number of volunteers needed"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Impact */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="impact" className="text-sm font-semibold text-gray-700/90 uppercase tracking-wider flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-indigo-600" />
                  Impact
                </Label>
                <Textarea
                  id="impact"
                  name="impact"
                  value={formData.impact}
                  onChange={(e) => handleInputChange('impact', e.target.value)}
                  rows={4}
                  placeholder="Describe the positive impact of this event..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all min-h-[100px]"
                />
              </div>
            </div>

            <Separator className="my-8 bg-gray-200/60" />

            <Button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 rounded-xl font-bold text-lg tracking-wide
                hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl
                disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </span>
              ) : (
                <>
                  Create Inspiring Event
                  <span className="absolute right-6 group-hover:right-4 transition-all duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateEventForm