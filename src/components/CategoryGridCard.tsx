import React from "react";
import { BookOpen, Package, User, Calendar } from "lucide-react";
import { CategoryCard } from "@/lib/mock-data";

interface CategoryGridCardProps {
  category: CategoryCard;
  index: number;
}

export default function CategoryGridCard({ category, index }: CategoryGridCardProps) {
  // Map index to different styles defined in styles.md for `.cat-i`
  const iconBgs = [
    "cat-i a text-pink border-[#F0B8CC]",                  // pinkish
    "cat-i b text-[#1B3A52] border-[#C3D6E4]",             // blueish
    "cat-i c text-green-text border-green-border",         // greenish
    "bg-[#FFF8E8] text-[#8B6914] border-[#E8D8A0] border", // gold/amber custom for 4th card
  ];
  const iconBg = iconBgs[index % iconBgs.length];

  // Map index to different icons
  const renderIcon = () => {
    switch (index) {
      case 0:
        return <BookOpen className="w-5 h-5" />;
      case 1:
        return <Package className="w-5 h-5" />;
      case 2:
        return <User className="w-5 h-5" />;
      case 3:
        return <Calendar className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="cat flex flex-col justify-between hover:shadow-md transition-shadow duration-200 cursor-pointer select-none">
      <div>
        {/* Icon Container */}
        <div className={`cat-i ${iconBg} flex items-center justify-center rounded-xl mb-4`}>
          {renderIcon()}
        </div>

        {/* Title */}
        <h3 className="cat-t font-serif text-lg font-bold text-dark mb-1 leading-tight">
          {category.title}
        </h3>

        {/* Subtitle / Description */}
        <p className="cat-s text-xs text-sub-text font-sans leading-relaxed">
          {category.sub}
        </p>
      </div>

      {/* Count / Status Badge */}
      <div className="cat-c font-sans text-xs font-bold text-pink mt-3">
        {category.count}
      </div>
    </div>
  );
}
