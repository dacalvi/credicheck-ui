import {createSlice} from "@reduxjs/toolkit";
import {FiClock, FiCompass} from "react-icons/fi";

export type NavigationState = {
  title: string;
  url?: string | undefined;
  items: NavigationState[];
  icon?: React.ReactNode;
  badge?: {
    color: string;
    text: string | number;
  };
};

const initialState: NavigationState[] = [
  {
    title: "Menu Principal",
    items: [
      {
        url: "/dashboard",
        icon: <FiCompass size={20} />,
        title: "Inicio",
        items: [],
      },
      /* Agente */
      {
        url: "/dashboard/procesos",
        icon: <FiClock size={20} />,
        title: "Agente",
        items: [
          {
            url: "/dashboard/ver-procesos",
            title: "Ver Procesos",
            items: [],
          },
          {
            url: "/dashboard/nuevo-prospecto",
            title: "Nuevo Prospecto",
            items: [],
          },
        ],
      },
      /* Supervisor */
      {
        url: "/dashboard/procesos",
        icon: <FiClock size={20} />,
        title: "Supervisor",
        items: [
          {
            url: "/dashboard/crear-usuario",
            title: "Crear Usuario",
            items: [],
          },
          {
            url: "/dashboard/iniciar-proceso",
            title: "Iniciar Proceso",
            items: [],
          },
          {
            url: "/dashboard/ver-procesos",
            title: "Ver Procesos",
            items: [],
          },
          {
            url: "/dashboard/nuevo-agente",
            title: "Nuevo Agente",
            items: [],
          },
          {
            url: "/dashboard/editar-reglas",
            title: "Editar Reglas",
            items: [],
          },
          {
            url: "/dashboard/crear-fuente",
            title: "Crear Fuente",
            items: [],
          },
          {
            url: "/dashboard/crear-indicador",
            title: "Crear Indicador",
            items: [],
          },
          {
            url: "/dashboard/editar-indicador",
            title: "Editar Indicador",
            items: [],
          },
          {
            url: "/dashboard/editar-indicador-detalle",
            title: "Editar Indicador Det",
            items: [],
          },
          {
            url: "/dashboard/editar-caracteristica",
            title: "Editar Caracteristica",
            items: [],
          },
        ],
      },
      /* Publicas */
      {
        url: "/dashboard/credenciales-cliente",
        icon: <FiClock size={20} />,
        title: "Credenciales",
        items: [],
      },
      {
        url: "/dashboard/credenciales-cliente-gracias",
        icon: <FiClock size={20} />,
        title: "Credenciales Gracias",
        items: [],
      },
      {
        url: "/dashboard/login-1",
        icon: <FiClock size={20} />,
        title: "Login",
        items: [],
      },
      {
        url: "/forgot-password",
        icon: <FiClock size={20} />,
        title: "Olvide Contrasena",
        items: [],
      },
    ],
  },
];

// Define the initial state using that type

export const navigationSlice = createSlice({
  name: "navigation",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export default navigationSlice.reducer;
