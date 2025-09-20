import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/data';
import { BlogPostClient } from './BlogPostClient';

interface Params { params: { slug: string } }

export function generateStaticParams() {
  // Pre-render all posts at build time
  return ['opening-ceremony-announcement', 'meet-the-seven-teams', 'shen-die-go-food-god-cup-introduction'].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post not found' };
  return { title: `Blog Post • 圣地亚哥华人网球俱乐部食神杯`, description: 'San Diego Chinese Tennis Club Food God Cup' };
}

export default function BlogPost({ params }: Params) {
  const post = getPostBySlug(params.slug);
  
  if (!post) return notFound();

  return <BlogPostClient post={post} />;
}
