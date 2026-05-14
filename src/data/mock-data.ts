/* ─── Types ─── */

export type UserRole = "organiser" | "exhibitor" | "visitor" | "sponsor" | "vendor";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRole[]; // all assigned roles
  role: UserRole;    // currently active role
  avatar: string;    // initials
  company?: string;
};

export type MockEvent = {
  id: string;
  title: string;
  description: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed" | "draft";
  exhibitors: number;
  visitors: number;
  booths: number;
  image: string; // gradient placeholder
};

export type RoleFeature = {
  role: string;
  tagline: string;
  highlights: string[];
  icon: string; // emoji placeholder – swap for SVG/icon lib later
};

export type Stat = {
  label: string;
  value: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string; // initials
};

export type Feature = {
  title: string;
  description: string;
};

export type Booth = {
  id: string;
  hall: string;
  size: string;
  price: string;
  status: "available" | "reserved";
};

export type Lead = {
  id: string;
  contact: string;
  company: string;
  interest: string;
  score: "Hot" | "Warm" | "Cold";
};

export type Exhibitor = {
  id: string;
  name: string;
  industry: string;
  location: string;
  shortDescription: string;
};

/* ─── Event-level exhibitor & visitor types ─── */

export type ExhibitorStatus = "pending" | "approved" | "ignored" | "payment_pending" | "activated";

export type EventExhibitor = {
  id: string;
  eventId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  boothType: string;
  boothNumber: string;
  industry: string;
  avatar: string;
  status: ExhibitorStatus;
  appliedDate: string;
  paymentDeadline?: string; // set on approval
  paidDate?: string;
};

export type BadgeStatus = "not_sent" | "sent";

export type BoothStatus = "empty" | "pending" | "approved" | "payment_pending" | "booked";

export type EventBooth = {
  boothNumber: string;
  eventId: string;
  hall: string;
  boothType: string;
  status: BoothStatus;
  orders: number; // number of exhibitor applications for this booth
};

export type EventVisitor = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  active: boolean;
  badgeStatus: BadgeStatus;
  badgeSentDate?: string;
  registeredDate: string;
};

/* ─── Exhibitor booking types ─── */

export type BoothStyle = "bare_space" | "shell_scheme";
export type BoothPosition = "corner" | "middle" | "island" | "end_cap";
export type BookingStatus = "pending" | "payment_pending" | "confirmed" | "rejected" | "cancelled";

export type ExhibitorBooking = {
  id: string;
  userId: string;
  eventId: string;
  boothStyle: BoothStyle;
  boothPosition: BoothPosition;
  sqMeters: number;
  hallPreference: string;
  specialRequirements?: string;
  status: BookingStatus;
  submittedDate: string;
  approvedDate?: string;
  rejectedReason?: string;
  totalPrice: string;
};

export type ExhibitorProduct = {
  id: string;
  userId: string;
  eventId: string;
  name: string;
  category: string;
  description: string;
  image: string; // gradient placeholder
};

export type ExhibitorSponsor = {
  id: string;
  userId: string;
  eventId: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  companyName: string;
  amount: string;
  status: "active" | "pending" | "rejected";
  rejectedReason?: string;
};

export type ExhibitorLead = {
  id: string;
  userId: string;
  eventId: string;
  visitorName: string;
  visitorEmail: string;
  visitorCompany: string;
  interest: string;
  score: "Hot" | "Warm" | "Cold";
  capturedDate: string;
  notes?: string;
};

/* ─── Employee types ─── */

export type EmployeeStatus = "active" | "inactive" | "on_leave";
export type EmployeeRole = "admin" | "manager" | "coordinator" | "executive" | "intern";

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string; // initials
  department: string;
  designation: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  joinDate: string;
  location: string;
  reportingTo?: string;
};

/* ─── Mock Employees ─── */

export const mockEmployees: Employee[] = [
  { id: "EMP-001", name: "Arjun Mehta",      email: "arjun.mehta@fingoh.ai",     phone: "+91 98200 11001", avatar: "AM", department: "Leadership",   designation: "Chief Executive Officer",      role: "admin",       status: "active",   joinDate: "15 Jan 2018", location: "Mumbai",    reportingTo: undefined },
  { id: "EMP-002", name: "Priya Sharma",     email: "priya.sharma@fingoh.ai",     phone: "+91 98200 11002", avatar: "PS", department: "Leadership",   designation: "Chief Operating Officer",      role: "admin",       status: "active",   joinDate: "20 Feb 2018", location: "Mumbai",    reportingTo: "Arjun Mehta" },
  { id: "EMP-003", name: "Rahul Gupta",      email: "rahul.gupta@fingoh.ai",      phone: "+91 98200 11003", avatar: "RG", department: "Sales",        designation: "VP — Sales & Partnerships",    role: "manager",     status: "active",   joinDate: "10 Mar 2019", location: "Delhi NCR", reportingTo: "Arjun Mehta" },
  { id: "EMP-004", name: "Sneha Iyer",       email: "sneha.iyer@fingoh.ai",       phone: "+91 98200 11004", avatar: "SI", department: "Marketing",    designation: "Head of Marketing",            role: "manager",     status: "active",   joinDate: "05 Jun 2019", location: "Mumbai",    reportingTo: "Priya Sharma" },
  { id: "EMP-005", name: "Karan Joshi",      email: "karan.joshi@fingoh.ai",      phone: "+91 98200 11005", avatar: "KJ", department: "Technology",   designation: "Engineering Lead",             role: "manager",     status: "active",   joinDate: "12 Aug 2019", location: "Bengaluru", reportingTo: "Priya Sharma" },
  { id: "EMP-006", name: "Meera Nair",       email: "meera.nair@fingoh.ai",       phone: "+91 98200 11006", avatar: "MN", department: "Finance",      designation: "Finance Manager",              role: "manager",     status: "active",   joinDate: "01 Nov 2019", location: "Mumbai",    reportingTo: "Arjun Mehta" },
  { id: "EMP-007", name: "Aditya Rao",       email: "aditya.rao@fingoh.ai",       phone: "+91 98200 11007", avatar: "AR", department: "Sales",        designation: "Senior Sales Executive",       role: "executive",   status: "active",   joinDate: "14 Jan 2020", location: "Delhi NCR", reportingTo: "Rahul Gupta" },
  { id: "EMP-008", name: "Divya Krishnan",   email: "divya.krishnan@fingoh.ai",   phone: "+91 98200 11008", avatar: "DK", department: "Marketing",    designation: "Digital Marketing Executive",  role: "executive",   status: "active",   joinDate: "03 Mar 2020", location: "Mumbai",    reportingTo: "Sneha Iyer" },
  { id: "EMP-009", name: "Vikram Singh",     email: "vikram.singh@fingoh.ai",     phone: "+91 98200 11009", avatar: "VS", department: "Technology",   designation: "Backend Engineer",             role: "executive",   status: "active",   joinDate: "22 Apr 2020", location: "Bengaluru", reportingTo: "Karan Joshi" },
  { id: "EMP-010", name: "Anita Desai",      email: "anita.desai@fingoh.ai",      phone: "+91 98200 11010", avatar: "AD", department: "HR",           designation: "HR Manager",                   role: "manager",     status: "active",   joinDate: "10 Jun 2020", location: "Mumbai",    reportingTo: "Priya Sharma" },
  { id: "EMP-011", name: "Rohit Verma",      email: "rohit.verma@fingoh.ai",      phone: "+91 98200 11011", avatar: "RV", department: "Technology",   designation: "Frontend Engineer",            role: "executive",   status: "on_leave", joinDate: "18 Jul 2020", location: "Bengaluru", reportingTo: "Karan Joshi" },
  { id: "EMP-012", name: "Nisha Patel",      email: "nisha.patel@fingoh.ai",      phone: "+91 98200 11012", avatar: "NP", department: "Sales",        designation: "Sales Coordinator",            role: "coordinator", status: "active",   joinDate: "02 Sep 2020", location: "Delhi NCR", reportingTo: "Rahul Gupta" },
  { id: "EMP-013", name: "Suresh Kumar",     email: "suresh.kumar@fingoh.ai",     phone: "+91 98200 11013", avatar: "SK", department: "Operations",   designation: "Operations Manager",           role: "manager",     status: "active",   joinDate: "15 Oct 2020", location: "Mumbai",    reportingTo: "Priya Sharma" },
  { id: "EMP-014", name: "Lakshmi Rajan",    email: "lakshmi.rajan@fingoh.ai",    phone: "+91 98200 11014", avatar: "LR", department: "Finance",      designation: "Accounts Executive",           role: "executive",   status: "active",   joinDate: "07 Jan 2021", location: "Mumbai",    reportingTo: "Meera Nair" },
  { id: "EMP-015", name: "Abhishek Tiwari",  email: "abhishek.tiwari@fingoh.ai",  phone: "+91 98200 11015", avatar: "AT", department: "Technology",   designation: "DevOps Engineer",              role: "executive",   status: "active",   joinDate: "19 Feb 2021", location: "Bengaluru", reportingTo: "Karan Joshi" },
  { id: "EMP-016", name: "Pallavi Menon",    email: "pallavi.menon@fingoh.ai",    phone: "+91 98200 11016", avatar: "PM", department: "Marketing",    designation: "Content Strategist",           role: "coordinator", status: "active",   joinDate: "05 Apr 2021", location: "Mumbai",    reportingTo: "Sneha Iyer" },
  { id: "EMP-017", name: "Girish Nanda",     email: "girish.nanda@fingoh.ai",     phone: "+91 98200 11017", avatar: "GN", department: "Operations",   designation: "Event Coordinator",            role: "coordinator", status: "inactive", joinDate: "12 Jun 2021", location: "Delhi NCR", reportingTo: "Suresh Kumar" },
  { id: "EMP-018", name: "Tanvi Shah",       email: "tanvi.shah@fingoh.ai",       phone: "+91 98200 11018", avatar: "TS", department: "HR",           designation: "HR Executive",                 role: "executive",   status: "active",   joinDate: "08 Aug 2021", location: "Mumbai",    reportingTo: "Anita Desai" },
  { id: "EMP-019", name: "Manish Kapoor",    email: "manish.kapoor@fingoh.ai",    phone: "+91 98200 11019", avatar: "MK", department: "Sales",        designation: "Business Development Intern",  role: "intern",      status: "active",   joinDate: "03 Jan 2022", location: "Delhi NCR", reportingTo: "Rahul Gupta" },
  { id: "EMP-020", name: "Deepika Reddy",    email: "deepika.reddy@fingoh.ai",    phone: "+91 98200 11020", avatar: "DR", department: "Technology",   designation: "QA Engineer",                  role: "executive",   status: "on_leave", joinDate: "21 Mar 2022", location: "Bengaluru", reportingTo: "Karan Joshi" },
  { id: "EMP-021", name: "Harish Balasubramanian", email: "harish.b@fingoh.ai",   phone: "+91 98200 11021", avatar: "HB", department: "Technology",   designation: "Mobile Developer",             role: "executive",   status: "active",   joinDate: "14 May 2022", location: "Bengaluru", reportingTo: "Karan Joshi" },
  { id: "EMP-022", name: "Smita Walke",      email: "smita.walke@fingoh.ai",      phone: "+91 98200 11022", avatar: "SW", department: "Marketing",    designation: "Marketing Intern",             role: "intern",      status: "active",   joinDate: "01 Jul 2022", location: "Mumbai",    reportingTo: "Sneha Iyer" },
];

