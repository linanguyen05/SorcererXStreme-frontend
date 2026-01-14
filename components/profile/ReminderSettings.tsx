// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Bell, Mail, Clock, Calendar, Check, AlertCircle, Save, Loader2, X, Edit, BellRing, BellOff, Sparkles, XCircle } from 'lucide-react';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { reminderApi } from '@/lib/api-client';
// import { useAuthStore } from '@/lib/store';
// import toast from 'react-hot-toast';

// interface ReminderSettingsState {
//     emailEnabled: boolean;
//     email: string;
//     dailyHoroscope: boolean;
//     weeklyFortune: boolean;
//     monthlyInsight: boolean;
//     timezone: string;
// }

// export function ReminderSettings() {
//     const { token, user } = useAuthStore();
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [savedSuccess, setSavedSuccess] = useState(false);
//     const [isEditing, setIsEditing] = useState(true);

//     const [settings, setSettings] = useState<ReminderSettingsState>({
//         emailEnabled: false,
//         email: user?.email || '',
//         dailyHoroscope: false,
//         weeklyFortune: false,
//         monthlyInsight: false,
//         timezone: 'Asia/Ho_Chi_Minh'
//     });

//     useEffect(() => {
//         const loadSettings = async () => {
//             if (!token) return;
//             try {
//                 const data = await reminderApi.get(token);
//                 // Map backend snake_case to frontend camelCase
//                 const mappedSettings = {
//                     emailEnabled: data.is_subscribed ?? false,
//                     email: user?.email || '', // Backend doesn't return email in settings data, use auth user
//                     dailyHoroscope: true, // Default to true as backend simplifies this
//                     weeklyFortune: true,
//                     monthlyInsight: true,
//                     timezone: 'Asia/Ho_Chi_Minh',
//                 };

//                 setSettings(mappedSettings);

//                 if (mappedSettings.emailEnabled) {
//                     setIsEditing(false);
//                 }
//             } catch (error) {
//                 console.log('No existing settings found, using defaults');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadSettings();
//     }, [token, user?.email]);

//     const handleSave = async (isUnsubscribing = false) => {
//         if (!token) {
//             toast.error('Vui lòng đăng nhập lại');
//             return;
//         }

//         setSaving(true);
//         try {
//             // Map frontend camelCase to backend snake_case
//             // Spec: { is_subscribed: boolean, preferred_time?: string }
//             const payload = {
//                 is_subscribed: isUnsubscribing ? false : settings.emailEnabled
//             };

//             if (isUnsubscribing) {
//                 setSettings(prev => ({ ...prev, emailEnabled: false }));
//             }

//             await reminderApi.update(payload, token);

//             const message = isUnsubscribing ? 'Đã hủy đăng ký nhắc nhở' : 'Đã lưu cài đặt nhắc nhở';
//             toast.success(message);

