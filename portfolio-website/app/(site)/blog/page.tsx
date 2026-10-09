import type { Metadata } from 'next';
import BlogList from '@/components/sections/BlogList';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Thoughts on design, editing and creative technology by Swastik Gupta.',
};

export default function BlogPage() {
  return <BlogList />;
}
