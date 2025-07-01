import {
  IconHistory,
  IconLogout,
  IconMailExclamation,
  IconNews,
  IconPackage,
  IconUser,
  IconUserMinus,
  IconUsersGroup,
} from "@tabler/icons-react";

export const navdata = [
  { icon: IconUser, item: "User", path: "/admin/users" },
  { icon: IconUserMinus, item: "Roles", path: "/admin/roles" },
  { icon: IconNews, item: "News", path: "/admin/news" },
  { icon: IconUsersGroup, item: "Customers", path: "/admin/customers" },
  { icon: IconPackage, item: "Products", path: "/admin/products" },
  { icon: IconMailExclamation, item: "Orders", path: "/admin/orders" },
  { icon: IconHistory, item: "Riwayat", path: "/admin/riwayat" },
  { icon: IconLogout, item: "Logout", path: "../" },
];
