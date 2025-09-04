export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  dateReceived: string;
  sentiment: "positive" | "negative" | "neutral";
  priority: "urgent" | "normal";
  category: string;
  extractedInfo: {
    contactDetails?: string;
    requirements?: string[];
    keywords?: string[];
  };
  aiResponse: string;
  status: "pending" | "processed" | "sent";
}

export const mockEmails: Email[] = [
  {
    id: "1",
    sender: "sarah.johnson@techcorp.com",
    subject: "Urgent Support Request - Cannot Access Dashboard",
    body: "Hi Support Team,\n\nI'm having critical issues accessing our company dashboard. This is preventing me from completing urgent client deliverables due today. I've tried refreshing and clearing cache but nothing works. Can someone please help immediately?\n\nContact: +1-555-0123\nClient: TechCorp Solutions\n\nThanks,\nSarah Johnson",
    dateReceived: "2024-12-04T09:15:00Z",
    sentiment: "negative",
    priority: "urgent",
    category: "Technical Support",
    extractedInfo: {
      contactDetails: "+1-555-0123",
      requirements: ["Dashboard access", "Urgent client deliverable"],
      keywords: ["critical", "urgent", "immediately", "dashboard", "access"]
    },
    aiResponse: "Dear Sarah,\n\nI understand how frustrating this must be, especially with urgent client deliverables pending. I'm escalating this to our technical team immediately.\n\nIn the meantime, please try:\n1. Use an incognito browser window\n2. Try accessing from a different device\n\nI'll personally monitor this issue and update you within 15 minutes.\n\nBest regards,\nSupport Team",
    status: "pending"
  },
  {
    id: "2",
    sender: "mike.chen@startup.io",
    subject: "Query about Premium Features",
    body: "Hello,\n\nI'm interested in learning more about your premium features. Our startup is growing and we need advanced analytics and reporting capabilities. Could you provide more details about pricing and features?\n\nEmail: mike.chen@startup.io\nCompany: StartupIO\n\nBest,\nMike Chen",
    dateReceived: "2024-12-04T08:45:00Z",
    sentiment: "positive",
    priority: "normal",
    category: "Sales Inquiry",
    extractedInfo: {
      contactDetails: "mike.chen@startup.io",
      requirements: ["Premium features", "Analytics", "Reporting", "Pricing info"],
      keywords: ["premium", "analytics", "reporting", "pricing"]
    },
    aiResponse: "Dear Mike,\n\nThank you for your interest in our premium features! I'm excited to help StartupIO scale with our advanced tools.\n\nOur premium package includes:\n- Advanced analytics dashboard\n- Custom reporting\n- Priority support\n- API access\n\nI'll send you a detailed proposal within the hour. Would you be available for a 15-minute demo this week?\n\nBest regards,\nSales Team",
    status: "pending"
  },
  {
    id: "3",
    sender: "lisa.wong@enterprise.com",
    subject: "Help with Integration Setup",
    body: "Hi there,\n\nWe're trying to integrate your API with our existing system but running into authentication issues. The documentation seems outdated. Can someone from the technical team assist?\n\nContact: lisa.wong@enterprise.com\nPhone: +1-555-0456\n\nThanks,\nLisa Wong",
    dateReceived: "2024-12-04T07:30:00Z",
    sentiment: "neutral",
    priority: "normal",
    category: "Technical Support",
    extractedInfo: {
      contactDetails: "lisa.wong@enterprise.com, +1-555-0456",
      requirements: ["API integration", "Authentication help", "Updated documentation"],
      keywords: ["integration", "API", "authentication", "documentation"]
    },
    aiResponse: "Dear Lisa,\n\nThank you for bringing this to our attention. I apologize for any confusion with the documentation.\n\nI'm connecting you with our technical integration specialist who will:\n1. Review your current setup\n2. Provide updated authentication guidelines\n3. Schedule a technical review call\n\nExpect contact within 2 hours.\n\nBest regards,\nTechnical Support",
    status: "pending"
  },
  {
    id: "4",
    sender: "customer@happyclient.com",
    subject: "Request for Additional Features",
    body: "Dear Team,\n\nWe've been using your service for 6 months and absolutely love it! The results have exceeded our expectations. We'd like to request some additional features for our growing team.\n\nCould we schedule a call to discuss custom solutions?\n\nContact: +1-555-0789\n\nBest wishes,\nHappy Client Team",
    dateReceived: "2024-12-04T06:15:00Z",
    sentiment: "positive",
    priority: "normal",
    category: "Feature Request",
    extractedInfo: {
      contactDetails: "+1-555-0789",
      requirements: ["Additional features", "Custom solutions", "Team growth"],
      keywords: ["love", "exceeded expectations", "additional features", "custom"]
    },
    aiResponse: "Dear Valued Client,\n\nThank you for the wonderful feedback! It's fantastic to hear that our service has exceeded your expectations.\n\nI'd be delighted to discuss custom solutions for your growing team. I'll have our customer success manager reach out to schedule a call at your convenience.\n\nWe truly appreciate your loyalty and look forward to supporting your continued growth.\n\nWarm regards,\nCustomer Success Team",
    status: "pending"
  },
  {
    id: "5",
    sender: "support@frustrated.com",
    subject: "Billing Support - Incorrect Charges",
    body: "This is extremely frustrating! I've been charged twice for the same service this month. I've called three times and no one has resolved this. I need this fixed immediately or I'm considering canceling my subscription.\n\nAccount: frustrated@support.com\nInvoice: #INV-2024-001\n\nVery disappointed,\nFrustrated Customer",
    dateReceived: "2024-12-04T10:30:00Z",
    sentiment: "negative",
    priority: "urgent",
    category: "Billing Support",
    extractedInfo: {
      contactDetails: "frustrated@support.com",
      requirements: ["Billing correction", "Refund", "Account review"],
      keywords: ["frustrated", "charged twice", "immediately", "canceling", "disappointed"]
    },
    aiResponse: "Dear Valued Customer,\n\nI sincerely apologize for this billing error and the frustration it has caused. This is absolutely not the experience we want for our customers.\n\nI'm immediately:\n1. Reviewing your account (INV-2024-001)\n2. Processing the duplicate charge refund\n3. Escalating to our billing manager\n\nYou'll receive a resolution and refund confirmation within 1 hour. I'm personally overseeing this case.\n\nThank you for your patience.\n\nSincerely,\nBilling Support Manager",
    status: "pending"
  }
];