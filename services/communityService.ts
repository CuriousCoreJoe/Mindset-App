
import { CommunityPost, Quote } from "../types";

// This service mocks a backend for community features.
// In a real app, these would be API calls to a database.

const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    userId: 'user_123',
    username: 'ZenWalker',
    content: '"The only way out is through." - This quote really helped me today.',
    type: 'shared_quote',
    likes: 12,
    timestamp: Date.now() - 100000,
    tags: ['Resilience']
  }
];

export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_POSTS;
};

export const shareQuoteToCommunity = async (quote: Quote, thoughts: string): Promise<boolean> => {
  console.log("Sharing quote to community:", quote, thoughts);
  return true;
};

export const likePost = async (postId: string): Promise<boolean> => {
  console.log("Liking post:", postId);
  return true;
};