//             if (!isUnsubscribing) {
//                 setSavedSuccess(true);
//                 setTimeout(() => {
//                     setSavedSuccess(false);
//                     setIsEditing(false);
//                 }, 1500);
//             } else {
//                 setIsEditing(true);
//             }
//         } catch (error: any) {
//             console.error('Failed to save settings:', error);
//             toast.error(error.message || 'Có lỗi xảy ra khi lưu cài đặt');
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleUnsubscribe = () => {
//         if (confirm('Bạn có chắc chắn muốn hủy đăng ký tất cả nhắc nhở không?')) {
//             handleSave(true);
//         }
//     };

//     const disabledStyle = !isEditing ? "opacity-60 pointer-events-none grayscale-[0.3]" : "";
//     const inputDisabledStyle = !isEditing ? "opacity-60 pointer-events-none bg-black/60 text-gray-400" : "bg-black/40";

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10">
//                 <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
//             </div>
//         );
//     }

//     return (
//         // <motion.div
//         //     initial={{ opacity: 0, y: 20 }}
//         //     animate={{ opacity: 1, y: 0 }}
//         //     transition={{ delay: 0.3 }}
//         //     className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden"
//         // >
//         //     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

//         //     <div className="flex items-center gap-4 mb-8 relative z-10">
//         //         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
//         //             <Bell className="w-6 h-6 text-white" />
//         //         </div>
//         //         <div>
//         //             <h2 className="text-xl font-bold text-white">Cài Đặt Nhắc Nhở</h2>
//         //             {/* <p className="text-blue-300/70 text-sm">Nhận thông báo định kỳ</p> */}
//         //         </div>
//         //     </div>

//         //     <div className="space-y-6 relative z-10">

//         //         {/* Header  */}
//         //         <div className={`flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 ${disabledStyle}`}>
//         //             <div className="flex items-center gap-3">
//         //                 <Mail className={`w-5 h-5 ${settings.emailEnabled ? 'text-green-400' : 'text-gray-400'}`} />
//         //                 <div>
//         //                     <p className="font-medium text-white">Nhận thông báo qua Email</p>
//         //                     <p className="text-xs text-gray-400">Gửi thông báo trực tiếp vào hòm thư của bạn</p>
//         //                 </div>
//         //             </div>

//         //             {/* Toggle switch for email notifications */}
//         //             <label className="relative inline-flex items-center cursor-pointer">
//         //                 <input
//         //                     type="checkbox"
//         //                     checked={settings.emailEnabled}
//         //                     disabled={!isEditing}
//         //                     onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
//         //                     className="sr-only peer"
//         //                 />
//         //                 <div className={`w-11 h-6 rounded-full peer-focus:outline-none transition-colors duration-200 relative ${settings.emailEnabled ? 'bg-green-600' : 'bg-gray-700'}`}>
//         //                     <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform duration-200 ${settings.emailEnabled ? 'translate-x-full border-white' : ''}`}></div>
//         //                 </div>
//         //             </label>
//         //         </div>

//         //         <AnimatePresence>
//         //             {settings.emailEnabled && (
//         //                 <motion.div
//         //                     initial={{ opacity: 0, height: 0 }}
//         //                     animate={{ opacity: 1, height: 'auto' }}
//         //                     exit={{ opacity: 0, height: 0 }}
//         //                     className="space-y-6 overflow-hidden"
//         //                 >
//         //                     <div className={`space-y-2 ${disabledStyle}`}>
//         //                         <label className="text-sm font-medium text-gray-300">Email nhận thông báo</label>
//         //                         <Input
//         //                             type="email"
//         //                             value={settings.email}
//         //                             disabled={!isEditing}
//         //                             onChange={(e) => setSettings({ ...settings, email: e.target.value })}
//         //                             placeholder="name@example.com"
//         //                             className={`border-white/10 focus:border-blue-500/50 ${inputDisabledStyle}`}
//         //                         />
//         //                     </div>

//         //                     {/* Removed 'Loại thông báo' section as per user request */}

//         //                     <div className={`bg-black/20 rounded-xl p-5 border border-white/5 space-y-4 ${disabledStyle}`}>
//         //                         <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-2">
//         //                             <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
//         //                             <p className="text-xs text-blue-200">
//         //                                 Email sẽ được gửi tự động mỗi ngày vào 08:00 sáng. Hãy kiểm tra cả hộp thư Spam nhé.
//         //                             </p>
//         //                         </div>
//         //                     </div>

//         //                     <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4">
//         //                         {!isEditing ? (
//         //                             <Button
//         //                                 onClick={() => setIsEditing(true)}
//         //                                 className="flex-1 bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-indigo-900/80 hover:from-indigo-800/90 hover:via-purple-800/90 hover:to-indigo-800/90 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] transition-all duration-300 relative overflow-hidden group"
//         //                             >
//         //                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
//         //                                 <Edit className="w-4 h-4 mr-2 relative z-10" />
//         //                                 <span className="relative z-10">Chỉnh sửa cài đặt</span>
//         //                             </Button>
//         //                         ) : (
//         //                             <Button
//         //                                 onClick={() => handleSave(false)}
//         //                                 disabled={saving || savedSuccess}
//         //                                 className={`flex-1 transition-all duration-300 ${savedSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'}`}
//         //                             >
//         //                                 {saving ? (
//         //                                     <>
//         //                                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//         //                                         Đang lưu...
//         //                                     </>
//         //                                 ) : savedSuccess ? (
//         //                                     <>
//         //                                         <Check className="w-4 h-4 mr-2" />
//         //                                         Đã lưu thành công!
//         //                                     </>
//         //                                 ) : (
//         //                                     <>
//         //                                         <Save className="w-4 h-4 mr-2" />
//         //                                         Lưu thay đổi
//         //                                     </>
//         //                                 )}
//         //                             </Button>
//         //                         )}

//         //                         <Button
//         //                             variant="ghost"
//         //                             onClick={handleUnsubscribe}
//         //                             disabled={saving || (!isEditing && !settings.emailEnabled)}
//         //                             className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
//         //                         >
//         //                             <X className="w-4 h-4 mr-2" />
//         //                             Hủy đăng ký
//         //                         </Button>
//         //                     </div>
//         //                 </motion.div>
//         //             )}
//         //         </AnimatePresence>

//         //         {!settings.emailEnabled && (
//         //             <div className="text-center p-6 border-t border-white/10">
//         //                 <p className="text-gray-500 text-sm italic">
//         //                     Bật tính năng email để không bỏ lỡ những thông điệp vũ trụ dành riêng cho bạn mỗi ngày
//         //                 </p>
//         //             </div>
//         //         )}
//         //     </div>

//         // </motion.div >

//         // <motion.div
//         //     initial={{ opacity: 0, y: 20 }}
//         //     animate={{ opacity: 1, y: 0 }}
//         //     transition={{ delay: 0.3 }}
//         //     className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden max-w-lg mx-auto"
//         // >
//         //     {/* Hiệu ứng gradient nền */}
//         //     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

//         //     {/* Header Section */}
//         //     <div className="flex items-center justify-between mb-8 relative z-10">
//         //         <div className="flex items-center gap-4">
//         //             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
//         //                 <Bell className="w-6 h-6 text-white" />
//         //             </div>
//         //             <div>
//         //                 <h2 className="text-xl font-bold text-white tracking-tight">Thông báo Email</h2>
//         //                 <p className="text-blue-200/50 text-xs">Cập nhật thông điệp từ vũ trụ</p>
//         //             </div>
//         //         </div>

//         //         {/* Nút Toggle chính - Luôn cho phép bật/tắt */}
//         //         <label className="relative inline-flex items-center cursor-pointer group">
//         //             <input
//         //                 type="checkbox"
//         //                 checked={settings.emailEnabled}
//         //                 onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
//         //                 className="sr-only peer"
//         //             />
//         //             <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 shadow-inner"></div>
//         //         </label>
//         //     </div>

//         //     <div className="space-y-6 relative z-10">
//         //         <AnimatePresence mode="wait">
//         //             {settings.emailEnabled ? (
//         //                 <motion.div
//         //                     key="enabled"
//         //                     initial={{ opacity: 0, height: 0 }}
//         //                     animate={{ opacity: 1, height: 'auto' }}
//         //                     exit={{ opacity: 0, height: 0 }}
//         //                     className="space-y-5"
//         //                 >
//         //                     {/* Input Email */}
//         //                     <div className="space-y-2">
//         //                         <div className="flex justify-between">
//         //                             <label className="text-sm font-medium text-blue-100/80 ml-1">Địa chỉ Email</label>
//         //                             {savedSuccess && <span className="text-xs text-green-400 animate-pulse">Đã tự động lưu!</span>}
//         //                         </div>
//         //                         <div className="relative group">
//         //                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
//         //                             <input
//         //                                 type="email"
//         //                                 value={settings.email}
//         //                                 onChange={(e) => setSettings({ ...settings, email: e.target.value })}
//         //                                 placeholder="ten-cua-ban@gmail.com"
//         //                                 className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
//         //                             />
//         //                         </div>
//         //                     </div>

//         //                     {/* Info Box */}
//         //                     <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10 flex gap-3">
//         //                         <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
//         //                         <p className="text-xs leading-relaxed text-blue-200/70">
//         //                             Hệ thống sẽ gửi thông điệp vào lúc <span className="text-blue-300 font-bold">08:00 sáng</span> mỗi ngày. Nếu không thấy, bạn nhớ kiểm tra hòm thư <span className="italic underline">Spam</span> nhé.
//         //                         </p>
//         //                     </div>

//         //                     {/* Action Buttons */}
//         //                     <div className="pt-2 flex gap-3">
//         //                         <button
//         //                             onClick={() => handleSave()}
//         //                             disabled={saving}
//         //                             className="flex-[2] bg-white text-gray-900 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
//         //                         >
//         //                             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
//         //                             Lưu thay đổi
//         //                         </button>
//         //                         <button
//         //                             onClick={handleUnsubscribe}
//         //                             className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-3.5 rounded-2xl hover:bg-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center"
//         //                             title="Hủy đăng ký"
//         //                         >
//         //                             <X className="w-5 h-5" />
//         //                         </button>
//         //                     </div>
//         //                 </motion.div>
//         //             ) : (
//         //                 <motion.div
//         //                     key="disabled"
//         //                     initial={{ opacity: 0 }}
//         //                     animate={{ opacity: 1 }}
//         //                     className="py-10 text-center space-y-4"
//         //                 >
//         //                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
//         //                         <Mail className="w-10 h-10 text-gray-600" />
//         //                     </div>
//         //                     <p className="text-gray-400 text-sm max-w-[240px] mx-auto leading-relaxed">
//         //                         Bật tính năng email để không bỏ lỡ những <span className="text-blue-400">thông điệp vũ trụ</span> dành riêng cho bạn.
//         //                     </p>
//         //                 </motion.div>
//         //             )}
//         //         </AnimatePresence>
//         //     </div>
//         // </motion.div>

//         <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden max-w-sm mx-auto"
//         >
//             {/* Hiệu ứng ánh sáng góc */}
//             <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />

//             <div className="relative z-10 flex flex-col items-center text-center">
//                 {/* Icon Trạng thái */}
//                 <div className="relative mb-6">
//                     <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 ${settings.emailEnabled ? 'bg-green-500/20 rotate-6' : 'bg-white/5 -rotate-6'}`}>
//                         {settings.emailEnabled ? (
//                             <BellRing className="w-10 h-10 text-green-400 animate-pulse" />
//                         ) : (
//                             <BellOff className="w-10 h-10 text-gray-500" />
//                         )}
//                     </div>
//                     {settings.emailEnabled && (
//                         <span className="absolute -top-2 -right-2 flex h-6 w-6">
//                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                             <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 border-2 border-black items-center justify-center">
//                                 <Check className="w-3 h-3 text-white" />
//                             </span>
//                         </span>
//                     )}
//                 </div>

//                 {/* Nội dung */}
//                 <h2 className="text-xl font-bold text-white mb-2">Thông báo qua Email</h2>
//                 <p className="text-gray-400 text-sm mb-6 px-2">
//                     Gửi thông điệp chữa lành và dự báo ngày mới đến địa chỉ của bạn.
//                 </p>

//                 {/* Email Badge - Hiển thị email từ user */}
//                 <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 mb-8 flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
//                         <Mail className="w-5 h-5 text-blue-400" />
//                     </div>
//                     <div className="text-left overflow-hidden">
//                         <p className="text-[10px] uppercase tracking-[0.1em] text-gray-500 font-bold">Gửi đến</p>
//                         <p className="text-sm text-blue-100 truncate font-medium">{user?.email}</p>
//                     </div>
//                 </div>

//                 {/* Nút hành động duy nhất */}
//                 <div className="w-full space-y-4">
//                     {!settings.emailEnabled ? (
//                         <button
//                             onClick={() => handleSave(true)}
//                             disabled={saving}
//                             className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
//                         >
//                             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
//                             Bắt đầu nhận thông báo
//                         </button>
//                     ) : (
//                         <button
//                             onClick={handleUnsubscribe}
//                             disabled={saving}
//                             className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
//                         >
//                             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
//                             Dừng nhận thông báo
//                         </button>
//                     )}
//                 </div>

//                 {/* Info Time */}
//                 {settings.emailEnabled && (
//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="mt-6 text-[11px] text-green-500/70 italic flex items-center gap-1.5"
//                     >
//                         <Clock className="w-3 h-3" />
//                         Lịch gửi: 08:00 mỗi sáng
//                     </motion.p>
//                 )}

//             </div>
//         </motion.div>

//     );
// }


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Clock, Check, Loader2, BellRing, BellOff, Sparkles, XCircle } from 'lucide-react';
import { reminderApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function ReminderSettings() {
    const { token, user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        emailEnabled: false,
        email: user?.email || '',
    });

    // 1. Load settings từ Backend
    useEffect(() => {
        const loadSettings = async () => {
            if (!token) return;
            try {
                const data = await reminderApi.get(token);
                // Backend trả về field: is_subscribed
                setSettings({
                    emailEnabled: data.is_subscribed ?? false,
                    email: user?.email || '',
                });
            } catch (error) {
                console.log('No existing settings found, using defaults');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [token, user?.email]);

    // 2. Logic cập nhật (Đăng ký / Hủy đăng ký)
    const handleUpdateStatus = async (shouldSubscribe: boolean) => {
        if (!token) {
            toast.error('Vui lòng đăng nhập lại');
            return;
        }

        setSaving(true);
        try {
            // Khớp với updateReminderSchema của Backend
            const payload = {
                is_subscribed: shouldSubscribe
            };

            const response = await reminderApi.update(payload, token);

            // Cập nhật state local dựa trên kết quả trả về từ Backend
            // Backend trả về { message, settings: { is_subscribed, ... } }
            const updatedStatus = response.settings?.is_subscribed ?? shouldSubscribe;

            setSettings(prev => ({ ...prev, emailEnabled: updatedStatus }));
            toast.success(response.message || 'Cập nhật thành công');

        } catch (error: any) {
            console.error('Update Error:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật';
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const confirmUnsubscribe = () => {
        if (confirm('Bạn có chắc chắn muốn ngừng nhận thông báo không?')) {
            handleUpdateStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden max-w-sm mx-auto"
        >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Status Icon */}
                <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl ${settings.emailEnabled ? 'bg-green-500/20 rotate-6 shadow-green-500/20' : 'bg-white/5 -rotate-6'}`}>
                        {settings.emailEnabled ? (
                            <BellRing className="w-10 h-10 text-green-400 animate-pulse" />
                        ) : (
                            <BellOff className="w-10 h-10 text-gray-500" />
                        )}
                    </div>
                    {settings.emailEnabled && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 flex h-6 w-6"
                        >
                            <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 border-2 border-[#1a1a1a] items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </span>
                        </motion.span>
                    )}
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Thông báo qua Email</h2>
                <p className="text-gray-400 text-sm mb-6 px-4 leading-relaxed">
                    {settings.emailEnabled
                        ? "Hệ thống đã sẵn sàng gửi thông điệp ngày mới đến bạn."
                        : "Nhận lời dẫn lối từ vũ trụ trực tiếp vào hòm thư mỗi sáng."
                    }
                </p>

                {/* Email Badge */}
                <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <Mail className={`w-5 h-5 ${settings.emailEnabled ? 'text-green-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Gửi đến địa chỉ</p>
                        <p className="text-sm text-blue-100 truncate font-medium italic">{user?.email}</p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full">
                    {!settings.emailEnabled ? (
                        <button
                            onClick={() => handleUpdateStatus(true)}
                            disabled={saving}
                            className="w-full py-4 rounded-2xl bg-blue-400 text-blue-900 font-bold hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-white-600" />}
                            Nhận thông báo
                        </button>
                    ) : (
                        <button
                            onClick={confirmUnsubscribe}
                            disabled={saving}
                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                            Dừng nhận thông báo
                        </button>
                    )}
                </div>

                {/* Meta Info */}
                <AnimatePresence>
                    {settings.emailEnabled && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 flex items-center gap-2 text-[11px] text-green-500/60 font-medium"
                        >
                            <Clock className="w-3 h-3" />
                            <span>Tự động gửi vào 08:00 AM mỗi ngày</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
