import React from 'react';
import { Chart } from 'primereact/chart';

type Props = {
  type?: string;
  data: any;
  options?: any;
  height?: number | string;
};

export const BaseChart: React.FC<Props> = ({ type = 'line', data, options, height = 300 }) => {
  const style = { height: typeof height === 'number' ? `${height}px` : height } as React.CSSProperties;

  return (
    <div style={style} className="w-full">
      <Chart type={type as any} data={data} options={options} style={{ height: '100%' }} />
    </div>
  );
};

export default BaseChart;
