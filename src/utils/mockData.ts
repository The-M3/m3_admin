// Mock data for users
export const mockUsers = [{
  id: '1',
  name: 'John Smith',
  email: 'john.smith@example.com',
  role: 'Admin',
  status: 'Active',
  lastActive: 'Today at 2:34 PM'
}, {
  id: '2',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  role: 'Editor',
  status: 'Active',
  lastActive: 'Today at 11:20 AM'
}, {
  id: '3',
  name: 'Michael Brown',
  email: 'michael.brown@example.com',
  role: 'Viewer',
  status: 'Inactive',
  lastActive: 'Yesterday at 3:45 PM'
}, {
  id: '4',
  name: 'Emily Davis',
  email: 'emily.davis@example.com',
  role: 'Editor',
  status: 'Active',
  lastActive: 'Today at 9:12 AM'
}, {
  id: '5',
  name: 'Robert Wilson',
  email: 'robert.wilson@example.com',
  role: 'Viewer',
  status: 'Active',
  lastActive: 'Yesterday at 5:30 PM'
}, {
  id: '6',
  name: 'Jennifer Taylor',
  email: 'jennifer.taylor@example.com',
  role: 'Admin',
  status: 'Active',
  lastActive: 'Today at 10:45 AM'
}, {
  id: '7',
  name: 'David Martinez',
  email: 'david.martinez@example.com',
  role: 'Editor',
  status: 'Inactive',
  lastActive: '3 days ago'
}, {
  id: '8',
  name: 'Lisa Anderson',
  email: 'lisa.anderson@example.com',
  role: 'Viewer',
  status: 'Active',
  lastActive: 'Today at 1:15 PM'
}, {
  id: '9',
  name: 'James Thomas',
  email: 'james.thomas@example.com',
  role: 'Editor',
  status: 'Active',
  lastActive: 'Yesterday at 11:30 AM'
}, {
  id: '10',
  name: 'Patricia White',
  email: 'patricia.white@example.com',
  role: 'Viewer',
  status: 'Inactive',
  lastActive: '1 week ago'
}, {
  id: '11',
  name: 'Richard Harris',
  email: 'richard.harris@example.com',
  role: 'Admin',
  status: 'Active',
  lastActive: 'Today at 8:30 AM'
}, {
  id: '12',
  name: 'Linda Clark',
  email: 'linda.clark@example.com',
  role: 'Editor',
  status: 'Active',
  lastActive: 'Yesterday at 2:00 PM'
}];

