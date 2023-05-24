import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Body,
  Button,
  Input,
  Text,
  Typography,
} from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

import {
  getUntappdFetch,
  setProductByCategoryAndId,
} from "../../../../model/product/fetchers";

import Spinner from "../../../Spinner";
import Header from "../../../Header";

const AdminUntappdPage = () => {
  const { productId } = useParams();
  const category = "Alcohol";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [productValues, setProductValues] = useState<any>({}); // TODO: any -> productType
  const [initialValues, setInitialValues] = useState<any>({});

  const [untappdUrl, setUntappdUrl] = useState("");
  const [untappdErrorMessage, setUntappdErrorMessage] = useState("");

  const navigate = useNavigate();

  // TODO: не вызывать этот useEffect в EditProductPage, чтобы не дублировать запрос
  useEffect(() => {
    // TODO: добавить вывод ошибок об отсутствии категорий с айдишнком, или типизировать useParams, или типизировать AdminEditProductPage (сославшись на роутинг, где этот путь точно должен быть)
    if (category && productId) {
      // TODO: накинуть типы вместо any
      setProductByCategoryAndId<any>(
        category,
        productId,
        setLoading,
        setErrorMessage,
        setProductValues
      );
    }
  }, []);

  useEffect(() => {
    if (initialValues.name) {
      navigate(`../products/Alcohol/${productId}`, {
        replace: true,
        state: { untappdValues: initialValues },
      });
    }
  }, [initialValues]);

  // TODO: вынести getTitle в helpers отсюда и из EditProductPage
  const getTitle = (name: string, volume: string) => {
    let title = name;
    if (volume) {
      title += `, ${volume}`;
      // if (isDrink) {
      title += "л";
      // } else {
      //   title += "г";
      // }
    }
    return title;
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Header withBack />
      {errorMessage || (
        <main className={styles.main}>
          <Button
            size="large"
            color="transparent"
            icon={<ArrowLeftIcon />}
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            Вернуться в меню
          </Button>
          <Typography variant="h3" className={styles.title}>
            {getTitle(productValues.name, productValues.volume)}
          </Typography>
          <div className={styles.mainContent}>
            <Body size="large" bold className={styles.subtitle}>
              Быстрое заполнение данными из Untappd
            </Body>
            <Text size="large" className={styles.promt}>
              Вставьте прямую ссылку на товар
            </Text>
            <div className={styles.untappd}>
              <div className={styles.untappdWrapper}>
                <Input
                  name="untappdUrl"
                  placeholder="Ссылка на Untappd"
                  getValue={(value: string) => setUntappdUrl(value)}
                  validationErrorMessage={untappdErrorMessage}
                  withCopy
                  className={styles.input}
                />
                <Button
                  size="large"
                  onClick={() => {
                    // TODO: тут и в Edit зачем-то это условие, хотя кнопка и так дизейблится без этой ссылки
                    if (untappdUrl) {
                      getUntappdFetch(
                        untappdUrl,
                        setLoading,
                        setUntappdErrorMessage,
                        setInitialValues
                      );
                    }
                  }}
                  disabled={!untappdUrl}
                >
                  Загрузить
                </Button>
              </div>
              {/* TODO: копипаста из Edit */}
              <div className={styles.barcodeWrapper}>
                <div
                  className={cn(styles.barcode, {
                    [styles.emptyBarcode]: !productValues.barcode,
                  })}
                >
                  {productValues.barcode ? productValues.barcode : "Нет штрих-кода"}
                </div>
              </div>
              <Button
                size="large"
                color="transparent"
                onClick={() =>
                  navigate(`../products/Alcohol/${productId}`, {
                    replace: true,
                  })
                }
                className={styles.manualAction}
              >
                Заполнить карточку товара вручную
              </Button>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default AdminUntappdPage;
