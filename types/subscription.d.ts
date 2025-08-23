export interface SubscriptionTier {
  id: number;
  package_id: number;
  stripe_id: string;
  stripe_update: number;
  title: string;
  price: string;
  points: number;
  regional: number;
  continental: number;
  international: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SubscriptionBlog {
  title: string;
  image: string;
  created_at: string;
  slug: string;
}

export interface SubscriptionTour {
  title: string;
  image: string;
  created_at: string;
  slug: string;
}

export interface SubscriptionData {
  packages: SubscriptionTier[];
  blogs: SubscriptionBlog[];
  tours: SubscriptionTour[];
}

export interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionData;
}


