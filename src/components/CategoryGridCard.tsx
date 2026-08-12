import React from "react";
import { useRouter } from "next/navigation";
import { CategoryCard } from "@/lib/mock-data";

interface CategoryGridCardProps {
  category: CategoryCard;
  index: number;
}

export default function CategoryGridCard({ category, index }: CategoryGridCardProps) {
  const router = useRouter();
  const iconBgs = ["#FEF0F4", "#FFF8E8", "#EBF5EC", "#F0EDF8"];
  const iconBg = iconBgs[index % iconBgs.length];

  const emojis = ["📖", "🛒", "🙏", "🗓️"];
  const emoji = emojis[index % emojis.length];

  const handleClick = () => {
    if (category.title.includes("Guides")) {
      router.push("/ritual-guides");
    } else if (category.title.includes("Kits")) {
      router.push("/ritual-kits");
    } else if (category.title.includes("Purohit")) {
      router.push("/ritual-guides?view=purohit");
    } else if (category.title.includes("Panchang")) {
      router.push("/panchang");
    } else {
      router.push("/ritual-guides");
    }
  };

  return (
    <div 
      className="cat-card select-none cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={handleClick}
    >
      <div className="cat-icon" style={{ background: iconBg }}>
        {emoji}
      </div>
      <h3 className="cat-title font-sans">
        {category.title}
      </h3>
      <p className="cat-sub font-sans">
        {category.sub}
      </p>
      <div className="cat-count font-sans">
        {category.count}
      </div>
    </div>
  );
}
