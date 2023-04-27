import {signOut} from "next-auth/react";
import Link from "next/link";
import {FiUser, FiLogIn} from "react-icons/fi";

export type ItemProps = {
  url: string;
  icon: React.ReactNode;
  iconColor?: string;
  name: string;
  badge?: {
    number: number;
    color: string;
  };
};

const AccountLinks: React.FC = () => {
  const items: ItemProps[] = [
    {
      url: "/",
      icon: <FiUser size={18} className="stroke-current" />,
      name: "Perfil",
    },
    {
      url: "#",
      icon: <FiLogIn size={18} className="stroke-current" />,
      name: "Salir",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <ul className="list-none">
        {items.map((item, i) =>
          item.name === "Salir" ? (
            <li key={i}>
              <button onClick={() => signOut()} className="w-full">
                <a className="flex flex-row items-center justify-start w-full h-10 px-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  {item.icon}
                  <span className="mx-2">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`uppercase font-bold inline-flex text-center p-0 leading-none text-xs h-4 w-4 inline-flex items-center justify-center rounded-full ${item.badge.color} ml-auto`}>
                      {item.badge.number}
                    </span>
                  )}
                </a>
              </button>
            </li>
          ) : (
            <li key={i}>
              <Link href={item.url}>
                <a className="flex flex-row items-center justify-start w-full h-10 px-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  {item.icon}
                  <span className="mx-2">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`uppercase font-bold inline-flex text-center p-0 leading-none text-xs h-4 w-4 inline-flex items-center justify-center rounded-full ${item.badge.color} ml-auto`}>
                      {item.badge.number}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default AccountLinks;
