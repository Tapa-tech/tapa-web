import React from "react";
import { ArticleCard } from "@/lib/mock-data";

interface RitualCardProps {
  article: ArticleCard;
  index: number;
}

export default function RitualCard({ article, index }: RitualCardProps) {
  // Rotate through the background gradient styles defined in the HTML
  const gradients = [
    "linear-gradient(135deg, #2A4A1A, #4A7C3F)", // Hariyali Teej
    "linear-gradient(135deg, #1A2A4A, #3A4A7A)", // Nag Panchami
    "linear-gradient(135deg, #4A2A1A, #7A4A3A)", // Kajari Teej
    "linear-gradient(135deg, #2A1A4A, #4A2A7A)", // Rudrabhishek
  ];
  const gradient = gradients[index % gradients.length];

  // Get tag colors and capitalized tag name
  const getTagStyles = (tag: string) => {
    switch (tag) {
      case "DHARMA":
        return { bg: "#EBF5EC", text: "#1A5C28", label: "Dharma" };
      case "PRATHA":
        return { bg: "#FFF8E8", text: "#8B6914", label: "Pratha" };
      case "BHRANTI":
        return { bg: "#FEF0F4", text: "#D4175A", label: "Bhranti" };
      default:
        return { bg: "#EBF5EC", text: "#1A5C28", label: "Dharma" };
    }
  };

  const tagStyles = getTagStyles(article.tag);

  return (
    <div className="article-card select-none hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      {/* Article Image Area */}
      <div
        className="article-img font-sans text-xs"
        style={{ background: gradient }}
      >
        {`[ IMAGE: ${article.title} ]`}
      </div>

      {/* Article Body */}
      <div className="article-body">
        <span
          className="article-tag font-sans font-bold"
          style={{ backgroundColor: tagStyles.bg, color: tagStyles.text }}
        >
          {tagStyles.label}
        </span>
        <div className="article-title font-sans font-semibold text-dark">
          {article.title}
        </div>
        <div className="article-meta font-sans">
          {article.dateMeta}
        </div>
      </div>
    </div>
  );
}
