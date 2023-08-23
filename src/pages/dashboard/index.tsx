import {Spinner} from "flowbite-react";

const Index: React.FC = () => {
  return (
    <>
      <div className="flex">
        <Spinner color="info" aria-label="Info spinner example" />
        <div className="ml-2 mt-1">Redirigiendo al tablero...</div>
      </div>
    </>
  );
};
export default Index;
