import { useMemo } from "react";
import { EntityFormPage } from "@/components/entity/EntityFormPage";
import { getPreconfigurationFormConfig } from "../preconfiguration.form";
import useSenders from "@/features/senders/hooks/useSenders";
import useTemplates from "@/features/templates/hooks/useTemplates";
import useProspects from "@/features/prospects/hooks/useProspects";

export default function PreconfigurationFormPage() {
  const { items: senders, loading: loadingSenders } = useSenders();
  const { items: templates, loading: loadingTemplates } = useTemplates();
  const { items: prospects } = useProspects();

  const config = useMemo(() => {
    const senderOptions = senders.map((s) => ({ label: s.name, value: s.id }));
    const templateOptions = templates.map((t) => ({ label: t.name, value: t.id }));
    const prospectOptions = prospects.map((p) => ({ label: p.name, value: p.id }));
    return getPreconfigurationFormConfig({
      senderOptions,
      templateOptions,
      prospectOptions,
    });
  }, [senders, templates, prospects]);

  const loading = loadingSenders || loadingTemplates;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <i className="pi pi-spin pi-spinner text-3xl text-blue-500 dark:text-blue-400 mb-3" />
        <p className="text-slate-600 dark:text-gray-300">Cargando remitentes, plantillas y prospectos...</p>
      </div>
    );
  }

  return <EntityFormPage config={config} />;
}
