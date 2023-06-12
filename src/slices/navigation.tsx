import {createSlice} from "@reduxjs/toolkit";
import {FiActivity, FiClock, FiCompass, FiUsers} from "react-icons/fi";
import {HiOfficeBuilding} from "react-icons/hi";

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
            url: "/dashboard/usuarios",
            title: "Usuarios",
            items: [],
            roleId: 1,
          },
        ],
        roleId: 1,
      },
      {
        url: "/dashboard/empresas",
        icon: <HiOfficeBuilding size={20} />,
        title: "Empresas",
        items: [
          {
            url: "/dashboard/empresas",
            title: "Ver empresas",
            items: [],
            roleId: 1,
          },
        ],
        roleId: 1,
      },

      /* Agente */
      {
        url: "/dashboard/clientes",
        icon: <FiUsers size={20} />,
        title: "Clientes",
        roleId: 3,
        items: [
          {
            url: "/dashboard/clientes",
            title: "Ver Clientes",
            roleId: 3,
            items: [],
          },
        ],
      },
      {
        url: "/dashboard/procesos",
        icon: <FiActivity size={20} />,
        title: "Procesos",
        roleId: 3,
        items: [
          {
            url: "/dashboard/procesos",
            title: "Ver Procesos",
            roleId: 3,
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
        url: "/dashboard/agentes",
        icon: <FiUsers size={20} />,
        title: "Oficiales de Cuenta",
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
