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
  roleId?: number;
};

const initialState: NavigationState[] = [
  {
    title: "Menu Principal",
    items: [
      /* Dashboard */
      {
        url: "/dashboard",
        icon: <FiCompass size={20} />,
        title: "Inicio",
        items: [],
        roleId: 1,
      },
      {
        url: "/dashboard",
        icon: <FiCompass size={20} />,
        title: "Inicio",
        items: [],
        roleId: 2,
      },

      /* Super Admin */
      {
        url: "/dashboard/configuracion",
        icon: <FiClock size={20} />,
        title: "Configuracion",
        items: [
          {
            url: "/dashboard/crear-usuario",
            title: "Crear Usuario",
            items: [],
            roleId: 1,
          },
        ],
        roleId: 1,
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
        url: "/dashboard/iniciar-proceso",
        icon: <FiClock size={20} />,
        title: "Iniciar Proceso",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/ver-procesos",
        icon: <FiClock size={20} />,
        title: "Ver Procesos",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/nuevo-agente",
        icon: <FiClock size={20} />,
        title: "Nuevo Agente",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/editar-reglas",
        icon: <FiClock size={20} />,
        title: "Editar Reglas",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/crear-fuente",
        icon: <FiClock size={20} />,
        title: "Crear Fuente",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/crear-indicador",
        icon: <FiClock size={20} />,
        title: "Crear Indicador",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/editar-indicador",
        icon: <FiClock size={20} />,
        title: "Editar Indicador",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/editar-indicador-detalle",
        icon: <FiClock size={20} />,
        title: "Editar Indicador Det",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/editar-caracteristica",
        icon: <FiClock size={20} />,
        title: "Editar Caracteristica",
        items: [],
        roleId: 2,
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
