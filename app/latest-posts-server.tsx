import { getAllPosts } from '@/lib/posts';
import { LatestPosts } from './latest-posts';

export default function LatestPostsServer() {
  const posts = getAllPosts();
  return <LatestPosts posts={posts} />;
}

