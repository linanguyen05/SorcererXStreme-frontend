'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Search, Loader2, ShieldAlert, Ban, ShieldCheck, 
  Image as ImageIcon, Paperclip, Mic, Square, Download, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/lib/store'; 
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'; 
import toast from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:4000';
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=4f46e5&color=fff&bold=true&name=";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio';
  timestamp: string;
}

interface ChatContact {
  id: string;
  name: string;
  is_vip?: boolean;
  vip_tier?: string;
}

export default function ExpertChat() {
  const { user, isAuthenticated } = useAuthStore(); 
  const [isOpen, setIsOpen] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [recentContacts, setRecentContacts] = useState<ChatContact[]>([]);
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [iBlockedThem, setIBlockedThem] = useState(false);
  const [theyBlockedMe, setTheyBlockedMe] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<any>(null);

  const socket = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    socket.current = io(SOCKET_URL);
    socket.current.on('receive_private_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      fetchRecentContacts();
    });
    return () => { socket.current?.disconnect(); };
  }, [user?.id]);

  const fetchRecentContacts = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/contacts?userId=${user.id}`);
      const data = await res.json();
      setRecentContacts(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (isOpen && user?.id) fetchRecentContacts();
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setContacts([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`${SOCKET_URL}/api/users/search?q=${query}&currentUserId=${user?.id}`);
      const data = await res.json();
      setContacts(data);
    } finally { setIsSearching(false); }
  };

  const selectContact = async (contact: ChatContact) => {
    setActiveContact(contact);
    setSearchQuery(''); // Xóa search để sidebar thu nhỏ lại trên mobile
    socket.current?.emit('join_private_room', { userId: user?.id, contactId: contact.id });
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/history?userId=${user?.id}&contactId=${contact.id}`);
      const data = await res.json();
      setMessages(data.messages);
      setIBlockedThem(data.iBlockedThem);
      setTheyBlockedMe(data.theyBlockedMe);
    } catch (error) { toast.error("Lỗi tải tin nhắn"); }
  };

  const toggleBlock = async () => {
    if (!activeContact || !user) return;
    const apiEndpoint = iBlockedThem ? '/api/chat/unblock' : '/api/chat/block';
    try {
      const res = await fetch(`${SOCKET_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, blockedId: activeContact.id })
      });
      if (res.ok) {
        toast.success(iBlockedThem ? `Đã bỏ chặn ${activeContact.name}` : `Đã chặn ${activeContact.name}`);
        setIBlockedThem(!iBlockedThem);
        setShowBlockModal(false);
        fetchRecentContacts();
      }
    } catch (error) { toast.error("Thao tác thất bại"); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !activeContact || !user) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      socket.current?.emit('send_private_message', { senderId: user.id, receiverId: activeContact.id, content: data.url, type });
    } catch (error) { toast.error("Tải tệp lên thất bại"); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const formData = new FormData();
        formData.append('file', blob, 'voice-message.ogg');
        const res = await fetch(`${SOCKET_URL}/api/chat/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        socket.current?.emit('send_private_message', { senderId: user?.id, receiverId: activeContact?.id, content: data.url, type: 'audio' });
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) { toast.error("Không thể truy cập micro"); }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !activeContact || !user || iBlockedThem || theyBlockedMe) return;
    socket.current?.emit('send_private_message', { senderId: user.id, receiverId: activeContact.id, content: inputValue.trim(), type: 'text' });
    setInputValue('');
  };

  if (!isAuthenticated) return null;
  const displayList = searchQuery.trim().length >= 2 ? contacts : recentContacts;

  // Logic hiển thị Sidebar
  const isSearchingOnMobile = searchQuery.length > 0;
  const sidebarWidthClass = isSearchingOnMobile 
    ? 'w-full md:w-[280px] lg:w-[300px]' 
    : isSidebarCollapsed ? 'w-[70px]' : 'w-[70px] md:w-[280px] lg:w-[300px]';

  return (
    <div className="fixed bottom-4 right-4 md:right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#0d1117]/95 backdrop-blur-3xl border border-white/40 ring-1 ring-white/10 w-[95vw] md:w-[90vw] lg:w-[950px] h-[80vh] md:h-[650px] max-h-[90vh] rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden flex relative text-white"
          >
            {/* SIDEBAR */}
            <div className={`${sidebarWidthClass} shrink-0 flex flex-col bg-black/40 border-r border-white/20 transition-all duration-300 ease-in-out relative z-40`}>
              
              {/* Nút Toggle Sidebar (Chỉ hiện trên Desktop và khi không search) */}
              {!isSearchingOnMobile && (
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full items-center justify-center hidden md:flex border border-white/20 z-50 hover:bg-blue-500 transition-colors"
                >
                  {isSidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
                </button>
              )}

              {/* Search Box */}
              <div className="p-4 border-b border-white/10 bg-black/20">
                <div className="relative w-full flex items-center">
                  {(isSidebarCollapsed && !isSearchingOnMobile) ? (
                    <button 
                      onClick={() => { setIsSidebarCollapsed(false); setTimeout(() => searchInputRef.current?.focus(), 100); }} 
                      className="w-full flex justify-center p-2 hover:bg-white/10 rounded-lg text-gray-400"
                    >
                      <Search size={18} />
                    </button>
                  ) : (
                    <>
                      <Search size={14} className="absolute left-3 text-gray-500" />
                      <input 
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full bg-white/5 border border-white/20 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder:text-gray-600"
                      />
                      {isSearchingOnMobile && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 text-gray-500 hover:text-white">
                          <X size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Danh sách Liên hệ */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {isSearching ? (
                  <div className="flex justify-center p-6"><Loader2 className="animate-spin text-blue-500 w-5 h-5" /></div>
                ) : displayList.length > 0 ? (
                  displayList.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => selectContact(contact)}
                      className={`w-full p-2 flex items-center gap-3 rounded-xl transition-all ${activeContact?.id === contact.id ? 'bg-blue-600/20 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'hover:bg-white/5 border border-transparent'} ${(isSidebarCollapsed && !isSearchingOnMobile) ? 'justify-center' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <img src={`${DEFAULT_AVATAR}${contact.name}`} className="w-10 h-10 rounded-full border border-white/20" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0d1117] rounded-full"></span>
                      </div>
                      
                      {/* Hiển thị tên nếu Sidebar đang mở hoặc đang Search */}
                      {(!isSidebarCollapsed || isSearchingOnMobile) && (
                        <div className={`flex-1 text-left overflow-hidden ${(!isSidebarCollapsed || isSearchingOnMobile) ? 'block' : 'hidden md:block'}`}>
                          <h4 className="text-[13px] font-semibold text-gray-100 truncate">{contact.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                            {contact.is_vip ? `VIP ${contact.vip_tier}` : 'THÀNH VIÊN'}
                          </p>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  (!isSidebarCollapsed || isSearchingOnMobile) && (
                    <div className="p-10 text-center text-gray-600 text-[11px] italic">Trống</div>
                  )
                )}
              </div>
            </div>

            {/* MAIN CHAT - Sẽ ẩn trên Mobile khi đang Search để nhường chỗ cho Sidebar */}
            <div className={`flex-1 flex flex-col relative bg-[#0d1117]/60 min-w-0 ${isSearchingOnMobile ? 'hidden md:flex' : 'flex'}`}>
              <AnimatedBackground />
              
              <div className="h-16 px-5 border-b border-white/20 flex items-center justify-between backdrop-blur-2xl bg-black/50 z-30">
                <div className="flex items-center gap-3 overflow-hidden">
                  {activeContact ? (
                    <>
                      <div className="relative shrink-0">
                        <img src={`${DEFAULT_AVATAR}${activeContact.name}`} className="w-10 h-10 rounded-full border border-blue-500/50" />
                        {!theyBlockedMe && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0d1117] rounded-full"></span>}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-bold text-white tracking-wide truncate">{activeContact.name}</h3>
                        <p className="text-[11px] text-green-400 font-medium">{theyBlockedMe ? 'Ngoại tuyến' : 'Đang hoạt động'}</p>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Trò chuyện</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {activeContact && (
                    <button 
                      onClick={() => iBlockedThem ? toggleBlock() : setShowBlockModal(true)} 
                      className={`p-2.5 rounded-xl transition-all ${iBlockedThem ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'}`}
                    >
                      {iBlockedThem ? <ShieldCheck size={20} /> : <Ban size={18} />}
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {activeContact ? (
                <>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-10 custom-scrollbar">
                    {messages.map((msg, index) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] py-2 px-4 rounded-2xl text-[14px] shadow-lg leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#21262d] text-gray-100 border border-white/10 rounded-tl-none'}`}>
                            {msg.type === 'text' && msg.content}
                            
                            {msg.type === 'image' && (
                                <img 
                                  src={msg.content} 
                                  alt="ảnh" 
                                  className="max-w-[220px] md:max-w-[300px] h-auto rounded-xl cursor-pointer hover:brightness-110 transition-all border border-white/5" 
                                  onClick={() => window.open(msg.content)} 
                                />
                            )}

                            {msg.type === 'file' && (
                                <div className="flex items-center gap-3 p-1 max-w-[260px]">
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0"><FileText size={22} className="text-blue-400" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-xs font-medium">Tệp đính kèm</p>
                                        <p className="text-[10px] text-gray-500">Download</p>
                                    </div>
                                    <a href={msg.content} download className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all shrink-0">
                                        <Download size={16} />
                                    </a>
                                </div>
                            )}

                            {msg.type === 'audio' && (
                                <audio src={msg.content} controls className="h-9 w-[180px] md:w-[240px]" />
                            )}

                            <div className={`text-[10px] mt-1.5 font-medium opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="p-4 z-20">
                    {theyBlockedMe ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
                         <p className="text-red-400 text-xs font-bold italic tracking-widest uppercase">bị chặn rồi mày ơi, lêu lêu 😜</p>
                      </div>
                    ) : iBlockedThem ? (
                      <div className="bg-white/5 border border-white/20 rounded-2xl p-4 text-center">
                         <p className="text-gray-500 text-xs italic">Hãy bỏ chặn để tiếp tục trò chuyện.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                          {isRecording && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-between bg-red-500/20 border border-red-500/30 p-3 rounded-xl">
                                  <div className="flex items-center gap-3 text-red-400 text-xs font-bold">
                                      <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                      Đang ghi âm: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                                  </div>
                                  <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><Square size={16}/></button>
                              </motion.div>
                          )}

                          <div className="bg-[#161b22] border border-white/20 rounded-2xl p-2 flex items-center gap-2 focus-within:border-blue-500/60 transition-all shadow-2xl">
                            <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                            <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileUpload(e, 'file')} />
                            
                            <div className="flex gap-1 px-1 border-r border-white/10 mr-1 shrink-0">
                                <button onClick={() => imageInputRef.current?.click()} className="p-1 md:p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-all hover:text-white"><ImageIcon size={18}/></button>
                                <button onClick={() => fileInputRef.current?.click()} className="p-1 md:p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-all hover:text-white"><Paperclip size={18}/></button>
                                <button onClick={startRecording} disabled={isRecording} className={`p-1 md:p-2 rounded-xl transition-all ${isRecording ? 'text-red-500 bg-red-500/10' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}><Mic size={18}/></button>
                            </div>

                            <input 
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                              placeholder="Nhập nội dung..."
                              className="flex-1 bg-transparent border-none text-[13px] md:text-[14px] px-2 outline-none text-white placeholder:text-gray-600 min-w-0"
                            />
                            <button onClick={handleSend} disabled={!inputValue.trim()} className="bg-blue-600 p-2.5 md:p-3 rounded-xl hover:bg-blue-500 disabled:opacity-20 transition-all shadow-xl shrink-0">
                              <Send size={16} className="text-white" />
                            </button>
                          </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 z-10">
                  <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/5"><MessageSquare size={60} className="opacity-10" /></div>
                  <p className="text-[12px] font-bold tracking-[0.2em] opacity-20 uppercase">Mã hóa đầu cuối</p>
                </div>
              )}
            </div>

            {/* BLOCK MODAL */}
            <AnimatePresence>
              {showBlockModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#161b22] border border-red-500/30 w-full max-w-sm rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/20"><ShieldAlert className="text-red-500" size={32} /></div>
                    <h4 className="text-center text-white text-lg font-bold mb-3">Chặn người dùng?</h4>
                    <p className="text-center text-gray-400 text-xs mb-8 leading-relaxed">Sau khi chặn, hai người không thể gửi tin nhắn cho nhau.</p>
                    <div className="flex gap-4">
                      <button onClick={() => setShowBlockModal(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 hover:bg-white/5 rounded-xl border border-white/10 transition-all">HUỶ BỎ</button>
                      <button onClick={toggleBlock} className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg transition-all">CHẶN NGAY</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button 
          initial="rest" whileHover="hover" whileTap={{ scale: 0.9 }} 
          onClick={() => setIsOpen(true)} 
          className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-[#e2ecff]/80 shadow-[0_0_30px_rgba(226,236,255,0.3)] relative group overflow-hidden transition-all duration-500"
        >
          <motion.div variants={{ rest: { height: 0 }, hover: { height: '100%' } }} transition={{ duration: 0.4, ease: "easeOut" }} className="absolute bottom-0 left-0 right-0 bg-blue-600 z-0" />
          <motion.div variants={{ rest: { rotate: 0 }, hover: { rotate: -10 } }} transition={{ duration: 0.3 }} className="relative z-10">
            <MessageSquare size={28} className="text-[#e2ecff] group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
          </motion.div>
          <div className="absolute inset-0 rounded-full border border-white/40 group-hover:border-white animate-pulse pointer-events-none"></div>
        </motion.button>
      )}
    </div>
  );
}