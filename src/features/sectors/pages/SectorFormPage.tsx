import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { sectorFormConfig } from "../sector.form";

export default function SectorFormPage() {
  return <EntityFormPage config={sectorFormConfig} />;
}
