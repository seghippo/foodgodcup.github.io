import { NextResponse } from 'next/server';
import { getFoodPostsFromFirebase } from '@/lib/firebase-data';

export async function GET() {
  try {
    const posts = await getFoodPostsFromFirebase();
    
    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        author: post.author,
        authorTeam: post.authorTeam,
        content: post.content,
        tags: post.tags,
        location: post.location,
        likes: post.likes,
        commentsCount: post.comments.length,
        createdAt: post.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching food data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch food data' },
      { status: 500 }
    );
  }
}

