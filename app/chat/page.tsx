
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw, Router } from 'lucide-react';
import { Sidebar, useSidebarCollapsed } from '@/components/layout/Sidebar';
import { useAuthStore, useChatStore, ChatMessage } from '@/lib/store';
import { useUserContext } from '@/lib/user-context';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import ContentHeader from '@/components/layout/ContentHeader';
import { useRouter } from 'next/navigation';

// Component để render nội dung AI với formatting đẹp
const FormattedAIResponse = ({ content }: { content: string }) => {
  return <FormattedContent content={content} />;
};

export default function ChatPage() {
  const router = useRouter();
  const sidebarCollapsed = useSidebarCollapsed();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, token } = useAuthStore();
  const { messages, isLoading, addMessage, setLoading, sessionId, setSessionId, clearMessages } = useChatStore();
  const userContext = useUserContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo session khi component mount
  useEffect(() => {
    const initSession = async () => {
      if (!sessionId && token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat/new-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setSessionId(data.sessionId || data.session_id);
          }
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      }
    };

    initSession();
  }, [sessionId, token, setSessionId]);

  const handleRefresh = async () => {
    if (isLoading) return;

    // Clear messages
    clearMessages();

    // Reset session (dùng empty string thay vì null)
    setSessionId('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat/new-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId || data.session_id);
        toast.success('Đã làm mới cuộc trò chuyện!');
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      toast.error('Không thể làm mới, vui lòng thử lại');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage = input.trim();
    setInput('');

    addMessage({
      content: userMessage,
      role: 'user'
    });

    setLoading(true);

    try {
      const { token, user } = useAuthStore.getState();
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat`;

      // Chuẩn bị user_context từ user profile với validation
      const requestBody = {
        domain: "chatbot",
        feature_type: "question",
        user_context: {
          name: user?.name || "User",
          gender: user?.gender || "other",
          birth_date: user?.birth_date || "2000-01-01",
          birth_time: user?.birth_time || "12:00",
          birth_place: user?.birth_place || "Việt Nam"
        },
        data: {
          sessionId: sessionId,
          question: userMessage
        }
      };

      console.log('Sending chat request:', { ...requestBody, token: '***' });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Chat response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API error:', errorData);

        if (response.status === 401) {
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          return;
        } else if (response.status === 429) {
          toast.error('Bạn đã hỏi quá nhiều. Vui lòng thử lại sau.');
          return;
        } else if (response.status === 403) {
          toast.error('Bạn đã hết lượt sử dụng. Vui lòng nâng cấp VIP.');
          return;
        } else if (response.status === 500) {
          const errorMsg = errorData.message || errorData.error || 'Lỗi server';
          toast.error(`Lỗi server: ${errorMsg}`);

          // Hiển thị chi tiết lỗi trong development mode
          if (process.env.NODE_ENV === 'development') {
            addMessage({
              content: `❌ **Lỗi 500 - Internal Server Error**\n\n${errorMsg}\n\nChi tiết: ${JSON.stringify(errorData, null, 2)}`,
              role: 'assistant'
            });
          }
          return;
        }

        throw new Error(errorData.message || errorData.error || 'Không thể lấy phản hồi từ AI');
      }

      const responseData = await response.json();
      console.log('Chat response data:', responseData);

      // Xử lý response từ backend
      let aiAnswer = null;

      // Backend trả về: { data: "string" } - data là STRING trực tiếp
      if (responseData.data && typeof responseData.data === 'string') {
        aiAnswer = responseData.data;
      }
      // Nếu data là object có reply/answer
      else if (responseData.data && typeof responseData.data === 'object') {
        aiAnswer = responseData.data.reply || responseData.data.answer || responseData.data.message;
      }
      // Lambda proxy format
      else if (responseData.body && typeof responseData.body === 'string') {
        try {
          const parsedBody = JSON.parse(responseData.body);
          aiAnswer = parsedBody.reply || parsedBody.answer || parsedBody.message || parsedBody.data;
        } catch (parseError) {
          console.error('Failed to parse response body:', parseError);
          aiAnswer = responseData.body;
        }
      }
      // Direct response format
      else {
        aiAnswer = responseData.reply || responseData.answer || responseData.message;
      }

      console.log('Extracted AI answer:', aiAnswer);

      if (aiAnswer) {
        // Đảm bảo content là string
        const content = typeof aiAnswer === 'string'
          ? aiAnswer
          : JSON.stringify(aiAnswer, null, 2);

        addMessage({
          content: content,
          role: 'assistant'
        });
      } else {
        console.error('No AI answer found in response:', responseData);
        toast.error('AI không trả lời được. Vui lòng thử lại hoặc hỏi câu khác.');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = error.message || 'Có lỗi xảy ra khi kết nối với AI';
      toast.error(errorMessage);

      // Thêm error message vào chat nếu cần debug
      if (process.env.NODE_ENV === 'development') {
        addMessage({
          content: `❌ Lỗi: ${errorMessage}`,
          role: 'assistant'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white">
      <AnimatedBackground />
      <Sidebar />

      <main
        className="flex-1 flex flex-col transition-all duration-200 relative z-10"
        style={{ marginLeft: sidebarCollapsed ? '10px' : '280px' }}
      >
        {/* Header */}
        <ContentHeader
          title="AI Chat Huyền Thuật"
          description="Trò chuyện với AI về thế giới bí ẩn"
        >
          {/* Nút Refresh được đưa vào children của ContentHeader */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Làm mới cuộc trò chuyện"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 transition-transform duration-300 group-hover:rotate-180 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-300">Làm mới</span>
          </button>
        </ContentHeader>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md relative"
                >
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                  <Sparkles className="w-12 h-12 text-blue-300 relative z-10" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  Chào mừng đến với AI Chat
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 mb-10 max-w-lg mx-auto text-lg font-light"
                >
                  Hãy bắt đầu cuộc trò chuyện với AI huyền thuật. Tôi có thể giúp bạn khám phá những bí ẩn của vũ trụ.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {[
                    "Tử vi hôm nay của tôi thế nào?",
                    "Ý nghĩa của giấc mơ tôi vừa có?",
                    "Làm thế nào để tìm được tình yêu?",
                    "Sự nghiệp của tôi sẽ ra sao?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="px-5 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl text-sm text-gray-300 hover:text-white transition-all cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} user={user} />
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border border-white/10">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl rounded-tl-none px-6 py-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        {/* Spinner thuần túy, không còn chữ "Đang tải..." thừa thãi */}
                        <LoadingSpinner size="sm" color="text-purple-400" />
                        <span className="text-sm text-gray-300 animate-pulse">AI đang suy nghĩ...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4 relative">
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="w-full px-6 py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all relative z-10"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                isLoading={isLoading}
                className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const MessageBubble = ({ message, user }: { message: ChatMessage; user: any }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/10 ${isUser
        ? 'bg-gradient-to-br from-red-500 to-pink-600'
        : 'bg-gradient-to-br from-purple-600 to-indigo-600'
        }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className={`max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-6 py-4 rounded-2xl shadow-lg backdrop-blur-md border ${isUser
          ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/20 text-white rounded-tr-none'
          : 'bg-white/5 border-white/10 text-gray-100 rounded-tl-none'
          }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <FormattedAIResponse content={message.content} />
          )}
        </div>
        <p className={`text-xs text-gray-500 mt-2 font-medium ${isUser ? 'mr-2' : 'ml-2'}`}>
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </motion.div>
  );
};
