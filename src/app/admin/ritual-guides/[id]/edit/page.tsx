"use client";

import React from "react";
import RitualGuideForm from "@/components/admin/RitualGuideForm";

interface EditRitualGuideProps {
  params: {
    id: string;
  };
}

export default function EditRitualGuide({ params }: EditRitualGuideProps) {
  return <RitualGuideForm initialId={params.id} />;
}
