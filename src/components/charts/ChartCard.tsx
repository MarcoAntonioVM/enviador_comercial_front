import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  children?: React.ReactNode;
};

export const ChartCard: React.FC<Props> = ({ title, subtitle, actions, loading, empty, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-gray-400">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">{actions}</div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <i className="pi pi-spin pi-spinner text-2xl text-slate-500 dark:text-gray-400" />
          </div>
        ) : empty ? (
          <div className="text-center text-slate-500 dark:text-gray-400 py-8">Sin datos</div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;
