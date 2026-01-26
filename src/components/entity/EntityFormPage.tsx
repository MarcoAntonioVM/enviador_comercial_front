import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { EntityFormConfig } from "./types";
import { useAppToast } from "@/components/Toast/ToastProvider";
import { FieldRenderer } from "@/components/entity/FieldRenderer";

type Props<TEntity, TForm, TPayload> = {
  config: EntityFormConfig<TEntity, TForm, TPayload>;
};

export function EntityFormPage<TEntity, TForm extends Record<string, any>, TPayload>({
  config,
}: Props<TEntity, TForm, TPayload>) {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showSuccess, showError } = useAppToast();
  const [isLoading, setIsLoading] = useState(isEdit);

  const form = useForm<TForm>({
    resolver: zodResolver(
      // Si el config provee esquemas específicos para crear/editar, elegir según el modo
      (isEdit ? (config.editSchema ?? config.schema) : (config.createSchema ?? config.schema)) as any
    ),
    defaultValues: config.defaultValues as any,
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = form;

  useEffect(() => {
    if (!isEdit || !id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const entity = await config.getById(id);
        if (!cancelled) {
          reset(config.toForm(entity));
        }
      } catch (e: any) {
        if (!cancelled) {
          showError(e.message || "No se pudo cargar el registro");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const onSubmit = async (values: TForm) => {
    try {
      const payload = config.toPayload(values);

      if (isEdit && id) await config.update(id, payload);
      else await config.create(payload);

      showSuccess(`${config.entityName} guardado correctamente`);
      navigate(config.listPath);
    } catch (e: any) {
      showError(e.message || "Error al guardar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con botón de volver */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(config.listPath)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
        >
          <i className="pi pi-arrow-left text-sm"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? `Editar ${config.entityName}` : `Crear Nuevo ${config.entityName}`}
          </h1>
          <p className="text-slate-500">
            {isEdit 
              ? `Modifica la información del ${config.entityName.toLowerCase()}`
              : `Complete los campos para registrar un nuevo integrante al sistema.`
            }
          </p>
        </div>
      </div>

      {/* Card principal */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <i className="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
                <p className="text-slate-600">Cargando datos...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-12 gap-6">
                {config.fields.map((f) => (
                  <FieldRenderer
                    key={String(f.name)}
                    field={f}
                    form={form}
                    isEdit={isEdit}
                  />
                ))}
              </div>

              {/* Botones de acción */}
              <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(config.listPath)}
                  className="px-6 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <i className="pi pi-lock text-sm"></i>
                  <span>{isSubmitting ? "Guardando..." : `Guardar ${config.entityName}`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 flex items-start space-x-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <i className="pi pi-info-circle text-blue-500 mt-0.5"></i>
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Información de permisos</h4>
          <p className="text-sm text-blue-700/80 mt-1">
            Los administradores tienen acceso total a todas las configuraciones del sistema, mientras que los usuarios solo pueden gestionar sus propias campañas.
          </p>
        </div>
      </div>
    </div>
  );
}