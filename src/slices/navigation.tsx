import {createSlice} from "@reduxjs/toolkit";
import {
  FiActivity,
  FiBarChart,
  FiBarChart2,
  FiClock,
  FiCompass,
  FiDatabase,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import {PiBankFill, PiWebhooksLogoBold} from "react-icons/pi";

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
        url: "/dashboard/super/usuarios",
        icon: <FiUsers size={20} />,
        title: "Usuarios",
        roleId: 1,
        items: [],
      },
      {
        url: "/dashboard/super/empresas",
        icon: <PiBankFill size={20} />,
        title: "Empresas",
        items: [],
        roleId: 1,
      },
      {
        url: "/dashboard/super/cache",
        icon: <FiDatabase size={20} />,
        title: "Cache",
        items: [
          {
            url: "/dashboard/super/cache/requests",
            title: "Ver cache",
            items: [],
            roleId: 1,
          },
          {
            url: "/dashboard/super/cache/configuracion",
            title: "Configuracion",
            items: [],
            roleId: 1,
          },
        ],
        roleId: 1,
      },
      {
        url: "/dashboard/super/webhooks",
        icon: <PiWebhooksLogoBold size={20} />,
        title: "Webhooks",
        items: [],
        roleId: 1,
      },
      /* Agente */
      {
        url: "/dashboard/oficial/pymes",
        icon: <FiUsers size={20} />,
        title: "Pymes",
        roleId: 3,
        items: [
          {
            url: "/dashboard/oficial/pymes",
            title: "Ver Pymes",
            roleId: 3,
            items: [],
          },
          {
            url: "/dashboard/oficial/pymes/crear",
            title: "Crear Pyme",
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
      {
        url: "/dashboard/oficial/graficos",
        icon: <FiBarChart size={20} />,
        title: "Graficos",
        roleId: 3,
        items: [
          {
            url: "/dashboard/oficial/graficos",
            title: "Listar Graficos",
            roleId: 3,
            items: [],
          },
        ],
      },
      /* Supervisor */
      {
        url: "/dashboard/supervisor/agentes",
        icon: <FiUsers size={20} />,
        title: "Oficiales de Cuenta",
        items: [],
        roleId: 2,
      },

      {
        url: "/dashboard/supervisor/clientes",
        icon: <FiUsers size={20} />,
        title: "Pymes",
        items: [],
        roleId: 2,
      },

      {
        url: "/dashboard/supervisor/reportes",
        icon: <FiFileText size={20} />,
        title: "Reportes",
        items: [
          {
            url: "/dashboard/supervisor/reportes/crear",
            title: "Crear Reporte",
            roleId: 2,
            items: [],
          },
          {
            url: "/dashboard/supervisor/reportes",
            title: "Ver Reportes",
            roleId: 2,
            items: [],
          },
        ],
        roleId: 2,
      },
      {
        url: "/dashboard/supervisor/indicadores",
        icon: <FiActivity size={20} />,
        title: "Indicadores",
        items: [
          {
            url: "/dashboard/supervisor/indicadores",
            title: "Ver Indicadores",
            roleId: 2,
            items: [],
          },
          {
            url: "/dashboard/supervisor/indicadores/plantillas",
            title: "Plantillas",
            roleId: 2,
            items: [],
          },
        ],
        roleId: 2,
      },
      {
        url: "/dashboard/supervisor/graficos",
        icon: <FiBarChart2 size={20} />,
        title: "Graficos",
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