/* ─── Mock Users (credentials for all roles) ─── */

export const mockUsers: MockUser[] = [
  { id: "U-001", name: "Nagaraj Jayaraman", email: "nagaraj@etti.tech", password: "etti", roles: ["organiser", "exhibitor", "visitor"], role: "organiser", avatar: "NJ", company: "Etti Technologies" },
  { id: "U-002", name: "Priya Sharma", email: "priya@organiser.com", password: "etti", roles: ["organiser"], role: "organiser", avatar: "PS", company: "Nexa Systems" },
  { id: "U-003", name: "Alex Walker", email: "alex@exhibitor.com", password: "etti", roles: ["exhibitor"], role: "exhibitor", avatar: "AW" },
  { id: "U-004", name: "Raam Kumar", email: "raam@visitor.com", password: "etti", roles: ["visitor"], role: "visitor", avatar: "RK", company: "VoltGrid" },
  { id: "U-005", name: "Fingoh Admin", email: "admin@fingoh.ai", password: "etti", roles: ["organiser", "exhibitor", "visitor"], role: "exhibitor", avatar: "ET", company: "Fingoh Technologies" },
];

/* ─── Mock Events ─── */

export const mockEvents: MockEvent[] = [
  {
    id: "EVT-001",
    title: "Stainless Steel Promach Expo",
    description: "Stainless Steel Process Engineering & Plant Machinery Expo is India’s only dedicated platform focused exclusively on stainless steel-based technologies for the process industry. From advanced plant systems and engineering solutions to high-performance machinery, the expo brings together the full spectrum of stakeholders who depend on stainless steel for its unmatched hygiene, durability, and corrosion resistance.",
    venue: "BEC",
    city: "Mumbai",
    startDate: "2027-09-16",
    endDate: "2027-09-18",
    status: "upcoming",
    exhibitors: 240,
    visitors: 12000,
    booths: 320,
    image: "from-indigo-500 to-purple-600",
  },
  {
    id: "EVT-002",
    title: "GreenBuild Summit",
    description: "Sustainable construction and green energy trade fair for the building industry.",
    venue: "RAI Amsterdam",
    city: "Amsterdam",
    startDate: "2025-07-01",
    endDate: "2025-07-03",
    status: "live",
    exhibitors: 180,
    visitors: 8500,
    booths: 210,
    image: "from-emerald-500 to-teal-600",
  },
  {
    id: "EVT-003",
    title: "AutoDrive World",
    description: "International autonomous driving and mobility technology trade fair.",
    venue: "Messe Berlin",
    city: "Berlin",
    startDate: "2025-03-10",
    endDate: "2025-03-12",
    status: "completed",
    exhibitors: 310,
    visitors: 18000,
    booths: 400,
    image: "from-orange-500 to-red-600",
  },
  {
    id: "EVT-004",
    title: "HealthTech Connect",
    description: "Medical devices, biotech and healthcare IT trade fair bringing together global health innovators.",
    venue: "Singapore Expo",
    city: "Singapore",
    startDate: "2025-09-22",
    endDate: "2025-09-25",
    status: "upcoming",
    exhibitors: 150,
    visitors: 6200,
    booths: 180,
    image: "from-cyan-500 to-blue-600",
  },
  {
    id: "EVT-005",
    title: "PackLogix International",
    description: "Packaging, logistics and supply chain trade fair with live machinery demonstrations.",
    venue: "McCormick Place",
    city: "Chicago",
    startDate: "2025-11-05",
    endDate: "2025-11-08",
    status: "draft",
    exhibitors: 0,
    visitors: 0,
    booths: 260,
    image: "from-violet-500 to-fuchsia-600",
  },
  {
    id: "EVT-006",
    title: "FoodPro Asia",
    description: "Food processing, packaging and agritech trade fair for the Asia-Pacific region.",
    venue: "BITEC Bangkok",
    city: "Bangkok",
    startDate: "2025-06-12",
    endDate: "2025-06-14",
    status: "completed",
    exhibitors: 200,
    visitors: 9800,
    booths: 250,
    image: "from-amber-500 to-orange-600",
  },
];

/* ─── Mock Event Exhibitors ─── */

