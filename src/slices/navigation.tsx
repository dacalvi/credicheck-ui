import {createSlice} from "@reduxjs/toolkit";
import {
  FiActivity,
  FiClock,
  FiCompass,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
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
        icon: <FiUsers size={20} />,
        title: "Usuarios",
        items: [
          {
            url: "/dashboard/super/usuarios",
            title: "Ver Usuarios",
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
            url: "/dashboard/super/empresas",
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
          {
            url: "/dashboard/clientes/crear",
            title: "Crear Cliente",
            roleId: 3,
            items: [],
          },
        ],
      },
      {
        url: "/dashboard/reportes",
        icon: <FiFileText size={20} />,
        title: "Reportes",
        roleId: 3,
        items: [
          {
            url: "/dashboard/oficial/reportes/crear",
            title: "Crear Reporte",
            roleId: 3,
            items: [],
          },
          {
            url: "/dashboard/oficial/reportes",
            title: "Ver Reportes",
            roleId: 3,
            items: [],
          },
        ],
      },
      /* Supervisor */
      {
        url: "/dashboard/supervisor/agentes",
        icon: <FiUsers size={20} />,
        title: "Agentes",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/supervisor/reportes",
        icon: <FiFileText size={20} />,
        title: "Reportes",
        items: [],
        roleId: 2,
      },
      {
        url: "/dashboard/supervisor/indicadores",
        icon: <FiActivity size={20} />,
        title: "Indicadores",
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
