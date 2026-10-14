import "./graphique.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type DataGraph = {
  jours: string;
  severite: number;
};

export type GraphiqueProps = {
  data: DataGraph[];
  interval: number;
};

export default function Graphique({ data, interval }: GraphiqueProps) {
  return (
    <ResponsiveContainer width="100%" height={270}>
      <LineChart
        data={data}
        margin={{ top: 15, right: 15, left: 0, bottom: 15 }}
      >
        <Tooltip />
        <XAxis
          dataKey="jours"
          interval={interval}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          interval={0}
          width={30}
        />

        <Line type="monotone" dataKey="severite" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
