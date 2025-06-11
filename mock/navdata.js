import { IconNews, IconUser, IconUserMinus } from "@tabler/icons-react";
import { href } from "react-router-dom";

export const navdata = [
    {icon : IconUser, item : "User",path :"/admin/users"},
    {icon : IconUserMinus, item : "Roles",path :"/admin/roles"},
    {icon : IconNews, item : "News",path :"/admin/news"},
    {icon : IconUser, item : "Logout",path :"../"}
]