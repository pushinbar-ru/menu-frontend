import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Input, Button } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";
import Header from "../../../Header";
import { ReactComponent as AdminLogo } from "../../../../images/admin.svg";

interface FormElements extends HTMLFormControlsCollection {
  masterKey: HTMLInputElement;
}

interface ExtendedFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

// TODO: Добавить редирект на главную, если уже авторизован
const AdminLoginPage = () => {
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = (location.state as { from: { pathname: string } }) || {
    from: { pathname: "/admin" },
  };
  const fromPage = from.pathname;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <AdminLogo className={styles.adminLogo} />
        <form
          autoComplete="off"
          onSubmit={(e: React.FormEvent<ExtendedFormElement>) => {
            e.preventDefault();
            const masterKey = e.currentTarget.elements.masterKey.value;
            localStorage.setItem("masterKey", masterKey);
            // TODO: проверяем запрос на бэк
            // TODO: const { isAuth } = useSelector((state) => state.auth);
            const authCheck = localStorage.getItem("masterKey") === "ХОЧУ ПИВО";
            if (authCheck) {
              setValidationErrorMessage("");
              navigate(fromPage, { replace: true });
            } else {
              setValidationErrorMessage("Неправильный мастер-ключ");
            }
          }}
          className={styles.form}
        >
          <Input
            name="masterKey"
            placeholder="Мастер-ключ"
            required
            requiredMessage="Введите мастер-ключ"
            validationErrorMessage={validationErrorMessage}
          />
          <Button
            size="large"
            onClick={() => {
              console.log("click");
            }}
          >
            Войти
          </Button>
        </form>
      </main>
    </>
  );
};

export default AdminLoginPage;
