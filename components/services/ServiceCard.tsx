// components/services/ServiceCard.tsx
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
      className="glass rounded-2xl overflow-hidden group hover:glow-primary transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="glass-strong px-3 py-1 rounded-full text-xs font-medium text-accent flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {service.category}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <h3 className="text-lg font-bold text-foreground">{service.title}</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FormatIcon className="h-4 w-4 text-primary" />
            <span>Hình thức: {service.format}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Thời gian: {service.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-gradient-mystical">{service.price}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/service-listing/${service.slug}`)}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:glow-primary transition-all duration-300"
          >
            Xem chi tiết
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;