// Mock data for events (matching Event interface from types.ts)
export const mockEventsData = [{
  id: '1',
  title: 'Annual Tech Conference 2024',
  location: 'San Francisco Convention Center',
  startDateTime: new Date('2024-03-15T09:00:00'),
  timezone: 'PST',
  description: 'Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities.',
  speakers: ['John Doe', 'Jane Smith', 'Alex Johnson'],
  isVirtual: false,
  ticketLink: 'https://tickets.example.com/tech-conf-2024',
  hasEnded: false,
  created_at: new Date('2024-01-15T10:00:00'),
  updated_at: new Date('2024-02-01T14:30:00')
}, {
  id: '2',
  title: 'Virtual Product Launch',
  location: 'Online Event',
  startDateTime: new Date('2024-02-28T14:00:00'),
  timezone: 'EST',
  description: 'Exclusive virtual launch event for our latest product line. Get first access to new features and special pricing.',
  speakers: ['Sarah Wilson', 'Mike Chen'],
  isVirtual: true,
  ticketLink: 'https://tickets.example.com/product-launch',
  hasEnded: true,
  created_at: new Date('2024-01-10T09:00:00'),
  updated_at: new Date('2024-02-25T16:00:00')
}, {
  id: '3',
  title: 'Developer Workshop: React Best Practices',
  location: 'Austin Tech Hub',
  startDateTime: new Date('2024-04-10T10:00:00'),
  timezone: 'CST',
  description: 'Hands-on workshop covering advanced React patterns, performance optimization, and modern development practices.',
  speakers: ['Emma Davis', 'Tom Rodriguez'],
  isVirtual: false,
  hasEnded: false,
  created_at: new Date('2024-02-01T11:00:00'),
  updated_at: new Date('2024-02-15T13:45:00')
}, {
  id: '4',
  title: 'Customer Success Webinar',
  location: 'Zoom Meeting',
  startDateTime: new Date('2024-03-05T15:00:00'),
  timezone: 'EST',
  description: 'Learn how our top customers are achieving success with our platform. Real case studies and actionable insights.',
  speakers: ['Lisa Park', 'David Kim'],
  isVirtual: true,
  hasEnded: false,
  created_at: new Date('2024-01-20T08:30:00'),
  updated_at: new Date('2024-02-28T10:15:00')
}, {
  id: '5',
  title: 'AI & Machine Learning Summit',
  location: 'Seattle Convention Center',
  startDateTime: new Date('2024-05-20T08:30:00'),
  timezone: 'PST',
  description: 'Explore the latest trends in AI and ML with industry experts. Deep dive sessions on practical applications and future trends.',
  speakers: ['Dr. Amanda Foster', 'Prof. James Liu', 'Rachel Green'],
  isVirtual: false,
  ticketLink: 'https://tickets.example.com/ai-summit-2024',
  hasEnded: false,
  created_at: new Date('2024-01-05T12:00:00'),
  updated_at: new Date('2024-02-20T09:30:00')
}];

// Legacy mock events data (keeping for backward compatibility)
export const mockEvents = [{
  id: '1',
  name: 'Annual Conference 2023',
  date: 'Jun 15, 2023',
  location: 'San Francisco, CA',
  attendees: 450,
  status: 'Completed'
}, {
  id: '2',
  name: 'Product Launch: Version 2.0',
  date: 'Jul 22, 2023',
  location: 'New York, NY',
  attendees: 320,
  status: 'Completed'
}, {
  id: '3',
  name: 'Developer Workshop',
  date: 'Aug 10, 2023',
  location: 'Austin, TX',
  attendees: 85,
  status: 'Completed'
}, {
  id: '4',
  name: 'Customer Appreciation Day',
  date: 'Sep 5, 2023',
  location: 'Chicago, IL',
  attendees: 210,
  status: 'Completed'
}, {
  id: '5',
  name: 'Tech Summit 2023',
  date: 'Oct 18-20, 2023',
  location: 'Seattle, WA',
  attendees: 620,
  status: 'Upcoming'
}, {
  id: '6',
  name: 'Holiday Networking Event',
  date: 'Dec 12, 2023',
  location: 'Boston, MA',
  attendees: 175,
  status: 'Upcoming'
}, {
  id: '7',
  name: 'Q4 Planning Meeting',
  date: 'Today',
  location: 'Virtual',
  attendees: 42,
  status: 'Live'
}, {
  id: '8',
  name: 'User Research Sessions',
  date: 'Tomorrow',
  location: 'Virtual',
  attendees: 30,
  status: 'Upcoming'
}, {
  id: '9',
  name: 'Partner Showcase',
  date: 'Nov 29, 2023',
  location: 'Los Angeles, CA',
  attendees: 280,
  status: 'Upcoming'
}, {
  id: '10',
  name: 'Industry Panel Discussion',
  date: 'Dec 5, 2023',
  location: 'Denver, CO',
  attendees: 120,
  status: 'Upcoming'
}, {
  id: '11',
  name: 'Summer Hackathon',
  date: 'Jul 8-10, 2023',
  location: 'Miami, FL',
  attendees: 95,
  status: 'Cancelled'
}, {
  id: '12',
  name: 'New Year Planning Session',
  date: 'Jan 15, 2024',
  location: 'Phoenix, AZ',
  attendees: 85,
  status: 'Upcoming'
}];