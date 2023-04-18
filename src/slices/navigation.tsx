import {createSlice} from "@reduxjs/toolkit";
import {
  FiToggleLeft,
  FiList,
  FiActivity,
  FiCalendar,
  FiStar,
  FiDroplet,
  FiGrid,
  FiClock,
  FiCopy,
  FiUser,
  FiPieChart,
  FiCompass,
  FiHelpCircle,
  FiShoppingCart,
  FiHome,
} from "react-icons/fi";

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

      {
        url: "/",
        icon: <FiActivity size={20} />,
        title: "Apps",
        items: [
          {
            url: "/social-feed",
            title: "Social feed",
            items: [],
          },
          {
            url: "/tasks",
            title: "Tasks",
            items: [],
          },
          {
            url: "/inbox",
            title: "Inbox",
            items: [],
          },
          {
            url: "/todo",
            title: "Todo",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiList size={20} />,
        title: "Menu levels",
        items: Array.from(Array(4).keys()).map((i) => {
          return {
            url: "/",
            title: `Level 1-${i + 1}`,
            items: Array.from(Array(4).keys()).map((j) => {
              return {
                url: "/",
                title: `Level 2-${j + 1}`,
                items: Array.from(Array(4).keys()).map((k) => {
                  return {
                    url: "/",
                    title: `Level 3-${k + 1}`,
                    items: Array.from(Array(4).keys()).map((l) => {
                      return {
                        url: "/",
                        title: `Level 4-${l + 1}`,
                        items: [],
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      },
      {
        url: "/",
        icon: <FiStar size={20} />,
        title: "Demos",
        badge: {
          color: "bg-indigo-500 text-white",
          text: 6,
        },
        items: [
          {
            url: "/demo-1",
            title: "Light background",
            items: [],
          },
          {
            url: "/demo-2",
            title: "Dark background",
            items: [],
          },
          {
            url: "/demo-3",
            title: "Small sidebar",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiShoppingCart size={20} />,
        title: "E-commerce",
        items: [
          {
            url: "/e-commerce",
            title: "Products",
            items: [],
          },
          {
            url: "/invoice",
            title: "Invoice",
            items: [],
          },
          {
            url: "/pricing-tables",
            title: "Pricing tables",
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        url: "/",
        icon: <FiDroplet size={20} />,
        title: "UI Elements",
        items: [
          {
            url: "/badges",
            title: "Badges",
            items: [],
          },
          {
            url: "/breadcrumbs",
            title: "Breadcrumbs",
            items: [],
          },
          {
            url: "/buttons",
            title: "Buttons",
            items: [],
          },
          {
            url: "/dropdowns",
            title: "Dropdowns",
            items: [],
          },
          {
            url: "/images",
            title: "Images",
            items: [],
          },
          {
            url: "/lists",
            title: "Lists",
            items: [],
          },
          {
            url: "/progress-bars",
            title: "Progress bars",
            items: [],
          },
          {
            url: "/pagination",
            title: "Pagination",
            items: [],
          },
          {
            url: "/tabs",
            title: "Tabs",
            items: [],
          },
          {
            url: "/typography",
            title: "Typography",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiCalendar size={20} />,
        title: "Forms",
        badge: {
          color: "bg-indigo-500 text-white",
          text: 6,
        },
        items: [
          {
            url: "/default-forms",
            title: "Default forms",
            items: [],
          },
          {
            url: "/switches",
            title: "Switches",
            items: [],
          },
          {
            url: "/steps",
            title: "Form steps",
            items: [],
          },
          {
            url: "/validation",
            title: "Form validation",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiGrid size={20} />,
        title: "Tables",
        items: [
          {
            url: "/default-tables",
            title: "Default tables",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiClock size={20} />,
        title: "Notifications",
        badge: {
          color: "bg-indigo-500 text-white",
          text: 2,
        },
        items: [
          {
            url: "/alerts",
            title: "Alerts",
            items: [],
          },
          {
            url: "/notifications",
            title: "Notifications",
            items: [],
          },
          {
            url: "/modals",
            title: "Modals",
            items: [],
          },
          {
            url: "/popovers",
            title: "Popovers",
            items: [],
          },
          {
            url: "/tooltips",
            title: "Tooltips",
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        url: "/",
        icon: <FiCopy size={20} />,
        title: "Authentication",
        badge: {
          color: "bg-indigo-500 text-white",
          text: 7,
        },
        items: [
          {
            url: "/contact-us-1",
            title: "Contact us",
            items: [],
          },
          {
            url: "/login-1",
            title: "Login 1",
            items: [],
          },
          {
            url: "/login-2",
            title: "Login 2",
            items: [],
          },
          {
            url: "/login-3",
            title: "Login 3",
            items: [],
          },
          {
            url: "/create-account",
            title: "Create account",
            items: [],
          },
          {
            url: "/email-confirmation",
            title: "Email confirmation",
            items: [],
          },
          {
            url: "/logout",
            title: "Logout",
            items: [],
          },
          {
            url: "/reset-password",
            title: "Reset password",
            items: [],
          },
          {
            url: "/forgot-password",
            title: "Forgot password",
            items: [],
          },
          {
            url: "/lock-screen",
            title: "Lock screen",
            items: [],
          },
          {
            url: "/subscribe",
            title: "Subscribe",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiUser size={20} />,
        title: "User",
        items: [
          {
            url: "/user-profile",
            title: "User profile",
            items: [],
          },
          {
            url: "/social-feed",
            title: "Social feed",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiClock size={20} />,
        title: "Pages",
        items: [
          {
            url: "/support-1",
            title: "Support",
            items: [],
          },
          {
            url: "/empty-page",
            title: "Empty page",
            items: [],
          },
          {
            url: "/terms-of-service",
            title: "Terms of service",
            items: [],
          },
          {
            url: "/privacy-policy",
            title: "Privacy policy",
            items: [],
          },
          {
            url: "/error-page",
            title: "Error page",
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        url: "/",
        icon: <FiPieChart size={20} />,
        title: "Charts",
        badge: {
          color: "bg-indigo-500 text-white",
          text: 4,
        },
        items: [
          {
            url: "/bar-charts",
            title: "Bar charts",
            items: [],
          },
          {
            url: "/line-charts",
            title: "Line and area charts",
            items: [],
          },
          {
            url: "/pie-charts",
            title: "Pie and doughnut charts",
            items: [],
          },
        ],
      },
      {
        url: "/",
        icon: <FiToggleLeft size={20} />,
        title: "Icons",
        items: [
          {
            url: "/react-icons",
            title: "React icons",
            items: [],
          },
          {
            url: "/country-flags",
            title: "Country flags",
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: "Docs",
    items: [
      {
        url: "/documentation",
        icon: <FiHelpCircle size={20} />,
        title: "Documentation",
        items: [],
      },
    ],
  },
  {
    title: "Intro",
    items: [
      {
        url: "/landing",
        icon: <FiHome size={20} />,
        title: "Home page",
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
