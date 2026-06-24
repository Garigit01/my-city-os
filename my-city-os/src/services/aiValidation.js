import { dbService } from './firebase';

// Helper to calculate approximate distance in meters between two GPS coordinates
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

export const aiValidationService = {
  // Analyzes text and extracts priority level based on civic severity
  predictPriority: async (title = '', description = '') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const text = `${title} ${description}`.toLowerCase();

    // High severity emergencies
    const emergencyKeywords = [
      'burst', 'flooding', 'fire', 'leakage', 'gas leak', 'live wire', 
      'danger', 'collapsed', 'blast', 'water main', 'electric shock', 'hazard'
    ];
    // Serious issues
    const highKeywords = [
      'pothole', 'blocked road', 'sinkhole', 'falling tree', 'accident', 
      'manhole', 'broken pipe', 'sewer back', 'drainage block', 'stray animal'
    ];
    // Routine issues
    const mediumKeywords = [
      'street light', 'flickering', 'broken bulb', 'garbage', 'trash', 
      'waste bin', 'dead light', 'sidewalk damage', 'overgrown', 'odor', 'smell'
    ];

    if (emergencyKeywords.some(kw => text.includes(kw))) {
      return 'Emergency';
    }
    if (highKeywords.some(kw => text.includes(kw))) {
      return 'High';
    }
    if (mediumKeywords.some(kw => text.includes(kw))) {
      return 'Medium';
    }
    return 'Low';
  },

  // Scans existing database to detect duplicates within 200m in the same category
  checkDuplicate: async (category, latitude, longitude) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const activeComplaints = dbService.getComplaints().filter(
      c => c.category === category && c.status !== 'Resolved'
    );

    for (const comp of activeComplaints) {
      const distance = getDistanceInMeters(
        latitude,
        longitude,
        comp.latitude,
        comp.longitude
      );

      // Threshold: 200 meters
      if (distance < 200) {
        return {
          isDuplicate: true,
          duplicateIssue: comp,
          distance: Math.round(distance)
        };
      }
    }

    return { isDuplicate: false };
  }
};
