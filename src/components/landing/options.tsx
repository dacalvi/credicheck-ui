export type ItemProps = {
  number: number | string;
  title: string;
};
const Item: React.FC<ItemProps> = ({number, title}) => (
  <div className="flex flex-col text-blue-500 p-2 lg:p-6 w-1/2 lg:w-1/5">
    <div className="text-3xl font-bold">{number}</div>
    <div className="font-sm">{title}</div>
  </div>
);

const Options: React.FC = () => (
  <div className="flex flex-row flex-wrap items-center justify-center mb-4 text-center uppercase">
    <Item number={1987} title="Evaluaciones" />
    <Item number={256} title="Empresas" />
    <Item number="+100M" title="Registros analizados" />
    <Item number={130} title="Indicadores" />
  </div>
);

export default Options;
