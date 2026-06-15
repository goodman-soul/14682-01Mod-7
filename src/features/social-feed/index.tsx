import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, User, Clock, MoreVertical, Send, Image, Smile } from 'lucide-react';
import { currentConfig } from '@/configs';

const SocialFeed: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: '张小明',
      avatar: '👨‍💼',
      content: '今天完成了一个重要的项目里程碑！团队协作非常顺利，感谢大家的努力 💪',
      time: '2小时前',
      likes: 24,
      comments: 8,
      liked: false,
      image: null,
    },
    {
      id: 2,
      author: '李小红',
      avatar: '👩‍🎨',
      content: '分享一张今天拍摄的美丽日落 🌅 工作之余也要记得欣赏生活中的美好瞬间',
      time: '4小时前',
      likes: 45,
      comments: 12,
      liked: true,
      image: '🌅',
    },
    {
      id: 3,
      author: '王小华',
      avatar: '👨‍🔬',
      content: '刚刚参加了一个很有意义的技术分享会，学到了很多新知识和最佳实践。技术在不断进步，我们也要持续学习！',
      time: '6小时前',
      likes: 18,
      comments: 5,
      liked: false,
      image: null,
    },
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: '当前用户',
        avatar: '😊',
        content: newPost,
        time: '刚刚',
        likes: 0,
        comments: 0,
        liked: false,
        image: null,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{currentConfig.name} - 团队动态</h1>
        <p className="text-gray-600 mt-1">连接团队成员，共享每一个精彩瞬间</p>
      </div>

      {/* 发布新动态 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
            😊
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="分享你的想法..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <div />
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
                <span>发布</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 动态列表 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            {/* 动态头部 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                  {post.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* 动态内容 */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{post.content}</p>
              {post.image && (
                <div className="mt-3">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-2">{post.image}</div>
                    <p className="text-gray-500">图片内容</p>
                  </div>
                </div>
              )}
            </div>

            {/* 动态操作 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    post.liked
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MessageCircle size={16} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 size={16} />
                  <span className="text-sm font-medium">分享</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;