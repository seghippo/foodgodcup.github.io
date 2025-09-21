'use client';

import { useState, useEffect } from 'react';
import { getFoodPosts, addFoodPost, addFoodComment, likeFoodPost, likeFoodComment, subscribeToFoodPostsRealtime, type FoodPost, type FoodComment } from '@/lib/data';
import { useLanguage } from '@/lib/language';
import { compressImage, isValidImageFile, formatFileSize, type CompressedImageResult } from '@/lib/imageUtils';

export default function FoodPage() {
  const { t, isClient } = useLanguage();
  const [posts, setPosts] = useState<FoodPost[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    authorTeam: '',
    authorId: '',
    tags: [] as string[],
    location: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [currentUser] = useState('TJ01'); // Mock current user

  useEffect(() => {
    if (isClient) {
      // Set up real-time subscription to Firebase
      const unsubscribe = subscribeToFoodPostsRealtime((firebasePosts) => {
        setPosts(firebasePosts);
      });

      // Also load initial data as fallback
      getFoodPosts().then((initialPosts) => {
        if (initialPosts.length > 0) {
          setPosts(initialPosts);
        }
      });

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    }
  }, [isClient]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert('请选择有效的图片文件 (JPG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('图片文件过大，请选择小于10MB的图片');
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImage(file, 300, 0.8);
      setSelectedImage(compressed);
      setNewPost({ ...newPost, imageUrl: compressed.dataUrl });
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('图片压缩失败，请重试');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setNewPost({ ...newPost, imageUrl: '' });
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        const post = await addFoodPost({
          ...newPost,
          author: newPost.author || '匿名用户',
          authorId: currentUser
        });
        
        if (post) {
          setNewPost({
            title: '',
            content: '',
            author: '',
            authorTeam: '',
            authorId: '',
            tags: [],
            location: '',
            imageUrl: ''
          });
          setSelectedImage(null);
          setShowNewPostForm(false);
        }
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    }
  };

  const handleSubmitComment = async (postId: string) => {
    const content = newComment[postId];
    if (content?.trim()) {
      try {
        const comment = await addFoodComment(postId, {
          postId,
          author: '匿名用户',
          content: content.trim()
        });
        
        if (comment) {
          setNewComment({ ...newComment, [postId]: '' });
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likeFoodPost(postId, currentUser);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLikeComment = async (postId: string, commentId: string) => {
    try {
      await likeFoodComment(postId, commentId, currentUser);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `food-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-league-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-league-primary dark:text-white mb-4">
          美食汇 / Food Sharing
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          分享你的美食心得，推荐好吃的餐厅，交流烹饪技巧，让美食成为我们友谊的桥梁！
        </p>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <button
          onClick={() => setShowNewPostForm(!showNewPostForm)}
          className="btn-gold"
        >
          {showNewPostForm ? '取消发布' : '发布美食分享'}
        </button>
        <button
          onClick={handleExportData}
          className="btn-primary"
          title="导出美食数据"
        >
          📥 导出数据
        </button>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">发布新的美食分享</h2>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                placeholder="例如：圣地亚哥最好吃的川菜馆推荐"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">内容</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                rows={4}
                placeholder="分享你的美食体验..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">作者</label>
                <input
                  type="text"
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                  placeholder="你的名字"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">所属队伍</label>
                <input
                  type="text"
                  value={newPost.authorTeam}
                  onChange={(e) => setNewPost({ ...newPost, authorTeam: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                  placeholder="例如：天津狗不理包子队"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">地点（可选）</label>
              <input
                type="text"
                value={newPost.location}
                onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                placeholder="例如：Convoy Street, San Diego"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2">美食图片（可选）</label>
              <div className="space-y-3">
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-league-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isCompressing}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isCompressing ? '正在压缩图片...' : '点击选择图片或拖拽到此处'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        支持 JPG, PNG, GIF, WebP，最大10MB，自动压缩至300px
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={selectedImage.dataUrl}
                        alt="Selected food"
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                      <p>原始大小: {formatFileSize(selectedImage.originalSize)}</p>
                      <p>压缩后: {formatFileSize(selectedImage.compressedSize)}</p>
                      <p>压缩率: {(selectedImage.compressionRatio * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-league-primary text-white rounded-lg hover:bg-league-highlight transition-colors"
              >
                发布分享
              </button>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Food Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-league-primary dark:text-white mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <span>👤 {post.author}</span>
                  {post.authorTeam && <span>🏆 {post.authorTeam}</span>}
                  <span>📅 {formatDate(post.createdAt)}</span>
                  {post.location && <span>📍 {post.location}</span>}
                </div>
              </div>
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  post.likedBy.includes(currentUser)
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Display Image if exists */}
            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Food image"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.open(post.imageUrl, '_blank')}
                />
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-league-accent/20 text-league-accent rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="font-medium mb-3">评论 ({post.comments.length})</h4>
              
              {/* Comment Form */}
              <div className="mb-4">
                <textarea
                  value={newComment[post.id] || ''}
                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                  rows={2}
                  placeholder="写下你的评论..."
                />
                <button
                  onClick={() => handleSubmitComment(post.id)}
                  className="mt-2 px-4 py-1 bg-league-primary text-white rounded-lg hover:bg-league-highlight transition-colors text-sm"
                >
                  发表评论
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{comment.author}</span>
                        {comment.authorTeam && (
                          <span className="text-slate-500">• {comment.authorTeam}</span>
                        )}
                        <span className="text-slate-500">• {formatDate(comment.createdAt)}</span>
                      </div>
                      <button
                        onClick={() => handleLikeComment(post.id, comment.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs ${
                          comment.likedBy.includes(currentUser)
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        <span>❤️</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            还没有美食分享
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            成为第一个分享美食心得的人吧！
          </p>
        </div>
      )}
    </div>
  );
}
