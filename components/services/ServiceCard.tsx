"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Clock, Sparkles } from "lucide-react";

export interface ServiceData {
  id: number;
  slug: string;
  title: string;
  image: string;
  format: string;
  formatIcon: "chat" | "call";
  duration: string;
  price: string;
  category: string;
}

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const router = useRouter();
  const FormatIcon = service.formatIcon === "chat" ? MessageSquare : Phone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden group hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-500 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0 border-b border-white/5">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1 shadow-lg">
            <Sparkles className="h-3 w-3" />
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
          {service.title}
        </h3>

        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FormatIcon className="h-4 w-4 text-purple-400" />
            <span>Hình thức: {service.format}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Thời gian: {service.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {service.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/service-listing/${service.slug}`)} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Xem chi tiết
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;