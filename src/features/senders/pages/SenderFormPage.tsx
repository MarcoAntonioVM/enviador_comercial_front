import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { senderFormConfig } from "../sender.form";

export default function SenderFormPage() {
  return <EntityFormPage config={senderFormConfig} />;
}
