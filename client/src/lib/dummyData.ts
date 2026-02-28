export interface UserData {
  id: string;
  name: string;
  age: number;
  phone: string;
  city: string;
  creditScore: number;
  kycStatus: "Verified" | "Pending" | "Rejected";
  preApprovedLimit: number;
  existingLoan: number;
}

export const INITIAL_USERS: UserData[] = [
  {
    id: "1",
    name: "Rohan Sharma",
    age: 28,
    phone: "9876543210",
    city: "Mumbai",
    creditScore: 750,
    kycStatus: "Verified",
    preApprovedLimit: 500000,
    existingLoan: 0,
  },
  {
    id: "2",
    name: "Priya Patel",
    age: 34,
    phone: "9123456789",
    city: "Ahmedabad",
    creditScore: 820,
    kycStatus: "Verified",
    preApprovedLimit: 1200000,
    existingLoan: 200000,
  },
  {
    id: "3",
    name: "Amit Singh",
    age: 24,
    phone: "9988776655",
    city: "Delhi",
    creditScore: 650,
    kycStatus: "Verified",
    preApprovedLimit: 100000,
    existingLoan: 50000,
  },
  {
    id: "4",
    name: "Sneha Reddy",
    age: 45,
    phone: "9876123450",
    city: "Hyderabad",
    creditScore: 780,
    kycStatus: "Verified",
    preApprovedLimit: 800000,
    existingLoan: 0,
  },
  {
    id: "5",
    name: "Vikram Malhotra",
    age: 31,
    phone: "9000011111",
    city: "Bangalore",
    creditScore: 710,
    kycStatus: "Verified",
    preApprovedLimit: 300000,
    existingLoan: 0,
  },
  {
    id: "6",
    name: "Anjali Gupta",
    age: 29,
    phone: "9998887776",
    city: "Pune",
    creditScore: 680,
    kycStatus: "Pending",
    preApprovedLimit: 150000,
    existingLoan: 0,
  },
  {
    id: "7",
    name: "Rahul Verma",
    age: 40,
    phone: "9112233445",
    city: "Chennai",
    creditScore: 850,
    kycStatus: "Verified",
    preApprovedLimit: 2000000,
    existingLoan: 500000,
  },
  {
    id: "8",
    name: "Kavita Das",
    age: 25,
    phone: "8899776655",
    city: "Kolkata",
    creditScore: 620,
    kycStatus: "Verified",
    preApprovedLimit: 50000,
    existingLoan: 0,
  },
  {
    id: "9",
    name: "Arjun Nair",
    age: 38,
    phone: "9879879870",
    city: "Kochi",
    creditScore: 740,
    kycStatus: "Verified",
    preApprovedLimit: 600000,
    existingLoan: 100000,
  },
  {
    id: "10",
    name: "Meera Joshi",
    age: 32,
    phone: "9654321987",
    city: "Indore",
    creditScore: 790,
    kycStatus: "Verified",
    preApprovedLimit: 900000,
    existingLoan: 0,
  },
];
