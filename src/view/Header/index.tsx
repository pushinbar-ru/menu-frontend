import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { Button, SearchIcon, ArrowLeftIcon } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

import { ReactComponent as Logo } from "../../images/logo.svg";
import { ReactComponent as Menu } from "../../images/menu.svg";

export interface HeaderProps {
  withSearch?: boolean;
  withBack?: boolean;
  className?: string;
}

const Header = ({
  withSearch = false,
  withBack = false,
  className = "",
}: HeaderProps) => {
  const navigate = useNavigate();

  const location = useLocation();
  const currentLocation = location.pathname
    .split("/")
    .map((x) => x.toLowerCase());
  const forAdmin = currentLocation.includes("admin");
  const isLogin = currentLocation.slice(-1)[0] === "login";

  return (
    <header
      className={cn(styles.header, { [styles.login]: isLogin }, className)}
    >
      {withBack && (
        <Button
          size="large"
          color="transparent"
          icon={<ArrowLeftIcon />}
          onClick={() => navigate(-1)}
        />
      )}
      <Logo className={cn({ [styles.logo]: !forAdmin })} />
      {!isLogin && (
        <span className={cn({ [styles.title]: !forAdmin })}>
          {forAdmin ? "АДМИНКА" : "МЕНЮ"}
        </span>
      )}
      {!forAdmin && <Menu className={styles.menu} />}
      {withSearch && (
        <Button size="large" color="transparent" icon={<SearchIcon />} />
      )}
    </header>
  );
};

export default Header;
