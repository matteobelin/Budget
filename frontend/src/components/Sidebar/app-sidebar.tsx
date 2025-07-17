import { NavLink, useLocation } from "react-router";
import { Home, Layers, Wallet, LogOut } from "lucide-react";
import { useContext } from "react";
import UserContext from "../../context/UserContex";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Catégories", url: "/categoryList", icon: Layers },
  { title: "Dépenses", url: "/depenseList", icon: Wallet },
];

export function AppSidebar() {
  const location = useLocation();
  const { name, logout } = useContext(UserContext);

  return (
    <Sidebar className="flex flex-col h-full">
      <SidebarContent className="flex flex-col justify-between h-full">

        {/* Menu principal en haut */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>CashSlayer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                            isActive
                              ? "bg-sidebar-primary text-white hover:bg-sidebar-primary/80 hover:text-white"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Infos utilisateur + Déconnexion en bas */}
        <div className="px-4 pb-4">
          {name && (
            <div className="mb-2 text-sm text-sidebar-foreground/70">
              Connecté en tant que <br />
              <span className="font-medium">
                {`${name.lastname ?? ""} ${name.firstname ?? ""}`.trim() || "Invité"}
              </span>
            </div>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                className="flex items-center gap-2 px-2 py-1 rounded text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer w-full"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
