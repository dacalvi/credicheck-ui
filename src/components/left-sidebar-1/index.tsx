import {Fragment} from "react";
import {useAppSelector} from "store";
import Title from "components/left-sidebar-1/title";
import Item from "components/left-sidebar-1/item";
import Logo from "components/left-sidebar-1/logo";
import {useSession} from "next-auth/react";

const LeftSidebar: React.FC = () => {
  const {data} = useSession();

  const navigation = useAppSelector((state) => state.navigation);
  const roles = useAppSelector((state) => state.roles);
  //get the roleId from nextauth session
  const roleId = data?.user?.roleId || 0;

  return (
    <div className="text-gray-900 bg-white border-r border-gray-100 left-sidebar left-sidebar-1 dark:bg-gray-900 dark:border-gray-800 dark:text-white">
      <Logo />
      {navigation.map((menu, i) => (
        <Fragment key={i}>
          <Title>
            {roles.find((role) => role.id === data?.user?.roleId)?.name || "-"}
            <br />
            <small>{data?.user?.companyName}</small>
          </Title>
          <ul>
            {menu.items.map(
              (l0, a) =>
                //check if the roleId is equal to the roleId of the menu item
                roleId === l0.roleId && (
                  <li key={a} className="l0">
                    <Item {...l0} />
                    <ul>
                      {l0.items.map(
                        (l1, b) =>
                          //check if the roleId is equal to the roleId of the menu item
                          roleId === l1.roleId && (
                            <li key={b} className="l1">
                              <Item {...l1} />
                              <ul>
                                {l1.items.map(
                                  (l2, c) =>
                                    //check if the roleId is equal to the roleId of the menu item
                                    roleId === l2.roleId && (
                                      <li key={c} className="l2">
                                        <Item {...l2} />
                                        <ul>
                                          {l2.items.map(
                                            (l3, d) =>
                                              roleId === l3.roleId && (
                                                <li key={d} className="l3">
                                                  <Item {...l3} />
                                                  <ul>
                                                    {l3.items.map((l4, e) => (
                                                      <li
                                                        key={e}
                                                        className="l4">
                                                        <Item {...l4} />
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </li>
                                              )
                                          )}
                                        </ul>
                                      </li>
                                    )
                                )}
                              </ul>
                            </li>
                          )
                      )}
                    </ul>
                  </li>
                )
            )}
          </ul>
        </Fragment>
      ))}
    </div>
  );
};

export default LeftSidebar;
