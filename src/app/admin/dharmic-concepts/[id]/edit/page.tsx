"use client";

import React from "react";
import DharmicConceptForm from "@/components/admin/DharmicConceptForm";

interface EditDharmicConceptProps {
  params: {
    id: string;
  };
}

export default function EditDharmicConcept({ params }: EditDharmicConceptProps) {
  return <DharmicConceptForm initialId={params.id} />;
}
