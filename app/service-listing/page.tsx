"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/services/SearchBar";
import CategoryFilter from "@/components/services/CategoryFilter";
import ServiceCard, { type ServiceData } from "@/components/services/ServiceCard";
import { ExpertTile, ALL_SPECIALTIES } from "@/components/services/ExpertTile";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, Search, Filter } from "lucide-react";
import { Sidebar, useSidebarCollapsed } from "@/components/layout/Sidebar";
import ContentHeader from "@/components/layout/ContentHeader";
import { useAuthStore } from "@/lib/store";
import { Expert, ExpertSpecialty } from "@/lib/services-data";
import { expertApi } from "@/lib/api-client";
import { mapApiExpert } from "@/lib/expert-mapping";

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

type TabKey = "services" | "experts";

function ServiceListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCollapsed = useSidebarCollapsed();
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const [tab, setTab] = useState<TabKey>(
    searchParams.get("tab") === "experts" ? "experts" : "services"
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [specialty, setSpecialty] = useState<ExpertSpecialty | "all">("all");
  // Chuyên gia THẬT từ backend (có gói ACTIVE). Hiển thị trước, mock demo xếp sau.
  const [realExperts, setRealExperts] = useState<Expert[]>([]);

  useEffect(() => {
    expertApi
      .list()
      .then((res: any) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setRealExperts(list.map(mapApiExpert));
      })
      .catch((e: any) => {
        console.warn("Không tải được danh sách chuyên gia từ API:", e);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep the URL in sync so the tab is shareable / preserved on refresh
  const switchTab = (next: TabKey) => {
    setTab(next);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (next === "experts") params.set("tab", "experts");
    else params.delete("tab");
    const qs = params.toString();
    router.replace(qs ? `/service-listing?${qs}` : "/service-listing", { scroll: false });
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchSearch = service.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "Tất cả" || service.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const filteredExperts = useMemo(() => {
    const q = search.toLowerCase();
    // Chỉ hiển thị chuyên gia THẬT từ backend (mock demo đã gỡ).
    return realExperts.filter((e) => {
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) ||
        e.specialties.some((s) => s.toLowerCase().includes(q)) || e.location?.toLowerCase().includes(q);
      const matchF = specialty === "all" || e.specialties.includes(specialty);
      return matchQ && matchF;
    });
  }, [search, specialty, realExperts]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <motion.main
        animate={{ paddingLeft: isMobile ? 0 : (isCollapsed ? 80 : 280) }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 min-h-screen flex flex-col relative overflow-hidden"
      >
        <ContentHeader
          title="Dịch Vụ & Chuyên Gia"
          description="Dịch vụ AI & Chuyên gia tư vấn 1:1 trong một nơi"
        />

        <div className="flex-1 relative overflow-y-auto custom-scrollbar">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-12 py-8 space-y-8 pt-6 md:pt-8">
            {/* Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                {([
                  { key: "services" as TabKey, label: "Dịch vụ", Icon: Sparkles },
                  { key: "experts" as TabKey, label: "Chuyên gia", Icon: Briefcase },
                ]).map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => switchTab(key)}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      tab === key ? "text-white" : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {tab === key && (
                      <motion.span
                        layoutId="tabHighlight"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/80 to-pink-600/80 shadow-lg shadow-purple-900/30"
                        transition={{ type: "spring", damping: 24, stiffness: 260 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search + filters */}
            <div className="space-y-4">
              <SearchBar value={search} onChange={setSearch} />
              {tab === "services" ? (
                <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Filter className="w-4 h-4 text-gray-500 flex-shrink-0 mr-1" />
                  {(["all", ...ALL_SPECIALTIES] as string[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSpecialty(f as ExpertSpecialty | "all")}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                        specialty === f
                          ? "bg-yellow-400 text-black border-yellow-400 shadow shadow-yellow-900/30"
                          : "bg-white/[0.04] text-gray-400 border-white/[0.08] hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      {f === "all" ? "Tất cả" : f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid */}
            {tab === "services" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredServices.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>
                {filteredServices.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    Không tìm thấy dịch vụ nào phù hợp.
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-400 text-sm">
                  <span className="text-white font-semibold">{filteredExperts.length}</span> chuyên gia
                  {specialty !== "all" && <> · <span className="text-yellow-300">{specialty}</span></>}
                </p>
                {filteredExperts.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">Không tìm thấy chuyên gia phù hợp</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredExperts.map((expert, i) => (
                      <ExpertTile key={expert.id} expert={expert} index={i} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}

export default function ServiceListingPage() {
  return (
    <Suspense fallback={null}>
      <ServiceListingContent />
    </Suspense>
  );
}
