export interface Customer {
  id: string;
  name: string;
  headcount: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  pipelineValue: number;
  pipelineStatus: 'none' | 'early' | 'negotiating' | 'closing';
  industry: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  type: 'company' | 'customer';
  customerId?: string;
}

export const customers: Customer[] = [
  { id: '1', name: 'Microsoft', headcount: 45, monthlyRevenue: 2850000, monthlyCosts: 1425000, pipelineValue: 1200000, pipelineStatus: 'negotiating', industry: 'Technology' },
  { id: '2', name: 'Amazon', headcount: 38, monthlyRevenue: 2400000, monthlyCosts: 1140000, pipelineValue: 800000, pipelineStatus: 'closing', industry: 'E-commerce' },
  { id: '3', name: 'Google', headcount: 32, monthlyRevenue: 2100000, monthlyCosts: 966000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Technology' },
  { id: '4', name: 'Apple', headcount: 28, monthlyRevenue: 1900000, monthlyCosts: 855000, pipelineValue: 500000, pipelineStatus: 'early', industry: 'Technology' },
  { id: '5', name: 'Meta', headcount: 25, monthlyRevenue: 1750000, monthlyCosts: 787500, pipelineValue: 650000, pipelineStatus: 'negotiating', industry: 'Technology' },
  { id: '6', name: 'JPMorgan Chase', headcount: 42, monthlyRevenue: 2600000, monthlyCosts: 1300000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Finance' },
  { id: '7', name: 'Bank of America', headcount: 35, monthlyRevenue: 2200000, monthlyCosts: 1100000, pipelineValue: 450000, pipelineStatus: 'early', industry: 'Finance' },
  { id: '8', name: 'Goldman Sachs', headcount: 22, monthlyRevenue: 1500000, monthlyCosts: 660000, pipelineValue: 900000, pipelineStatus: 'closing', industry: 'Finance' },
  { id: '9', name: 'Salesforce', headcount: 18, monthlyRevenue: 1200000, monthlyCosts: 540000, pipelineValue: 350000, pipelineStatus: 'negotiating', industry: 'Technology' },
  { id: '10', name: 'Oracle', headcount: 20, monthlyRevenue: 1350000, monthlyCosts: 607500, pipelineValue: 0, pipelineStatus: 'none', industry: 'Technology' },
  { id: '11', name: 'IBM', headcount: 24, monthlyRevenue: 1600000, monthlyCosts: 720000, pipelineValue: 280000, pipelineStatus: 'early', industry: 'Technology' },
  { id: '12', name: 'Cisco', headcount: 15, monthlyRevenue: 980000, monthlyCosts: 441000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Technology' },
  { id: '13', name: 'Intel', headcount: 17, monthlyRevenue: 1100000, monthlyCosts: 495000, pipelineValue: 420000, pipelineStatus: 'negotiating', industry: 'Technology' },
  { id: '14', name: 'NVIDIA', headcount: 30, monthlyRevenue: 2000000, monthlyCosts: 900000, pipelineValue: 1500000, pipelineStatus: 'closing', industry: 'Technology' },
  { id: '15', name: 'Tesla', headcount: 26, monthlyRevenue: 1800000, monthlyCosts: 810000, pipelineValue: 600000, pipelineStatus: 'early', industry: 'Automotive' },
  { id: '16', name: 'Walmart', headcount: 19, monthlyRevenue: 1250000, monthlyCosts: 562500, pipelineValue: 0, pipelineStatus: 'none', industry: 'Retail' },
  { id: '17', name: 'Target', headcount: 12, monthlyRevenue: 780000, monthlyCosts: 351000, pipelineValue: 200000, pipelineStatus: 'early', industry: 'Retail' },
  { id: '18', name: 'Home Depot', headcount: 14, monthlyRevenue: 920000, monthlyCosts: 414000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Retail' },
  { id: '19', name: 'Pfizer', headcount: 21, monthlyRevenue: 1400000, monthlyCosts: 630000, pipelineValue: 380000, pipelineStatus: 'negotiating', industry: 'Healthcare' },
  { id: '20', name: 'Johnson & Johnson', headcount: 23, monthlyRevenue: 1550000, monthlyCosts: 697500, pipelineValue: 0, pipelineStatus: 'none', industry: 'Healthcare' },
  { id: '21', name: 'UnitedHealth', headcount: 29, monthlyRevenue: 1950000, monthlyCosts: 877500, pipelineValue: 750000, pipelineStatus: 'closing', industry: 'Healthcare' },
  { id: '22', name: 'Chevron', headcount: 16, monthlyRevenue: 1050000, monthlyCosts: 472500, pipelineValue: 0, pipelineStatus: 'none', industry: 'Energy' },
  { id: '23', name: 'ExxonMobil', headcount: 18, monthlyRevenue: 1200000, monthlyCosts: 540000, pipelineValue: 320000, pipelineStatus: 'early', industry: 'Energy' },
  { id: '24', name: 'Lockheed Martin', headcount: 27, monthlyRevenue: 1850000, monthlyCosts: 832500, pipelineValue: 550000, pipelineStatus: 'negotiating', industry: 'Defense' },
  { id: '25', name: 'Boeing', headcount: 24, monthlyRevenue: 1620000, monthlyCosts: 729000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Aerospace' },
  { id: '26', name: 'Raytheon', headcount: 20, monthlyRevenue: 1340000, monthlyCosts: 603000, pipelineValue: 480000, pipelineStatus: 'early', industry: 'Defense' },
  { id: '27', name: 'Disney', headcount: 22, monthlyRevenue: 1480000, monthlyCosts: 666000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Entertainment' },
  { id: '28', name: 'Netflix', headcount: 11, monthlyRevenue: 720000, monthlyCosts: 324000, pipelineValue: 250000, pipelineStatus: 'negotiating', industry: 'Entertainment' },
  { id: '29', name: 'Spotify', headcount: 8, monthlyRevenue: 520000, monthlyCosts: 234000, pipelineValue: 180000, pipelineStatus: 'early', industry: 'Entertainment' },
  { id: '30', name: 'Adobe', headcount: 15, monthlyRevenue: 980000, monthlyCosts: 441000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Technology' },
  // UNPROFITABLE CUSTOMERS - costs exceed revenue
  { id: '31', name: 'Rivian', headcount: 18, monthlyRevenue: 450000, monthlyCosts: 680000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Automotive' },
  { id: '32', name: 'WeWork', headcount: 14, monthlyRevenue: 380000, monthlyCosts: 520000, pipelineValue: 150000, pipelineStatus: 'early', industry: 'Real Estate' },
  { id: '33', name: 'Peloton', headcount: 11, monthlyRevenue: 290000, monthlyCosts: 410000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Fitness' },
  { id: '34', name: 'Instacart', headcount: 9, monthlyRevenue: 320000, monthlyCosts: 385000, pipelineValue: 200000, pipelineStatus: 'negotiating', industry: 'E-commerce' },
  { id: '35', name: 'DoorDash', headcount: 12, monthlyRevenue: 410000, monthlyCosts: 495000, pipelineValue: 0, pipelineStatus: 'none', industry: 'Logistics' },
  // Additional profitable customers
  { id: '36', name: 'Shopify', headcount: 10, monthlyRevenue: 650000, monthlyCosts: 292500, pipelineValue: 300000, pipelineStatus: 'closing', industry: 'E-commerce' },
  { id: '37', name: 'Stripe', headcount: 9, monthlyRevenue: 580000, monthlyCosts: 261000, pipelineValue: 220000, pipelineStatus: 'negotiating', industry: 'Fintech' },
  { id: '38', name: 'Square', headcount: 7, monthlyRevenue: 450000, monthlyCosts: 202500, pipelineValue: 0, pipelineStatus: 'none', industry: 'Fintech' },
  { id: '39', name: 'Palantir', headcount: 13, monthlyRevenue: 850000, monthlyCosts: 382500, pipelineValue: 400000, pipelineStatus: 'early', industry: 'Technology' },
  { id: '40', name: 'Snowflake', headcount: 11, monthlyRevenue: 720000, monthlyCosts: 324000, pipelineValue: 280000, pipelineStatus: 'negotiating', industry: 'Technology' },
];

export const expenses: Expense[] = [
  // Company-wide expenses
  { id: 'e1', category: 'Personnel', description: 'Executive Salaries', amount: 850000, type: 'company' },
  { id: 'e2', category: 'Personnel', description: 'HR & Admin Staff', amount: 320000, type: 'company' },
  { id: 'e3', category: 'Facilities', description: 'HQ Office Lease', amount: 185000, type: 'company' },
  { id: 'e4', category: 'Facilities', description: 'Regional Offices', amount: 95000, type: 'company' },
  { id: 'e5', category: 'Technology', description: 'Internal IT Infrastructure', amount: 125000, type: 'company' },
  { id: 'e6', category: 'Technology', description: 'Software Licenses', amount: 78000, type: 'company' },
  { id: 'e7', category: 'Operations', description: 'Insurance & Legal', amount: 145000, type: 'company' },
  { id: 'e8', category: 'Operations', description: 'Training & Development', amount: 65000, type: 'company' },
  { id: 'e9', category: 'Marketing', description: 'Brand & Advertising', amount: 210000, type: 'company' },
  { id: 'e10', category: 'Marketing', description: 'Events & Conferences', amount: 85000, type: 'company' },
  
  // Customer-specific expenses
  { id: 'ce1', category: 'Travel', description: 'On-site Consulting', amount: 45000, type: 'customer', customerId: '1' },
  { id: 'ce2', category: 'Technology', description: 'Dedicated Infrastructure', amount: 32000, type: 'customer', customerId: '1' },
  { id: 'ce3', category: 'Travel', description: 'Client Meetings', amount: 28000, type: 'customer', customerId: '2' },
  { id: 'ce4', category: 'Technology', description: 'Custom Development Tools', amount: 55000, type: 'customer', customerId: '6' },
  { id: 'ce5', category: 'Personnel', description: 'Dedicated Account Team', amount: 120000, type: 'customer', customerId: '14' },
  { id: 'ce6', category: 'Travel', description: 'Executive Visits', amount: 18000, type: 'customer', customerId: '3' },
  { id: 'ce7', category: 'Technology', description: 'Security Compliance', amount: 42000, type: 'customer', customerId: '8' },
  { id: 'ce8', category: 'Operations', description: 'Compliance Audits', amount: 35000, type: 'customer', customerId: '21' },
  { id: 'ce9', category: 'Travel', description: 'Training Delivery', amount: 22000, type: 'customer', customerId: '5' },
  { id: 'ce10', category: 'Technology', description: 'API Integration Support', amount: 38000, type: 'customer', customerId: '9' },
];

export const getTotalHeadcount = () => customers.reduce((sum, c) => sum + c.headcount, 0);
export const getTotalRevenue = () => customers.reduce((sum, c) => sum + c.monthlyRevenue, 0);
export const getTotalCosts = () => customers.reduce((sum, c) => sum + c.monthlyCosts, 0);
export const getTotalPipeline = () => customers.reduce((sum, c) => sum + c.pipelineValue, 0);
export const getCompanyExpenses = () => expenses.filter(e => e.type === 'company').reduce((sum, e) => sum + e.amount, 0);
export const getCustomerExpenses = () => expenses.filter(e => e.type === 'customer').reduce((sum, e) => sum + e.amount, 0);
