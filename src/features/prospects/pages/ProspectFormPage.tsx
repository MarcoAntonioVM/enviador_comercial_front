import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { buildProspectFormConfig } from "../prospect.form";
import useSectors from "@/features/sectors/hooks/useSectors";

export default function ProspectFormPage() {
  const { items: sectors } = useSectors();

  const config = buildProspectFormConfig(sectors);

  return <EntityFormPage config={config} />;
}
