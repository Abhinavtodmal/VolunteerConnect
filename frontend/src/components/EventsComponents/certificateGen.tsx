

import  { useState, useRef, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VolunteerCertificateGenerator() {
  const [name, setName] = useState('')
  const [hours, setHours] = useState('')
  const [organization, setOrganization] = useState('')
  const [date, setDate] = useState('')

  const certificateCanvasRef = useRef<HTMLCanvasElement>(null)
  const badgeCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (name && hours && organization && date) {
      generateCertificate()
      generateBadge()
    }
  }, [name, hours, organization, date])

  const generateCertificate = () => {
    const canvas = certificateCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background color
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add border
    ctx.strokeStyle = '#4f46e5'
    ctx.lineWidth = 15
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Add title
    ctx.font = 'bold 40px Arial'
    ctx.fillStyle = '#1f2937'
    ctx.textAlign = 'center'
    ctx.fillText('Certificate of Appreciation', canvas.width / 2, 100)

    // Add content
    ctx.font = '24px Arial'
    ctx.fillStyle = '#4b5563'
    ctx.fillText(`This certificate is presented to`, canvas.width / 2, 160)
    
    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#1f2937'
    ctx.fillText(name, canvas.width / 2, 220)

    ctx.font = '24px Arial'
    ctx.fillStyle = '#4b5563'
    ctx.fillText(`for dedicating ${hours} hours of volunteer service`, canvas.width / 2, 280)
    ctx.fillText(`to ${organization}`, canvas.width / 2, 320)
    ctx.fillText(`on ${date}`, canvas.width / 2, 360)

    // Add signature line
    ctx.beginPath()
    ctx.moveTo(150, 440)
    ctx.lineTo(450, 440)
    ctx.stroke()

    ctx.font = '18px Arial'
    ctx.fillText('Authorized Signature', 300, 470)
  }

  const generateBadge = () => {
    const canvas = badgeCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background color
    ctx.fillStyle = '#4f46e5'
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
    ctx.fill()

    // Add border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, Math.PI * 2)
    ctx.stroke()

    // Add text
    ctx.font = 'bold 24px Arial'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText('VOLUNTEER', canvas.width / 2, canvas.height / 2 - 20)
    ctx.font = '18px Arial'
    ctx.fillText(`${hours} HOURS`, canvas.width / 2, canvas.height / 2 + 20)
  }

  const downloadCertificate = () => {
    const canvas = certificateCanvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${name.replace(' ', '_')}_volunteer_certificate.png`)
      }
    })
  }

  const downloadBadge = () => {
    const canvas = badgeCanvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${name.replace(' ', '_')}_volunteer_badge.png`)
      }
    })
  }

  // ... (keep all the imports and JavaScript code exactly the same)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <CardTitle className="text-3xl font-bold text-white text-center">
            Volunteer Certificate & Badge Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-800 font-medium">
                  Volunteer Name
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter volunteer's name"
                  className="border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 rounded-lg py-3 px-4 text-gray-700 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours" className="text-blue-800 font-medium">
                  Volunteer Hours
                </Label>
                <Input 
                  id="hours" 
                  value={hours} 
                  onChange={(e) => setHours(e.target.value)} 
                  placeholder="Enter number of hours"
                  className="border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 rounded-lg py-3 px-4 text-gray-700 shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-blue-800 font-medium">
                Organization Name
              </Label>
              <Input 
                id="organization" 
                value={organization} 
                onChange={(e) => setOrganization(e.target.value)} 
                placeholder="Enter organization name"
                className="border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 rounded-lg py-3 px-4 text-gray-700 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-blue-800 font-medium">
                Date
              </Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 rounded-lg py-3 px-4 text-gray-700 shadow-sm"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-6 p-6 bg-gradient-to-b from-white to-blue-50">
          <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-md border border-blue-100">
            <canvas 
              ref={certificateCanvasRef} 
              width={600} 
              height={500} 
              className="w-full h-auto border-2 border-blue-200 rounded-lg"
            />
          </div>
          <div className="w-full max-w-[200px] bg-white p-4 rounded-full shadow-md border border-blue-100">
            <canvas 
              ref={badgeCanvasRef} 
              width={200} 
              height={200} 
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button 
              onClick={downloadCertificate} 
              disabled={!name || !hours || !organization || !date}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Download Certificate
            </Button>
            <Button 
              onClick={downloadBadge} 
              disabled={!name || !hours || !organization || !date}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Download Badge
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
