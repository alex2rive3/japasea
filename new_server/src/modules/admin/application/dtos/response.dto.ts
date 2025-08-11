export class AdminStatsResponseDto {
  totalUsers: number;
  totalPlaces: number;
  totalReviews: number;
  activeUsers: number;
  activePlaces: number;
  pendingReviews: number;
  recentActivity: {
    newUsers: number;
    newPlaces: number;
    newReviews: number;
  };
  topPlaces: Array<{
    _id: string;
    name: string;
    reviewCount: number;
    averageRating: number;
  }>;
  userGrowth: Array<{
    period: string;
    count: number;
  }>;
  placesByType: Array<{
    _id: string;
    count: number;
  }>;
  reviewsByRating: Array<{
    _id: number;
    count: number;
  }>;
}

export class PlaceStatsResponseDto {
  totalPlaces: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
  byType: Array<{
    _id: string;
    count: number;
  }>;
  featured: number;
  verified: number;
  averageRating: number;
  topRated: Array<{
    _id: string;
    name: string;
    rating: number;
  }>;
  recentlyAdded: Array<{
    _id: string;
    name: string;
    createdAt: string;
  }>;
}

export class UserDetailsResponseDto {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    languages?: string[];
  };
  metadata: {
    verified: boolean;
    emailVerified: boolean;
    suspended?: boolean;
    suspendedUntil?: string;
    suspensionReason?: string;
  };
  stats: {
    reviewCount: number;
    favoriteCount: number;
    placesVisited: number;
  };
  recentActivity: Array<{
    action: string;
    resource: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export class SystemSettingsResponseDto {
  [key: string]: {
    value: any;
    type: string;
    description?: string;
    isSystem: boolean;
  };
}
