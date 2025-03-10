import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { LogoutDialog } from "@/components/dialogs";
import { useTranslation } from "react-i18next";

const ProfileBox = () => {
  const { t } = useTranslation();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://i.pinimg.com/originals/41/93/b8/4193b809d92b4c203271ac784b6dd011.jpg"
                  alt="Profile Image"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h5 className="text-[13px] font-semibold">Rudeus Greyrat</h5>
                <p className="text-muted text-[10px]">HR Manager</p>
              </div>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="max-w-[200px] min-w-[180px] p-1">
              <h5 className="p-1 text-sm font-bold">
                {t("common.my-account")}
              </h5>

              <hr />

              <LogoutDialog>
                <li className="p-1 text-[13px] hover:bg-accent m-1 rounded-lg text-destructive cursor-pointer">
                  {t("common.log-out")}
                </li>
              </LogoutDialog>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ProfileBox;
