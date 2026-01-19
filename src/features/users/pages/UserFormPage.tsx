import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { userFormConfig } from "../user.form";

export default function UserFormPage() {
  return <EntityFormPage config={userFormConfig} />;
}