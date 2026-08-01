import { Search, Mail, Archive, AlertTriangle, CornerUpLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export default function ContactSubmissionsPage() {
  const submissions = [
    {
      id: 1,
      name: 'Mark Smith',
      email: 'mark.smith@techcorp.com',
      subject: 'Consultation',
      message: 'Hi Ian, I am looking to schedule a consultation regarding intellectual property rights for a new software product we are launching across East Africa. Let me know your availability.',
      date: 'Today, 10:23 AM',
      status: 'New',
    },
    {
      id: 2,
      name: 'Elena Rodriguez',
      email: 'elena@startup.io',
      subject: 'Partnership',
      message: 'We are a legal tech startup based in London looking for regional partners in Kenya. Would love to discuss a potential collaboration.',
      date: 'Yesterday, 3:45 PM',
      status: 'Read',
    },
    {
      id: 3,
      name: 'Business Daily Media',
      email: 'editor@businessdaily.com',
      subject: 'Media Inquiry',
      message: 'We would like to request an interview regarding your recent post on cross-border M&A trends.',
      date: 'Oct 10, 2026',
      status: 'Responded',
    },
    {
      id: 4,
      name: 'John Doe',
      email: 'johndoe123@gmail.com',
      subject: 'General',
      message: 'Can you help me with a traffic ticket?',
      date: 'Oct 05, 2026',
      status: 'Archived',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="sm:flex sm:items-center sm:justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Contact Submissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Inbox for all inquiries submitted through the website contact form.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:px-6 border-b border-gray-100 gap-4 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              name="search"
              id="search"
              className="pl-9"
              placeholder="Search messages..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="All Topics">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Topics">All Topics</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Inbox List */}
          <div className="w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
            <ul role="list" className="divide-y divide-gray-100">
              {submissions.map((submission) => (
                <li 
                  key={submission.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    submission.id === 1 ? 'bg-white border-l-4 border-l-gold' : 'hover:bg-gray-100 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm ${submission.status === 'New' ? 'font-bold text-navy' : 'font-medium text-gray-900'}`}>
                      {submission.name}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{submission.date}</span>
                  </div>
                  <p className={`text-sm mb-1 ${submission.status === 'New' ? 'font-semibold text-navy' : 'text-gray-700'}`}>
                    {submission.subject}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {submission.message}
                  </p>
                  <div className="mt-2">
                    <Badge variant={submission.status === 'New' ? 'default' : 'secondary'} className={`font-medium ${
                      submission.status === 'New' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                      submission.status === 'Read' ? 'bg-gray-100 text-gray-600' :
                      submission.status === 'Responded' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {submission.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Message Detail view */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-br-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" title="Archive" className="text-gray-400 hover:text-navy hover:bg-gray-50">
                  <Archive className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" title="Mark as Spam" className="text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <AlertTriangle className="h-5 w-5" />
                </Button>
              </div>
              <Button className="bg-navy text-white hover:bg-navy/90">
                <CornerUpLeft className="mr-2 h-4 w-4 text-gold" />
                Reply
              </Button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-navy mb-4">Consultation</h2>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-xl">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-navy text-lg">{submissions[0].name}</p>
                      <p className="text-sm text-gray-500">{submissions[0].email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{submissions[0].date}</span>
                </div>
              </div>
              
              <div className="prose prose-sm sm:prose lg:prose-lg text-gray-700 max-w-none">
                <p>Hi Ian,</p>
                <p>I am looking to schedule a consultation regarding intellectual property rights for a new software product we are launching across East Africa.</p>
                <p>We are specifically concerned about the differences in patent laws between Kenya, Rwanda, and Uganda.</p>
                <p>Let me know your availability for a brief introductory call next week.</p>
                <p>Best regards,<br/>Mark Smith<br/>TechCorp Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