export const mockEventExhibitors: EventExhibitor[] = [
  { id: "EEXH-001", eventId: "EVT-001", name: "Rahul Gupta", company: "Nexa Systems", email: "rahul@nexasystems.io", phone: "+91-98765-43210", boothType: "Premium 10x10", boothNumber: "A-12", industry: "Industrial IoT", avatar: "RG", status: "pending", appliedDate: "2025-06-20" },
  { id: "EEXH-002", eventId: "EVT-001", name: "Elena Vasquez", company: "VoltGrid", email: "elena@voltgrid.eu", phone: "+31-612-345678", boothType: "Standard 6x6", boothNumber: "B-04", industry: "Energy Tech", avatar: "EV", status: "approved", appliedDate: "2025-06-18", paymentDeadline: "2025-07-18" },
  { id: "EEXH-003", eventId: "EVT-001", name: "Tom Henderson", company: "Aria Mobility", email: "tom@ariamobility.se", phone: "+46-70-1234567", boothType: "Premium 10x10", boothNumber: "A-08", industry: "Mobility", avatar: "TH", status: "activated", appliedDate: "2025-06-15", paymentDeadline: "2025-07-15", paidDate: "2025-07-01" },
  { id: "EEXH-004", eventId: "EVT-001", name: "Amara Osei", company: "Hexa Industry", email: "amara@hexaindustry.ca", phone: "+1-416-555-0199", boothType: "Standard 6x6", boothNumber: "B-11", industry: "Automation", avatar: "AO", status: "pending", appliedDate: "2025-06-25" },
  { id: "EEXH-005", eventId: "EVT-001", name: "Kenji Tanaka", company: "BlueForge", email: "kenji@blueforge.us", phone: "+1-512-555-0188", boothType: "Large 12x12", boothNumber: "C-01", industry: "Manufacturing SaaS", avatar: "KT", status: "payment_pending", appliedDate: "2025-06-12", paymentDeadline: "2025-07-20" },
  { id: "EEXH-006", eventId: "EVT-001", name: "Fatima Al-Rashid", company: "AtlasBio", email: "fatima@atlasbio.sg", phone: "+65-9123-4567", boothType: "Standard 6x6", boothNumber: "B-07", industry: "Biotech", avatar: "FA", status: "ignored", appliedDate: "2025-06-22" },
  { id: "EEXH-007", eventId: "EVT-002", name: "Lukas Braun", company: "EcoBuild GmbH", email: "lukas@ecobuild.de", phone: "+49-30-12345678", boothType: "Premium 10x10", boothNumber: "A-03", industry: "Green Construction", avatar: "LB", status: "activated", appliedDate: "2025-05-10", paymentDeadline: "2025-06-10", paidDate: "2025-05-28" },
  { id: "EEXH-008", eventId: "EVT-002", name: "Ingrid Holm", company: "SolarNord", email: "ingrid@solarnord.no", phone: "+47-400-12345", boothType: "Standard 6x6", boothNumber: "B-09", industry: "Solar Energy", avatar: "IH", status: "pending", appliedDate: "2025-05-20" },
  { id: "EEXH-009", eventId: "EVT-003", name: "Marcus Weber", company: "DriveTech AI", email: "marcus@drivetech.de", phone: "+49-89-9876543", boothType: "Large 12x12", boothNumber: "C-05", industry: "Autonomous Driving", avatar: "MW", status: "activated", appliedDate: "2025-01-15", paymentDeadline: "2025-02-15", paidDate: "2025-01-30" },
  { id: "EEXH-010", eventId: "EVT-004", name: "Dr. Lin Wei", company: "MedScan Technologies", email: "lin.wei@medscan.sg", phone: "+65-8234-5678", boothType: "Premium 10x10", boothNumber: "A-15", industry: "Medical Devices", avatar: "LW", status: "pending", appliedDate: "2025-07-01" },
  { id: "EEXH-011", eventId: "EVT-004", name: "Rachel Kim", company: "BioSynth Labs", email: "rachel@biosynth.kr", phone: "+82-10-9876-5432", boothType: "Standard 6x6", boothNumber: "B-02", industry: "Biotech", avatar: "RK", status: "approved", appliedDate: "2025-06-28", paymentDeadline: "2025-07-28" },
  { id: "EEXH-012", eventId: "EVT-006", name: "Ananya Patel", company: "FarmFresh Tech", email: "ananya@farmfresh.in", phone: "+91-99887-76655", boothType: "Standard 6x6", boothNumber: "B-06", industry: "Agritech", avatar: "AP", status: "activated", appliedDate: "2025-04-10", paymentDeadline: "2025-05-10", paidDate: "2025-04-25" },
];

/* ─── Mock Event Booths ─── */

