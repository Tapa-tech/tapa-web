import React from "react";

import { CategoryCard } from "@/lib/mock-data";

interface CategoryGridCardProps {
  category: CategoryCard;
  index: number;
}

export default function CategoryGridCard({ category, index }: CategoryGridCardProps) {
  const iconBgs = ["#FEF0F4", "#FFF8E8", "#EBF5EC", "#F0EDF8"];
  const iconBg = iconBgs[index % iconBgs.length];

  const emojis = ["📖", "🛒", "🙏", "🗓️"];
  const emoji = emojis[index % emojis.length];

  return (
    <div className="cat-card select-none">
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
