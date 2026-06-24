// Offline Firestore-like mock database stored in localStorage
const COMPLAINTS_KEY = 'mycity_complaints';
const COMMENTS_KEY = 'mycity_comments';

// Pre-seeded complaints for realistic visualization
const SEED_COMPLAINTS = [
  {
    id: 'comp-101',
    title: 'Burst Water Pipeline near Outer Circle',
    category: 'Water Supply',
    description: 'Clean drinking water is leaking from a main pipe crack on the side of the road, wasting thousands of gallons of water and creating a muddy pool.',
    latitude: 28.6145,
    longitude: 77.2285,
    address: 'Inner Circle near Sector 4, Connaught Place, New Delhi',
    status: 'Submitted', // Submitted, Assigned, In Progress, Resolved
    priority: 'Emergency', // Low, Medium, High, Emergency
    reporterEmail: 'citizen@city.os',
    reporterName: 'Jane Doe',
    workerEmail: null,
    workerName: null,
    createdAt: '2026-06-23T10:30:00.000Z',
    updatedAt: '2026-06-23T10:30:00.000Z',
    imageBefore: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=400',
    imageAfter: null,
    notes: [],
    upvotes: 8,
    upvotedBy: []
  },
  {
    id: 'comp-102',
    title: 'Hazardous Pothole on Parliament Street',
    category: 'Roads & Potholes',
    description: 'A deep pothole has opened up in the middle lane of Parliament Street. Multiple cars have swerved dangerously to avoid it. High risk for motorbikes.',
    latitude: 28.6120,
    longitude: 77.2250,
    address: 'Parliament Street Area, Sansad Marg, New Delhi',
    status: 'Assigned',
    priority: 'High',
    reporterEmail: 'citizen@city.os',
    reporterName: 'Jane Doe',
    workerEmail: 'worker@city.os',
    workerName: 'Officer Dave',
    createdAt: '2026-06-22T08:15:00.000Z',
    updatedAt: '2026-06-23T14:00:00.000Z',
    imageBefore: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400',
    imageAfter: null,
    notes: ['Assigned to Sanitation & Roads team for road patching.'],
    upvotes: 14,
    upvotedBy: []
  },
  {
    id: 'comp-103',
    title: 'Flickering and Broken Street Lights',
    category: 'Electricity & Lighting',
    description: 'Three consecutive street lights are completely dead and one is flickering constantly on Tolstoy Marg, making the sidewalk pitch black after sunset.',
    latitude: 28.6110,
    longitude: 77.2310,
    address: 'Janpath Market, Tolstoy Marg Cross, New Delhi',
    status: 'In Progress',
    priority: 'Medium',
    reporterEmail: 'other.citizen@city.os',
    reporterName: 'Aarav Sharma',
    workerEmail: 'worker@city.os',
    workerName: 'Officer Dave',
    createdAt: '2026-06-21T18:45:00.000Z',
    updatedAt: '2026-06-24T09:30:00.000Z',
    imageBefore: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&q=80&w=400',
    imageAfter: null,
    notes: ['Officer Dave: Replacement bulbs ordered. Repair crew currently on site.'],
    upvotes: 4,
    upvotedBy: []
  },
  {
    id: 'comp-104',
    title: 'Overflowing Public Waste Bin',
    category: 'Sanitation & Waste',
    description: 'The green community garbage bin at Tolstoy Marg is overflowing. Waste is scattered on the footpath and stray animals are tearing bags.',
    latitude: 28.6130,
    longitude: 77.2330,
    address: 'Kasturba Gandhi Marg, Near British Council, New Delhi',
    status: 'Resolved',
    priority: 'Medium',
    reporterEmail: 'citizen@city.os',
    reporterName: 'Jane Doe',
    workerEmail: 'worker@city.os',
    workerName: 'Officer Dave',
    createdAt: '2026-06-20T11:00:00.000Z',
    updatedAt: '2026-06-22T16:20:00.000Z',
    imageBefore: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400',
    imageAfter: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400',
    notes: ['Cleared and pressure-washed the surrounding concrete. Waste disposed at central landfill.'],
    upvotes: 23,
    upvotedBy: []
  }
];

const SEED_COMMENTS = [
  {
    id: 'comm-1',
    complaintId: 'comp-102',
    userName: 'Officer Dave',
    userRole: 'worker',
    content: 'We have received this work order. Patching asphalt is scheduled for tomorrow morning.',
    createdAt: '2026-06-23T14:02:00.000Z'
  },
  {
    id: 'comm-2',
    complaintId: 'comp-102',
    userName: 'Jane Doe',
    userRole: 'citizen',
    content: 'Thank you! It is really dangerous for bikes.',
    createdAt: '2026-06-23T14:30:00.000Z'
  }
];

// Initialize DB with seed data if empty
export const initDb = () => {
  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SEED_COMPLAINTS));
  }
  if (!localStorage.getItem(COMMENTS_KEY)) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
  }
};

// Exported Service Methods (imitating Firestore / Firebase SDK calls)
export const dbService = {
  getComplaints: () => {
    initDb();
    return JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
  },

  getComplaintById: (id) => {
    initDb();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    return complaints.find(c => c.id === id) || null;
  },

  addComplaint: (complaintData) => {
    initDb();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const newComplaint = {
      id: `comp-${Date.now()}`,
      upvotes: 1,
      upvotedBy: [complaintData.reporterEmail],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageAfter: null,
      notes: [],
      workerEmail: null,
      workerName: null,
      ...complaintData
    };
    complaints.unshift(newComplaint);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return newComplaint;
  },

  updateComplaintStatus: (id, status, workerEmail = null, workerName = null, imageAfter = null, notes = null) => {
    initDb();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = status;
      complaints[index].updatedAt = new Date().toISOString();
      if (workerEmail) complaints[index].workerEmail = workerEmail;
      if (workerName) complaints[index].workerName = workerName;
      if (imageAfter) complaints[index].imageAfter = imageAfter;
      if (notes) complaints[index].notes.push(notes);
      
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
      return complaints[index];
    }
    throw new Error('Complaint not found.');
  },

  assignComplaint: (id, workerEmail, workerName) => {
    return dbService.updateComplaintStatus(id, 'Assigned', workerEmail, workerName, null, `Assigned to worker ${workerName}`);
  },

  upvoteComplaint: (id, userEmail) => {
    initDb();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      const upvotedBy = complaints[index].upvotedBy || [];
      if (upvotedBy.includes(userEmail)) {
        // Undo upvote
        complaints[index].upvotedBy = upvotedBy.filter(email => email !== userEmail);
        complaints[index].upvotes = Math.max(0, complaints[index].upvotes - 1);
      } else {
        // Do upvote
        complaints[index].upvotedBy.push(userEmail);
        complaints[index].upvotes = (complaints[index].upvotes || 0) + 1;
      }
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
      return complaints[index];
    }
    throw new Error('Complaint not found.');
  },

  getComments: (complaintId) => {
    initDb();
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    return comments.filter(c => c.complaintId === complaintId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  addComment: (complaintId, userName, userRole, content) => {
    initDb();
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
    const newComment = {
      id: `comm-${Date.now()}`,
      complaintId,
      userName,
      userRole,
      content,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    return newComment;
  }
};
