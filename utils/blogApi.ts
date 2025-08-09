interface Blog {
  title: string;
  image: string;
  created_at: string;
  slug: string;
  content: string;
}

interface BlogResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}

export const fetchBlogs = async (): Promise<BlogResponse> => {
  try {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // Return empty response structure on error
    return {
      success: false,
      data: {
        blogs: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 0,
          from: 1,
          to: 0
        }
      }
    };
  }
};

export type { Blog, BlogResponse };
