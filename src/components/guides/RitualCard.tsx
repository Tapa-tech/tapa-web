import React from "react";
import { useRouter } from "next/navigation";

interface ArticleCard {
  title: string;
  tag: "DHARMA" | "PRATHA" | "BHRANTI";
  dateMeta: string;
  description: string;
  imageUrl?: string;
}

interface RitualCardProps {
  article: ArticleCard & { slug?: string };
  index: number;
}

export default function RitualCard({ article, index }: RitualCardProps) {

  const router = useRouter();
  const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  
  const gradients = [
    "linear-gradient(135deg, #2A4A1A, #4A7C3F)", 
    "linear-gradient(135deg, #1A2A4A, #3A4A7A)", 
    "linear-gradient(135deg, #4A2A1A, #7A4A3A)", 
    "linear-gradient(135deg, #2A1A4A, #4A2A7A)", 
  ];
  const gradient = gradients[index % gradients.length];

  
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
    <div
      onClick={() => router.push(`/ritual-guides/${slug}`)}
      className="article-card select-none hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      
      <div
        className="article-img font-sans text-xs"
        style={{
          backgroundImage: article.imageUrl
            ? `url(${article.imageUrl})`
            : gradient,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!article.imageUrl && `[ IMAGE: ${article.title} ]`}
      </div>
      
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
