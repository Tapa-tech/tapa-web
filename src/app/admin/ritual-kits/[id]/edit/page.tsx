import RitualKitForm from "@/components/admin/RitualKitForm";

interface EditRitualKitProps {
  params: {
    id: string;
  };
}

export default function EditRitualKitPage({ params }: EditRitualKitProps) {
  return <RitualKitForm initialId={params.id} />;
}
