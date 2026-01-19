import React from "react";
import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { prospectFormConfig } from "../prospect.form";

export default function ProspectFormPage() {
  return <EntityFormPage config={prospectFormConfig} />;
}
