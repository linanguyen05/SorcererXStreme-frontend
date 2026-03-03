"use client";

import { useState, useMemo, useEffect } from "react";
import SearchBar from "@/components/services/SearchBar";
import CategoryFilter from "@/components/services/CategoryFilter";
import ServiceCard, { type ServiceData } from "@/components/services/ServiceCard";
import { motion } from "framer-motion";
import { Sidebar, useSidebarCollapsed } from "@/components/layout/Sidebar";
import ContentHeader from "@/components/layout/ContentHeader";

const imgZodiac = "/services/mystical-zodiac.jpg";
const imgTarot = "/services/mystical-tarot.jpg";
const imgNumerology = "/services/mystical-numerology.jpg";
const imgLove = "/services/mystical-love.jpg";
const imgFortune = "/services/mystical-fortune.jpg";
const imgFengshui = "/services/mystical-fengshui.jpg";

const categories = ["Tất cả", "AI Chat", "Tarot", "Cung hoàng đạo", "Tử vi", "Tình duyên", "Thần số học"];

const services: ServiceData[] = [
  { id: 1, slug: "ai-chat", title: "AI Chat Tâm Linh", image: imgFortune, format: "Chatbot AI", formatIcon: "chat", duration: "Không giới hạn", price: "Miễn phí", category: "AI Chat" },
  { id: 2, slug: "tarot", title: "Trải bài Tarot", image: imgTarot, format: "Chatbot AI", formatIcon: "chat", duration: "20 phút", price: "80.000 VNĐ", category: "Tarot" },
  { id: 3, slug: "cung-hoang-dao", title: "Cung Hoàng Đạo", image: imgZodiac, format: "Chatbot AI", formatIcon: "chat", duration: "15 phút", price: "50.000 VNĐ", category: "Cung hoàng đạo" },
  { id: 4, slug: "la-so-tu-vi", title: "Lá số Tử Vi", image: imgNumerology, format: "Chatbot AI", formatIcon: "chat", duration: "30 phút", price: "100.000 VNĐ", category: "Tử vi" },
  { id: 5, slug: "tu-vi-hang-ngay", title: "Tử vi Hàng ngày", image: imgFengshui, format: "Chatbot AI", formatIcon: "chat", duration: "10 phút", price: "Miễn phí", category: "Tử vi" },
  { id: 6, slug: "boi-tinh-duyen", title: "Bói Tình Duyên", image: imgLove, format: "Chatbot AI", formatIcon: "chat", duration: "25 phút", price: "90.000 VNĐ", category: "Tình duyên" },
  { id: 7, slug: "than-so-hoc", title: "Thần Số Học", image: imgNumerology, format: "Chatbot AI", formatIcon: "chat", duration: "20 phút", price: "70.000 VNĐ", category: "Thần số học" },
];

export default function ServiceListingPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const isCollapsed = useSidebarCollapsed();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const matchSearch = service.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "Tất cả" || service.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <motion.main
        animate={{ paddingLeft: isMobile ? 0 : (isCollapsed ? 80 : 280) }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 min-h-screen flex flex-col relative overflow-hidden"
      >
        {/* 2. ĐẶT CONTENT HEADER LÊN ĐẦU TRANG */}
        <ContentHeader 
          title="Dịch Vụ Tâm Linh" 
          description="Khám phá vận mệnh • Khai sáng tương lai" 
        />

        {/* 3. KHỐI HIỂN THỊ NỘI DUNG Ở DƯỚI HEADER */}
        <div className="flex-1 relative overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-12 py-8 space-y-8 pt-6 md:pt-8">
            <div className="space-y-4">
              <SearchBar value={search} onChange={setSearch} />
              <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                Không tìm thấy dịch vụ nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}