export const mockEventBooths: EventBooth[] = [
  // EVT-001 – FutureTech Expo (Hall 1: Premium, Hall 2: Standard, Hall 3: Large)
  { boothNumber: "A-01", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-02", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-03", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-04", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-08", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "booked", orders: 1 },
  { boothNumber: "A-12", eventId: "EVT-001", hall: "1", boothType: "Premium 10x10", status: "pending", orders: 1 },
  { boothNumber: "B-01", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
  { boothNumber: "B-02", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
  { boothNumber: "B-03", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
  { boothNumber: "B-04", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "approved", orders: 1 },
  { boothNumber: "B-07", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 1 },
  { boothNumber: "B-11", eventId: "EVT-001", hall: "2", boothType: "Standard 6x6", status: "pending", orders: 1 },
  { boothNumber: "C-01", eventId: "EVT-001", hall: "3", boothType: "Large 12x12", status: "payment_pending", orders: 1 },
  { boothNumber: "C-02", eventId: "EVT-001", hall: "3", boothType: "Large 12x12", status: "empty", orders: 0 },
  { boothNumber: "C-03", eventId: "EVT-001", hall: "3", boothType: "Large 12x12", status: "empty", orders: 0 },
  // EVT-002 – GreenBuild Summit
  { boothNumber: "A-01", eventId: "EVT-002", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-02", eventId: "EVT-002", hall: "1", boothType: "Premium 10x10", status: "empty", orders: 0 },
  { boothNumber: "A-03", eventId: "EVT-002", hall: "1", boothType: "Premium 10x10", status: "booked", orders: 1 },
  { boothNumber: "B-09", eventId: "EVT-002", hall: "2", boothType: "Standard 6x6", status: "pending", orders: 1 },
  { boothNumber: "B-10", eventId: "EVT-002", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
  // EVT-003 – AutoDrive World
  { boothNumber: "C-05", eventId: "EVT-003", hall: "3", boothType: "Large 12x12", status: "booked", orders: 1 },
  { boothNumber: "C-06", eventId: "EVT-003", hall: "3", boothType: "Large 12x12", status: "empty", orders: 0 },
  // EVT-004 – HealthTech Connect
  { boothNumber: "A-15", eventId: "EVT-004", hall: "1", boothType: "Premium 10x10", status: "pending", orders: 1 },
  { boothNumber: "B-01", eventId: "EVT-004", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
  { boothNumber: "B-02", eventId: "EVT-004", hall: "2", boothType: "Standard 6x6", status: "approved", orders: 1 },
  // EVT-006 – FoodPro Asia
  { boothNumber: "B-06", eventId: "EVT-006", hall: "2", boothType: "Standard 6x6", status: "booked", orders: 1 },
  { boothNumber: "B-07", eventId: "EVT-006", hall: "2", boothType: "Standard 6x6", status: "empty", orders: 0 },
];

/* ─── Mock Event Visitors ─── */

export const mockEventVisitors: EventVisitor[] = [
  { id: "EVIS-001", eventId: "EVT-001", name: "Aisha Rahman", email: "aisha@techcorp.in", phone: "+91-98765-00001", company: "TechCorp India", avatar: "AR", active: true, badgeStatus: "sent", badgeSentDate: "2025-07-10", registeredDate: "2025-06-20" },
  { id: "EVIS-002", eventId: "EVT-001", name: "Dmitri Volkov", email: "dmitri@innovate.ru", phone: "+7-916-1234567", company: "Innovate Labs", avatar: "DV", active: true, badgeStatus: "not_sent", registeredDate: "2025-06-22" },
  { id: "EVIS-003", eventId: "EVT-001", name: "Maria Santos", email: "maria@verde.br", phone: "+55-11-98765432", company: "Verde Solutions", avatar: "MS", active: false, badgeStatus: "not_sent", registeredDate: "2025-06-25" },
  { id: "EVIS-004", eventId: "EVT-001", name: "James O'Brien", email: "james@dualtech.ie", phone: "+353-87-1234567", company: "DualTech Ireland", avatar: "JO", active: true, badgeStatus: "sent", badgeSentDate: "2025-07-10", registeredDate: "2025-06-18" },
  { id: "EVIS-005", eventId: "EVT-001", name: "Yuki Nakamura", email: "yuki@smartfab.jp", phone: "+81-90-12345678", company: "SmartFab Japan", avatar: "YN", active: true, badgeStatus: "not_sent", registeredDate: "2025-07-01" },
  { id: "EVIS-006", eventId: "EVT-001", name: "Chen Wei", email: "chen@globallink.cn", phone: "+86-138-12345678", company: "GlobalLink China", avatar: "CW", active: true, badgeStatus: "sent", badgeSentDate: "2025-07-12", registeredDate: "2025-06-28" },
  { id: "EVIS-007", eventId: "EVT-001", name: "Sarah Mitchell", email: "sarah@automize.us", phone: "+1-650-555-0134", company: "Automize Inc", avatar: "SM", active: false, badgeStatus: "not_sent", registeredDate: "2025-07-05" },
  { id: "EVIS-008", eventId: "EVT-001", name: "Ravi Krishnan", email: "ravi@datatrek.in", phone: "+91-94432-11223", company: "DataTrek", avatar: "RK", active: true, badgeStatus: "not_sent", registeredDate: "2025-07-08" },
  { id: "EVIS-009", eventId: "EVT-002", name: "Hans Muller", email: "hans@greenbau.de", phone: "+49-151-23456789", company: "GreenBau GmbH", avatar: "HM", active: true, badgeStatus: "sent", badgeSentDate: "2025-06-20", registeredDate: "2025-05-15" },
  { id: "EVIS-010", eventId: "EVT-002", name: "Anna Kowalski", email: "anna@ecodesign.pl", phone: "+48-500-123456", company: "EcoDesign Poland", avatar: "AK", active: true, badgeStatus: "not_sent", registeredDate: "2025-05-22" },
  { id: "EVIS-011", eventId: "EVT-003", name: "Felix Strauss", email: "felix@automotion.at", phone: "+43-660-1234567", company: "AutoMotion", avatar: "FS", active: true, badgeStatus: "sent", badgeSentDate: "2025-02-28", registeredDate: "2025-01-20" },
  { id: "EVIS-012", eventId: "EVT-004", name: "Mei Lin Tan", email: "meiling@healthnet.sg", phone: "+65-9234-5678", company: "HealthNet Asia", avatar: "MT", active: true, badgeStatus: "not_sent", registeredDate: "2025-07-15" },
  { id: "EVIS-013", eventId: "EVT-006", name: "Somchai Prasert", email: "somchai@foodinno.th", phone: "+66-81-2345678", company: "FoodInno Thailand", avatar: "SP", active: true, badgeStatus: "sent", badgeSentDate: "2025-05-20", registeredDate: "2025-04-18" },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/contact", label: "Enquiry" },
];

/* ─── Hero stats ticker ─── */

export const heroStats: Stat[] = [
  { label: "Trade Fairs Hosted", value: "320+" },
  { label: "Exhibitors Onboarded", value: "12,000+" },
  { label: "Countries", value: "45" },
  { label: "Visitor Check-ins", value: "2.4M+" },
];

/* ─── Role cards ─── */

export const roleFeatures: RoleFeature[] = [
  {
    role: "Exhibitors",
    tagline: "Book your booth. Grow your pipeline.",
    icon: "🏗️",
    highlights: [
      "Browse & book stalls and booths at any trade fair",
      "Receive invoices & manage payments",
      "Track visitor engagement at your booth",
    ],
  },
  {
    role: "Organisers",
    tagline: "Run trade fairs like a pro.",
    icon: "📋",
    highlights: [
      "Create, edit & manage trade fairs end-to-end",
      "View exhibitors, visitors, sponsors & vendors",
      "Real-time dashboards & analytics",
    ],
  },
  {
    role: "Visitors",
    tagline: "Discover. Connect. Do business.",
    icon: "🎟️",
    highlights: [
      "Book trade fairs & receive QR-code e-tickets",
      "Browse exhibitor directory & fair details",
      "Message exhibitors or request a call",
    ],
  },
  {
    role: "Sponsors",
    tagline: "Maximise brand visibility at trade fairs.",
    icon: "💎",
    highlights: [
      "Browse available sponsorship packages per fair",
      "Claim & submit for organiser approval",
      "Secure payment after approval",
    ],
  },
  {
    role: "Vendors",
    tagline: "Deliver on time. Every trade fair.",
    icon: "🚚",
    highlights: [
      "View trade fair requirements & delivery timelines",
      "Ticket-based chat with organisers",
      "Close resolved tickets to track progress",
    ],
  },
];

/* ─── Platform features ─── */

export const features: Feature[] = [
  { title: "Unified Login", description: "One account, multiple roles. Sign in with email, Google, passkey, or SSO — then switch roles instantly." },
  { title: "Booth Booking", description: "Interactive stall and booth reservations at trade fairs with real-time availability and instant invoicing." },
  { title: "QR Ticketing", description: "Visitors receive QR-code e-tickets via email or SMS for frictionless trade fair check-in." },
  { title: "Smart Messaging", description: "In-platform direct messaging and call-request system between visitors and exhibitors." },
  { title: "Sponsorship Workflow", description: "End-to-end claim → approval → payment pipeline for trade fair sponsorships." },
  { title: "Vendor Ticket Board", description: "Kanban-style task boards for vendors with organiser chat and resolution tracking." },
];

/* ─── Testimonials ─── */

export const testimonials: Testimonial[] = [
  { quote: "We onboarded 200 exhibitors for our trade fair in under a week. The unified login made role management effortless.", name: "Natalie Chen", role: "Fair Director, FutureTech Expo", avatar: "NC" },
  { quote: "Sponsors loved the self-service claiming flow — it cut our trade fair sales cycle by 60%.", name: "Omar Rahman", role: "VP Partnerships, BuildSphere", avatar: "OR" },
  { quote: "Vendor coordination across trade fairs used to be chaos. The ticket board brought structure and accountability.", name: "Isabella Costa", role: "Head of Growth, Urban Industry Summit", avatar: "IC" },
];

export const booths: Booth[] = [
  { id: "A-01", hall: "Hall 1", size: "6x6", price: "$1,400", status: "available" },
  { id: "A-02", hall: "Hall 1", size: "6x6", price: "$1,400", status: "reserved" },
  { id: "A-03", hall: "Hall 1", size: "6x6", price: "$1,400", status: "available" },
  { id: "B-10", hall: "Hall 2", size: "8x8", price: "$2,100", status: "available" },
  { id: "B-11", hall: "Hall 2", size: "8x8", price: "$2,100", status: "reserved" },
  { id: "C-04", hall: "Hall 3", size: "10x10", price: "$2,900", status: "available" },
  { id: "C-05", hall: "Hall 3", size: "10x10", price: "$2,900", status: "available" },
  { id: "D-07", hall: "Hall 4", size: "12x12", price: "$3,600", status: "reserved" },
];

export const leads: Lead[] = [
  { id: "LD-1001", contact: "Avery Kim", company: "Nexa Systems", interest: "Enterprise kiosk setup", score: "Hot" },
  { id: "LD-1002", contact: "Liam Rossi", company: "VoltGrid", interest: "Distributor partnership", score: "Warm" },
  { id: "LD-1003", contact: "Mina Ahmed", company: "Aria Mobility", interest: "Smart booth analytics", score: "Hot" },
  { id: "LD-1004", contact: "Jonas Meyer", company: "Hexa Industry", interest: "Lead capture hardware", score: "Cold" },
];

export const exhibitors: Exhibitor[] = [
  { id: "EX-01", name: "Nexa Systems", industry: "Industrial IoT", location: "Berlin", shortDescription: "Connected machinery monitoring platform for modern factories." },
  { id: "EX-02", name: "VoltGrid", industry: "Energy Tech", location: "Amsterdam", shortDescription: "Smart infrastructure for EV charging and energy optimization." },
  { id: "EX-03", name: "Aria Mobility", industry: "Mobility", location: "Stockholm", shortDescription: "Autonomous fleet management with safety-first AI controls." },
  { id: "EX-04", name: "Hexa Industry", industry: "Automation", location: "Toronto", shortDescription: "Robotics and automation suites for warehouse operations." },
  { id: "EX-05", name: "BlueForge", industry: "Manufacturing SaaS", location: "Austin", shortDescription: "Production analytics and supplier collaboration workspace." },
  { id: "EX-06", name: "AtlasBio", industry: "Biotech", location: "Singapore", shortDescription: "Lab automation tools for scale-ready clinical research teams." },
];

export const organizerStats = [
  { label: "Total Visitors", value: "8,420", growth: "+11.2%" },
  { label: "Leads Captured", value: "2,184", growth: "+18.4%" },
  { label: "Meetings Booked", value: "712", growth: "+9.6%" },
];

export const pricingTiers = [
  {
    name: "Basic",
    price: "$99",
    description: "Best for small events launching digital workflows.",
    features: ["Up to 30 exhibitors", "Booth map view", "Core lead capture", "Email support"],
  },
  {
    name: "Pro",
    price: "$299",
    description: "For fast-growing events that need deeper engagement.",
    features: ["Up to 120 exhibitors", "Meeting scheduler", "Advanced lead scoring", "Performance analytics"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored workflows and integrations for global exhibitions.",
    features: ["Unlimited exhibitors", "CRM integrations", "Custom branding", "Dedicated success manager"],
  },
];

/* ─── Visitor types ─── */

export type VisitorRegistration = {
  id: string;
  userId: string;
  eventId: string;
  status: "registered" | "checked_in" | "cancelled";
  registeredDate: string;
  ticketType: "general" | "vip" | "business";
  badgeDownloaded: boolean;
  qrCode: string; // mock QR identifier
};

export type VisitorInterest = {
  id: string;
  userId: string;
  keyword: string;
  category: "product" | "technology" | "industry" | "job" | "service";
};

export type StallKeyword = {
  eventId: string;
  boothNumber: string;
  exhibitorName: string;
  company: string;
  hall: string;
  keywords: string[];
  category: string;
  description: string;
  matchScore?: number; // computed at runtime
};

export type VisitorScheduleItem = {
  id: string;
  userId: string;
  eventId: string;
  title: string;
  type: "visit_stall" | "meeting" | "seminar" | "break" | "custom";
  location: string;
  time: string;
  duration: string;
  notes?: string;
  completed: boolean;
};

export type VisitorFavorite = {
  id: string;
  userId: string;
  eventId: string;
  exhibitorName: string;
  company: string;
  boothNumber: string;
  hall: string;
  industry: string;
  notes?: string;
  savedDate: string;
};

export type NetworkingContact = {
  id: string;
  userId: string;
  eventId: string;
  contactName: string;
  contactCompany: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  avatar: string;
  type: "exhibitor" | "visitor" | "speaker";
  status: "pending" | "connected" | "declined";
  connectedDate: string;
  notes?: string;
};

export type FloorMapExhibitor = {
  boothNumber: string;
  company: string;
  logo: string; // gradient placeholder
  industry: string;
};

export type FloorMapHall = {
  id: string;
  eventId: string;
  hallName: string;
  hallLabel: string; // e.g. "Hall 1 – Premium Zone"
  mapImage: string | null; // organiser-uploaded image URL, null = coming soon
  exhibitors: FloorMapExhibitor[];
};

export type FloorMapOverview = {
  eventId: string;
  eventTitle: string;
  overviewImage: string | null; // organiser-uploaded overall map, null = coming soon
  halls: FloorMapHall[];
};

/* ─── Visitor Mock Data ─── */

export const mockVisitorRegistrations: VisitorRegistration[] = [
  { id: "VR-001", userId: "U-003", eventId: "EVT-001", status: "registered", registeredDate: "2025-07-01", ticketType: "business", badgeDownloaded: false, qrCode: "QR-EVT001-U003" },
  { id: "VR-002", userId: "U-003", eventId: "EVT-002", status: "checked_in", registeredDate: "2025-06-10", ticketType: "general", badgeDownloaded: true, qrCode: "QR-EVT002-U003" },
  { id: "VR-003", userId: "U-003", eventId: "EVT-004", status: "registered", registeredDate: "2025-08-15", ticketType: "vip", badgeDownloaded: false, qrCode: "QR-EVT004-U003" },
  { id: "VR-004", userId: "U-003", eventId: "EVT-003", status: "checked_in", registeredDate: "2025-02-20", ticketType: "general", badgeDownloaded: true, qrCode: "QR-EVT003-U003" },
  { id: "VR-005", userId: "U-001", eventId: "EVT-001", status: "registered", registeredDate: "2025-07-05", ticketType: "vip", badgeDownloaded: false, qrCode: "QR-EVT001-U001" },
  { id: "VR-006", userId: "U-002", eventId: "EVT-001", status: "registered", registeredDate: "2025-07-08", ticketType: "business", badgeDownloaded: true, qrCode: "QR-EVT001-U002" },
  { id: "VR-007", userId: "U-005", eventId: "EVT-002", status: "registered", registeredDate: "2025-06-05", ticketType: "general", badgeDownloaded: false, qrCode: "QR-EVT002-U005" },
];

export const mockVisitorInterests: VisitorInterest[] = [
  { id: "VI-001", userId: "U-003", keyword: "IoT sensors", category: "technology" },
  { id: "VI-002", userId: "U-003", keyword: "warehouse automation", category: "technology" },
  { id: "VI-003", userId: "U-003", keyword: "AI analytics", category: "technology" },
  { id: "VI-004", userId: "U-003", keyword: "energy monitoring", category: "product" },
  { id: "VI-005", userId: "U-003", keyword: "distributor partnerships", category: "service" },
  { id: "VI-006", userId: "U-003", keyword: "robotics engineer", category: "job" },
];

export const mockStallKeywords: StallKeyword[] = [
  { eventId: "EVT-001", boothNumber: "A-12", exhibitorName: "Rahul Gupta", company: "Nexa Systems", hall: "1", keywords: ["IoT", "sensors", "industrial IoT", "connectivity", "mesh networking"], category: "Industrial IoT", description: "Connected machinery monitoring platform for modern factories." },
  { eventId: "EVT-001", boothNumber: "B-04", exhibitorName: "Elena Vasquez", company: "VoltGrid", hall: "2", keywords: ["energy", "EV charging", "smart grid", "energy monitoring", "sustainability"], category: "Energy Tech", description: "Smart infrastructure for EV charging and energy optimization." },
  { eventId: "EVT-001", boothNumber: "A-08", exhibitorName: "Tom Henderson", company: "Aria Mobility", hall: "1", keywords: ["autonomous", "fleet", "mobility", "AI", "safety", "vehicles"], category: "Mobility", description: "Autonomous fleet management with safety-first AI controls." },
  { eventId: "EVT-001", boothNumber: "B-11", exhibitorName: "Amara Osei", company: "Hexa Industry", hall: "2", keywords: ["robotics", "automation", "warehouse", "warehouse automation", "conveyor"], category: "Automation", description: "Robotics and automation suites for warehouse operations." },
  { eventId: "EVT-001", boothNumber: "C-01", exhibitorName: "Kenji Tanaka", company: "BlueForge", hall: "3", keywords: ["manufacturing", "analytics", "SaaS", "production", "AI analytics", "supplier"], category: "Manufacturing SaaS", description: "Production analytics and supplier collaboration workspace." },
  { eventId: "EVT-001", boothNumber: "B-07", exhibitorName: "Fatima Al-Rashid", company: "AtlasBio", hall: "3", keywords: ["biotech", "lab automation", "clinical research", "genomics"], category: "Biotech", description: "Lab automation tools for scale-ready clinical research teams." },
  { eventId: "EVT-002", boothNumber: "A-03", exhibitorName: "Lukas Braun", company: "EcoBuild GmbH", hall: "1", keywords: ["green construction", "sustainable", "building", "eco", "carbon neutral"], category: "Green Construction", description: "Sustainable construction materials and techniques for carbon-neutral buildings." },
  { eventId: "EVT-002", boothNumber: "B-09", exhibitorName: "Ingrid Holm", company: "SolarNord", hall: "2", keywords: ["solar", "energy", "renewable", "panels", "off-grid"], category: "Solar Energy", description: "Next-generation solar panels with record efficiency for commercial buildings." },
  { eventId: "EVT-004", boothNumber: "A-15", exhibitorName: "Dr. Lin Wei", company: "MedScan Technologies", hall: "1", keywords: ["medical devices", "AI diagnostics", "imaging", "health", "MRI"], category: "Medical Devices", description: "AI-powered medical imaging and diagnostic tools for hospitals." },
  { eventId: "EVT-004", boothNumber: "B-02", exhibitorName: "Rachel Kim", company: "BioSynth Labs", hall: "2", keywords: ["biotech", "pharma", "drug discovery", "synthesizer", "lab"], category: "Biotech", description: "Automated drug discovery and synthesis platform for pharma R&D." },
];

export const mockVisitorSchedule: VisitorScheduleItem[] = [
  { id: "VS-001", userId: "U-003", eventId: "EVT-001", title: "Visit Nexa Systems booth", type: "visit_stall", location: "Hall 1, Booth A-12", time: "10:00 AM", duration: "30 min", completed: false },
  { id: "VS-002", userId: "U-003", eventId: "EVT-001", title: "AI & IoT Keynote Session", type: "seminar", location: "Main Stage, Hall 1", time: "11:00 AM", duration: "1 hr", completed: false },
  { id: "VS-003", userId: "U-003", eventId: "EVT-001", title: "Meeting with VoltGrid team", type: "meeting", location: "Hall 2, Booth B-04", time: "12:30 PM", duration: "45 min", notes: "Discuss energy monitoring integration", completed: false },
  { id: "VS-004", userId: "U-003", eventId: "EVT-001", title: "Lunch Break", type: "break", location: "Food Court, Level 2", time: "1:30 PM", duration: "45 min", completed: false },
  { id: "VS-005", userId: "U-003", eventId: "EVT-001", title: "Explore Hexa Industry robotics demo", type: "visit_stall", location: "Hall 2, Booth B-11", time: "2:30 PM", duration: "30 min", completed: false },
  { id: "VS-006", userId: "U-003", eventId: "EVT-001", title: "Networking mixer", type: "custom", location: "Lounge Area, Hall 3", time: "4:00 PM", duration: "1 hr", notes: "Bring business cards", completed: false },
];

export const mockVisitorFavorites: VisitorFavorite[] = [
  { id: "VF-001", userId: "U-003", eventId: "EVT-001", exhibitorName: "Rahul Gupta", company: "Nexa Systems", boothNumber: "A-12", hall: "1", industry: "Industrial IoT", notes: "Interested in bulk sensor order", savedDate: "2025-07-05" },
  { id: "VF-002", userId: "U-003", eventId: "EVT-001", exhibitorName: "Elena Vasquez", company: "VoltGrid", boothNumber: "B-04", hall: "2", industry: "Energy Tech", savedDate: "2025-07-06" },
  { id: "VF-003", userId: "U-003", eventId: "EVT-001", exhibitorName: "Amara Osei", company: "Hexa Industry", boothNumber: "B-11", hall: "2", industry: "Automation", notes: "Warehouse automation demo at 2:30", savedDate: "2025-07-07" },
  { id: "VF-004", userId: "U-003", eventId: "EVT-002", exhibitorName: "Lukas Braun", company: "EcoBuild GmbH", boothNumber: "A-03", hall: "1", industry: "Green Construction", savedDate: "2025-06-12" },
];

export const mockNetworkingContacts: NetworkingContact[] = [
  { id: "NC-001", userId: "U-003", eventId: "EVT-001", contactName: "Rahul Gupta", contactCompany: "Nexa Systems", contactRole: "Sales Director", contactEmail: "rahul@nexasystems.io", contactPhone: "+91-98765-43210", avatar: "RG", type: "exhibitor", status: "connected", connectedDate: "2025-07-10", notes: "Met at booth A-12" },
  { id: "NC-002", userId: "U-003", eventId: "EVT-001", contactName: "Aisha Rahman", contactCompany: "TechCorp India", contactRole: "Procurement Lead", contactEmail: "aisha@techcorp.in", contactPhone: "+91-98765-00001", avatar: "AR", type: "visitor", status: "connected", connectedDate: "2025-07-10" },
  { id: "NC-003", userId: "U-003", eventId: "EVT-001", contactName: "Kenji Tanaka", contactCompany: "BlueForge", contactRole: "CTO", contactEmail: "kenji@blueforge.us", contactPhone: "+1-512-555-0188", avatar: "KT", type: "exhibitor", status: "pending", connectedDate: "2025-07-12" },
  { id: "NC-004", userId: "U-003", eventId: "EVT-001", contactName: "Dr. Sarah Chen", contactCompany: "MIT Research Lab", contactRole: "Keynote Speaker", contactEmail: "sarah.chen@mit.edu", contactPhone: "+1-617-555-0199", avatar: "SC", type: "speaker", status: "connected", connectedDate: "2025-07-11", notes: "Discussed AI in manufacturing" },
  { id: "NC-005", userId: "U-003", eventId: "EVT-002", contactName: "Hans Muller", contactCompany: "GreenBau GmbH", contactRole: "Sustainability Director", contactEmail: "hans@greenbau.de", contactPhone: "+49-151-23456789", avatar: "HM", type: "visitor", status: "connected", connectedDate: "2025-06-20" },
  { id: "NC-006", userId: "U-003", eventId: "EVT-001", contactName: "Elena Vasquez", contactCompany: "VoltGrid", contactRole: "Regional Manager", contactEmail: "elena@voltgrid.eu", contactPhone: "+31-612-345678", avatar: "EV", type: "exhibitor", status: "declined", connectedDate: "2025-07-10" },
];

/* ─── Exhibitor Bookings ─── */

export const mockExhibitorBookings: ExhibitorBooking[] = [
  { id: "BK-001", userId: "U-001", eventId: "EVT-001", boothStyle: "shell_scheme", boothPosition: "corner",   sqMeters: 18, hallPreference: "Hall 1", status: "confirmed",       submittedDate: "2025-06-10", approvedDate: "2025-06-15", totalPrice: "$4,200" },
  { id: "BK-002", userId: "U-001", eventId: "EVT-004", boothStyle: "bare_space",   boothPosition: "island",   sqMeters: 36, hallPreference: "Hall 2", status: "pending",           submittedDate: "2025-07-20", totalPrice: "$7,800" },
  { id: "BK-003", userId: "U-002", eventId: "EVT-001", boothStyle: "shell_scheme", boothPosition: "middle",   sqMeters: 12, hallPreference: "Hall 2", status: "payment_pending",    submittedDate: "2025-06-12", approvedDate: "2025-06-18", totalPrice: "$2,800" },
  { id: "BK-004", userId: "U-002", eventId: "EVT-002", boothStyle: "bare_space",   boothPosition: "end_cap",  sqMeters: 24, hallPreference: "Hall 1", status: "confirmed",         submittedDate: "2025-05-01", approvedDate: "2025-05-08", totalPrice: "$5,400" },
  { id: "BK-005", userId: "U-004", eventId: "EVT-001", boothStyle: "shell_scheme", boothPosition: "corner",   sqMeters: 18, hallPreference: "Hall 1", status: "rejected",          submittedDate: "2025-06-20", rejectedReason: "Hall 1 is fully booked", totalPrice: "$4,200" },
  { id: "BK-006", userId: "U-001", eventId: "EVT-003", boothStyle: "bare_space",   boothPosition: "middle",   sqMeters: 24, hallPreference: "Hall 3", status: "confirmed",         submittedDate: "2025-01-05", approvedDate: "2025-01-10", totalPrice: "$5,400" },
  // U-005 (Fingoh Technologies — exhibitor) — one booking per status
  { id: "BK-007", userId: "U-005", eventId: "EVT-001", boothStyle: "shell_scheme", boothPosition: "corner",   sqMeters: 18, hallPreference: "Hall 1", status: "confirmed",         submittedDate: "2025-06-05", approvedDate: "2025-06-10", totalPrice: "$4,200", specialRequirements: "Power socket at booth corner" },
  { id: "BK-008", userId: "U-005", eventId: "EVT-002", boothStyle: "bare_space",   boothPosition: "island",   sqMeters: 36, hallPreference: "Hall 2", status: "payment_pending",    submittedDate: "2025-05-18", approvedDate: "2025-05-25", totalPrice: "$8,640" },
  { id: "BK-009", userId: "U-005", eventId: "EVT-004", boothStyle: "shell_scheme", boothPosition: "end_cap",  sqMeters: 24, hallPreference: "Hall 1", status: "pending",           submittedDate: "2025-07-14", totalPrice: "$5,760", specialRequirements: "Demo counter and product shelving" },
  { id: "BK-010", userId: "U-005", eventId: "EVT-006", boothStyle: "bare_space",   boothPosition: "middle",   sqMeters: 12, hallPreference: "Hall 2", status: "payment_pending",   submittedDate: "2025-04-01", approvedDate: "2025-04-07", totalPrice: "$2,880" },
  { id: "BK-011", userId: "U-005", eventId: "EVT-003", boothStyle: "shell_scheme", boothPosition: "corner",   sqMeters: 18, hallPreference: "Hall 3", status: "rejected",          submittedDate: "2025-01-20", rejectedReason: "Booth size not available in Hall 3 for this event", totalPrice: "$4,320" },
  { id: "BK-012", userId: "U-005", eventId: "EVT-005", boothStyle: "bare_space",   boothPosition: "island",   sqMeters: 48, hallPreference: "Hall 1", status: "cancelled",         submittedDate: "2025-09-10", totalPrice: "$11,520", specialRequirements: "Large machinery display — needs 4m ceiling clearance" },
];

/* ─── Exhibitor Products ─── */

export const mockExhibitorProducts: ExhibitorProduct[] = [
  { id: "PRD-001", userId: "U-001", eventId: "EVT-001", name: "SmartSensor Pro X1", category: "IoT Hardware", description: "Industrial-grade environmental sensor with edge AI processing", image: "from-indigo-500 to-purple-600" },
  { id: "PRD-002", userId: "U-001", eventId: "EVT-001", name: "CloudEdge Platform", category: "Software", description: "Unified dashboard for managing IoT sensor fleet at scale", image: "from-cyan-500 to-blue-600" },
  { id: "PRD-003", userId: "U-001", eventId: "EVT-003", name: "AutoPilot Module v3", category: "Autonomous Systems", description: "Retrofit autonomous navigation module for warehouse vehicles", image: "from-orange-500 to-red-600" },
  { id: "PRD-004", userId: "U-002", eventId: "EVT-001", name: "NexaConnect Hub", category: "Networking", description: "Mesh networking hub for industrial plant connectivity", image: "from-emerald-500 to-teal-600" },
  { id: "PRD-005", userId: "U-002", eventId: "EVT-002", name: "GreenMonitor Suite", category: "Sustainability", description: "Real-time energy and carbon footprint monitoring platform", image: "from-lime-500 to-green-600" },
  // Fingoh Technologies (U-005) — Stainless Steel Products
  { id: "PRD-006", userId: "U-005", eventId: "EVT-001", name: "SS304 Seamless Tubes", category: "Stainless Steel Tubes", description: "ASTM A269 seamless austenitic stainless steel tubes for high-pressure industrial piping systems", image: "from-slate-400 to-zinc-600" },
  { id: "PRD-007", userId: "U-005", eventId: "EVT-001", name: "SS316L Welded Pipes", category: "Stainless Steel Pipes", description: "Low-carbon 316L grade welded pipes with superior corrosion resistance for chemical and marine applications", image: "from-zinc-400 to-slate-600" },
  { id: "PRD-008", userId: "U-005", eventId: "EVT-001", name: "Duplex SS Flanges", category: "Flanges & Fittings", description: "Duplex 2205 stainless steel flanges with enhanced strength-to-weight ratio, suitable for offshore and petrochemical environments", image: "from-neutral-500 to-stone-700" },
  { id: "PRD-009", userId: "U-005", eventId: "EVT-001", name: "SS Hexagonal Bars", category: "Long Products", description: "Cold-drawn SS 304 & 316 hexagonal bars in custom lengths, ideal for precision machining and fastener manufacturing", image: "from-gray-500 to-zinc-700" },
  { id: "PRD-010", userId: "U-005", eventId: "EVT-001", name: "Mirror Finish Sheets", category: "Stainless Steel Sheets", description: "No.8 mirror polished SS 304 sheets for architectural cladding, decorative panels and food processing equipment", image: "from-sky-400 to-indigo-500" },
  { id: "PRD-011", userId: "U-005", eventId: "EVT-003", name: "SS Wire Mesh Coils", category: "Wire & Mesh", description: "Fine and coarse weave SS 316 wire mesh for filtration, sieving and safety screens in industrial processing plants", image: "from-teal-500 to-cyan-600" },
  { id: "PRD-012", userId: "U-005", eventId: "EVT-003", name: "Sanitary Butt-Weld Fittings", category: "Flanges & Fittings", description: "FDA-compliant SS 316L butt-weld elbows, tees and reducers designed for hygienic food, dairy and pharmaceutical piping", image: "from-emerald-400 to-teal-600" },
  { id: "PRD-013", userId: "U-005", eventId: "EVT-004", name: "SS Coils — Hot Rolled", category: "Stainless Steel Coils", description: "Wide-width hot-rolled SS 201/304 coils for automotive body panels and white goods manufacturing", image: "from-amber-500 to-orange-600" },
  { id: "PRD-014", userId: "U-005", eventId: "EVT-004", name: "Electropolished Cylinders", category: "Custom Fabrication", description: "Precision electropolished stainless steel cylinders used in semiconductor wafer handling and ultra-clean process environments", image: "from-violet-500 to-purple-600" },
];

/* ─── Exhibitor Sponsors ─── */

export const mockExhibitorSponsors: ExhibitorSponsor[] = [
  { id: "SP-001", userId: "U-001", eventId: "EVT-001", tier: "gold",     companyName: "TechVentures Capital",    amount: "$15,000", status: "active" },
  { id: "SP-002", userId: "U-001", eventId: "EVT-001", tier: "silver",   companyName: "InnoFund Partners",       amount: "$8,000",  status: "pending" },
  { id: "SP-003", userId: "U-001", eventId: "EVT-003", tier: "platinum", companyName: "MegaCorp Industries",     amount: "$25,000", status: "active" },
  { id: "SP-004", userId: "U-002", eventId: "EVT-001", tier: "bronze",   companyName: "StartupBoost",           amount: "$3,000",  status: "active" },
  // Fingoh Technologies (U-005) — sponsors across events, all approval states
  { id: "SP-005", userId: "U-005", eventId: "EVT-001", tier: "platinum", companyName: "Gulf Steel Holdings",     amount: "$40,000", status: "active" },
  { id: "SP-006", userId: "U-005", eventId: "EVT-001", tier: "gold",     companyName: "IndoMetal Group",         amount: "$20,000", status: "active" },
  { id: "SP-007", userId: "U-005", eventId: "EVT-001", tier: "silver",   companyName: "Bharat Alloys Ltd",       amount: "$10,000", status: "pending" },
  { id: "SP-008", userId: "U-005", eventId: "EVT-001", tier: "bronze",   companyName: "FastFit Fabricators",     amount: "$4,500",  status: "pending" },
  { id: "SP-009", userId: "U-005", eventId: "EVT-001", tier: "silver",   companyName: "PipeWorld Exports",       amount: "$9,000",  status: "rejected", rejectedReason: "Competing brand conflict with existing platinum sponsor" },
  { id: "SP-010", userId: "U-005", eventId: "EVT-003", tier: "platinum", companyName: "EuroSteel AG",            amount: "$35,000", status: "active" },
  { id: "SP-011", userId: "U-005", eventId: "EVT-003", tier: "gold",     companyName: "NordAlloy Partners",      amount: "$18,000", status: "pending" },
  { id: "SP-012", userId: "U-005", eventId: "EVT-003", tier: "bronze",   companyName: "Staincare Coatings",      amount: "$3,500",  status: "rejected", rejectedReason: "Booth category mismatch — sponsor profile does not align with exhibition theme" },
  { id: "SP-013", userId: "U-005", eventId: "EVT-004", tier: "gold",     companyName: "AsiaTube Corporation",    amount: "$22,000", status: "active" },
  { id: "SP-014", userId: "U-005", eventId: "EVT-004", tier: "silver",   companyName: "Precision Metals Japan",  amount: "$11,000", status: "pending" },
];

/* ─── Exhibitor Leads ─── */

export const mockExhibitorLeads: ExhibitorLead[] = [
  { id: "EL-001", userId: "U-001", eventId: "EVT-001", visitorName: "Aisha Rahman", visitorEmail: "aisha@techcorp.in", visitorCompany: "TechCorp India", interest: "SmartSensor bulk order", score: "Hot", capturedDate: "2025-08-15", notes: "Needs 500 units for factory deployment" },
  { id: "EL-002", userId: "U-001", eventId: "EVT-001", visitorName: "James O'Brien", visitorEmail: "james@dualtech.ie", visitorCompany: "DualTech Ireland", interest: "CloudEdge licensing", score: "Warm", capturedDate: "2025-08-16" },
  { id: "EL-003", userId: "U-001", eventId: "EVT-003", visitorName: "Felix Strauss", visitorEmail: "felix@automotion.at", visitorCompany: "AutoMotion", interest: "AutoPilot Module partnership", score: "Hot", capturedDate: "2025-03-10", notes: "Wants exclusive distribution for DACH region" },
  { id: "EL-004", userId: "U-001", eventId: "EVT-001", visitorName: "Chen Wei", visitorEmail: "chen@globallink.cn", visitorCompany: "GlobalLink China", interest: "IoT platform integration", score: "Cold", capturedDate: "2025-08-17" },
  { id: "EL-005", userId: "U-002", eventId: "EVT-001", visitorName: "Dmitri Volkov", visitorEmail: "dmitri@innovate.ru", visitorCompany: "Innovate Labs", interest: "NexaConnect Hub pilot", score: "Warm", capturedDate: "2025-08-15" },
  { id: "EL-006", userId: "U-002", eventId: "EVT-002", visitorName: "Hans Muller", visitorEmail: "hans@greenbau.de", visitorCompany: "GreenBau GmbH", interest: "GreenMonitor enterprise license", score: "Hot", capturedDate: "2025-07-01" },
  // Fingoh Technologies (U-005) — Stainless Steel leads
  { id: "EL-007", userId: "U-005", eventId: "EVT-001", visitorName: "Ravi Subramaniam", visitorEmail: "ravi@steelcraft.in", visitorCompany: "SteelCraft Industries", interest: "SS304 Seamless Tubes — bulk procurement (20 MT/month)", score: "Hot", capturedDate: "2025-08-15", notes: "Procurement head. Needs sample shipment first. Target close Q4." },
  { id: "EL-008", userId: "U-005", eventId: "EVT-001", visitorName: "Lars Eriksson", visitorEmail: "lars@norsepipe.no", visitorCompany: "NorsePipe AS", interest: "SS316L Welded Pipes for offshore platform upgrade", score: "Hot", capturedDate: "2025-08-15", notes: "Requires DNV certification docs. Very serious buyer — follow up within 48 hrs." },
  { id: "EL-009", userId: "U-005", eventId: "EVT-001", visitorName: "Priya Chandrasekaran", visitorEmail: "priya@pharmaline.com", visitorCompany: "PharmaLine Solutions", interest: "Sanitary Butt-Weld Fittings for new API plant", score: "Hot", capturedDate: "2025-08-16", notes: "FDA compliance is mandatory. Needs ISO 9001 & 3A Sanitary Standard certificates." },
  { id: "EL-010", userId: "U-005", eventId: "EVT-001", visitorName: "Mohamed Al-Farsi", visitorEmail: "mfarsi@gulfmetal.ae", visitorCompany: "Gulf Metal Trading", interest: "Mirror Finish Sheets — architectural project in Dubai", score: "Warm", capturedDate: "2025-08-16", notes: "Interior cladding for 3 high-rise towers. Will share project spec sheet next week." },
  { id: "EL-011", userId: "U-005", eventId: "EVT-001", visitorName: "Zhang Wei", visitorEmail: "zhangwei@sinoforge.cn", visitorCompany: "Sino Forge Ltd", interest: "SS Hexagonal Bars — machining components", score: "Warm", capturedDate: "2025-08-17", notes: "Comparing quotes from 3 suppliers. Price sensitive." },
  { id: "EL-012", userId: "U-005", eventId: "EVT-001", visitorName: "Olga Petrov", visitorEmail: "olga@filtrotech.ru", visitorCompany: "FiltroTech Russia", interest: "SS Wire Mesh Coils for industrial filtration", score: "Warm", capturedDate: "2025-08-17" },
  { id: "EL-013", userId: "U-005", eventId: "EVT-001", visitorName: "Carlos Mendez", visitorEmail: "cmendez@automotriz.mx", visitorCompany: "Automotriz del Norte", interest: "SS Coils Hot Rolled — body panel stamping", score: "Cold", capturedDate: "2025-08-18", notes: "Early-stage evaluation. Budget not yet approved." },
  { id: "EL-014", userId: "U-005", eventId: "EVT-001", visitorName: "Anita Patel", visitorEmail: "anita@archidesign.in", visitorCompany: "ArchiDesign Studio", interest: "Mirror Finish & decorative SS sheets for interior projects", score: "Cold", capturedDate: "2025-08-18" },
  { id: "EL-015", userId: "U-005", eventId: "EVT-003", visitorName: "Thomas Becker", visitorEmail: "thomas@chemflow.de", visitorCompany: "ChemFlow GmbH", interest: "Duplex SS Flanges — chemical reactor piping", score: "Hot", capturedDate: "2026-03-11", notes: "Needs ATEX-rated material traceability certs. Project start: May 2026." },
  { id: "EL-016", userId: "U-005", eventId: "EVT-003", visitorName: "Fiona O'Sullivan", visitorEmail: "fiona@dairytech.ie", visitorCompany: "DairyTech Ireland", interest: "Sanitary Butt-Weld Fittings for milk processing line expansion", score: "Warm", capturedDate: "2026-03-12", notes: "3A & EHEDG compliance required. Site visit arranged for June." },
  { id: "EL-017", userId: "U-005", eventId: "EVT-004", visitorName: "Kenji Nakamura", visitorEmail: "kenji@semitool.jp", visitorCompany: "SemiTool Japan", interest: "Electropolished Cylinders for wafer handling robots", score: "Hot", capturedDate: "2025-11-20", notes: "Very high-value order potential. Requires Ra ≤ 0.2 µm surface finish spec. Send quote ASAP." },
  { id: "EL-018", userId: "U-005", eventId: "EVT-004", visitorName: "Sarah Okonkwo", visitorEmail: "sarah@packlines.ng", visitorCompany: "PackLines Nigeria", interest: "SS304 Seamless Tubes for food packaging machinery", score: "Cold", capturedDate: "2025-11-21" },
];

/* ─── Floor Map Data (organiser-uploaded) ─── */

export const mockFloorMaps: FloorMapOverview[] = [
  {
    eventId: "EVT-001",
    eventTitle: "FutureTech Expo 2025",
    overviewImage: null, // organiser will upload overall floor plan
    halls: [
      {
        id: "FH-001",
        eventId: "EVT-001",
        hallName: "1",
        hallLabel: "Hall 1 – Premium Zone",
        mapImage: null,
        exhibitors: [
          { boothNumber: "A-08", company: "Etti Technologies", logo: "from-indigo-500 to-purple-600", industry: "IoT & AI" },
          { boothNumber: "A-12", company: "DataCore Solutions", logo: "from-cyan-500 to-blue-600", industry: "Data Analytics" },
        ],
      },
      {
        id: "FH-002",
        eventId: "EVT-001",
        hallName: "2",
        hallLabel: "Hall 2 – Standard Zone",
        mapImage: null,
        exhibitors: [
          { boothNumber: "B-04", company: "Nexa Systems", logo: "from-emerald-500 to-teal-600", industry: "Networking" },
          { boothNumber: "B-07", company: "AutoPilot Inc", logo: "from-orange-500 to-red-600", industry: "Autonomous Systems" },
          { boothNumber: "B-11", company: "SmartFab Japan", logo: "from-pink-500 to-rose-600", industry: "Smart Manufacturing" },
        ],
      },
      {
        id: "FH-003",
        eventId: "EVT-001",
        hallName: "3",
        hallLabel: "Hall 3 – Large Exhibits",
        mapImage: null,
        exhibitors: [
          { boothNumber: "C-01", company: "VoltGrid", logo: "from-amber-500 to-yellow-600", industry: "Energy Solutions" },
        ],
      },
    ],
  },
  {
    eventId: "EVT-002",
    eventTitle: "GreenBuild Summit 2025",
    overviewImage: null,
    halls: [
      {
        id: "FH-004",
        eventId: "EVT-002",
        hallName: "1",
        hallLabel: "Hall 1 – Sustainability Pavilion",
        mapImage: null,
        exhibitors: [
          { boothNumber: "A-03", company: "EcoBuild GmbH", logo: "from-lime-500 to-green-600", industry: "Green Construction" },
        ],
      },
      {
        id: "FH-005",
        eventId: "EVT-002",
        hallName: "2",
        hallLabel: "Hall 2 – Clean Energy",
        mapImage: null,
        exhibitors: [
          { boothNumber: "B-09", company: "SolarNord", logo: "from-sky-500 to-blue-600", industry: "Solar Energy" },
        ],
      },
    ],
  },
  {
    eventId: "EVT-003",
    eventTitle: "AutoDrive World Congress",
    overviewImage: null,
    halls: [
      {
        id: "FH-006",
        eventId: "EVT-003",
        hallName: "3",
        hallLabel: "Hall 3 – Autonomous Driving Arena",
        mapImage: null,
        exhibitors: [
          { boothNumber: "C-05", company: "DriveTech AI", logo: "from-violet-500 to-purple-600", industry: "Autonomous Driving" },
        ],
      },
    ],
  },
];
