import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import {
  ArrowLeftIcon,
  Body,
  Button,
  CancelIcon,
  CheckIcon,
  CloudDownloadIcon,
  CrossIcon,
  ImageIcon,
  Input,
  Label,
  PictureIcon,
  RefreshIcon,
  SaveIcon,
  Select,
  SelectItem,
  Text,
  TextArea,
  Typography,
  Uploader,
} from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

import { getDeclension } from "../../../../helpers/getDeclension";

import {
  putProductFetch,
  setProductByCategoryAndId,
  getUntappdFetch,
} from "../../../../model/product/fetchers";

import Spinner from "../../../Spinner";
import Header from "../../../Header";

const AdminEditProductPage = () => {
  const { category, id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [product, setProduct] = useState<any>({}); // TODO: заменить any на ProductType
  const [uploaderOpened, setUploaderOpened] = useState(false);
  const [photoSrc, setPhotoSrc] = useState("");
  const [saveDesktopButtonWidth, setSaveDesktopButtonWidth] = useState(0);
  const [saveMobileButtonWidth, setSaveMobileButtonWidth] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const { state = {} } = useLocation() as any; // TODO: заменить any
  const { untappdValues = {} } = state ?? {};
  const [initialValues, setInitialValues] = useState(untappdValues);
  const [untappdUrl, setUntappdUrl] = useState(
    initialValues.untappdUrl ?? product.untappdUrl
  );
  const [untappdErrorMessage, setUntappdErrorMessage] = useState("");

  useEffect(() => {
    // TODO: добавить вывод ошибок об отсутствии категорий с айдишнком, или типизировать useParams, или типизировать AdminEditProductPage (сославшись на роутинг, где этот путь точно должен быть)
    if (category && id) {
      // TODO: накинуть типы вместо any
      setProductByCategoryAndId<any>(
        category,
        id,
        setLoading,
        setErrorMessage,
        setProduct
      );
    }
  }, []);

  useEffect(() => {
    if (product.photo) {
      setPhotoSrc(product.photo);
    }
  }, [product]);

  const isDrink = ["alcohol", "notalcohol"].includes(
    category?.toLowerCase() || ""
  );

  const getTitle = (name: string, volume: string) => {
    let title = name;
    if (volume) {
      title += `, ${product.volume}`;
      if (isDrink) {
        title += "л";
      } else {
        title += "г";
      }
    }
    return title;
  };

  const handleFileUpdate = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      setPhotoSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const [isReseted, setIsReseted] = useState(false);
  const textAreaRef = React.createRef<HTMLTextAreaElement>();
  const handleReset = () => {
    setIsReseted(true);
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.innerHTML = "";
    }
    setPhotoSrc("");
    setTimeout(() => setIsReseted(false), 0);
  };

  const saveDesktopButtonRef = useRef<HTMLButtonElement>(null);
  const saveMobileButtonRef = useRef<HTMLButtonElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (saveDesktopButtonRef.current) {
      setSaveDesktopButtonWidth(
        saveDesktopButtonRef.current.getBoundingClientRect().width
      );
    }
    if (saveMobileButtonRef.current) {
      setSaveMobileButtonWidth(
        saveMobileButtonRef.current.getBoundingClientRect().width
      );
    }
    setIsSaving(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSave();
    const values = e.target as any; // TODO: any заменить на ProductType
    // TODO: any заменить на ProductType
    const result: any = {
      name: values.name?.value,
      photo: photoSrc,
      description: values.description?.innerHTML,
      status: values.status.dataset?.value,
      barcode: product.barcode,
    };
    if (isDrink) {
      result.subcategories = values.subcategories.value
        ?.split(",")
        .map((x: string) => x.trim())
        .filter((x: string) => x);
      result.volume = values.volume?.value;
      result.brewery = values.brewery?.value;
      result.ibu = values.ibu?.value;
      result.alc = values.alc?.value;
      result.volume = values.volume?.value;
    }
    if (category?.toLowerCase() === "alcohol") {
      result.untappdUrl = values.untappdUrl?.value;
    }
    console.log(result);

    if (category && id) {
      putProductFetch(category, id, result)
        .then(() => {
          console.log("1111");
          setFetchSuccess(true);
        })
        .catch((err) => {
          console.error(err);
          setFetchSuccess(false);
        })
        .finally(() => {
          setIsSaving(false);
          setFetched(true);
          setTimeout(() => setFetched(false), 5000);
        });
    }
  };

  const navigate = useNavigate();

  return loading ? (
    <Spinner />
  ) : (
    <>
      <Header withBack />
      {errorMessage || (
        <>
          <Uploader
            name="photo"
            title="Загрузить картинку"
            dropMessage="Перетащите картинку сюда"
            dropIcon={<ImageIcon />}
            opened={uploaderOpened}
            setOpened={setUploaderOpened}
            onFileUpdate={handleFileUpdate}
            form="editProduct"
          />
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
            <Typography variant="h3">
              {getTitle(product.name, product.volume)}
            </Typography>
            <div className={styles.mainWrapper}>
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
                id="editProduct"
                className={styles.form}
              >
                <Input
                  name="name"
                  placeholder="Название"
                  initialValue={initialValues.name ?? product.name}
                  className={styles.input}
                  isReseted={isReseted}
                />
                <Input
                  name="additionalName"
                  placeholder="Дополнительное название (например, на английском)"
                  // initialValue={product.name} TODO: добавить, когда появится на бэке
                  className={styles.input}
                  isReseted={isReseted}
                />
                {isDrink ? (
                  <Input
                    name="brewery"
                    placeholder="Пивоварня"
                    initialValue={initialValues.brewery ?? product.brewery}
                    className={styles.input}
                    isReseted={isReseted}
                  />
                ) : (
                  <div className={styles.notDrinkInfo}>
                    <Input
                      name="volume"
                      placeholder="Объем (г)"
                      initialValue={product.volume}
                      className={cn(styles.volume, styles.input)}
                      isReseted={isReseted}
                    />
                    <Input
                      name="sign"
                      placeholder="Подпись"
                      initialValue={product.sign}
                      className={cn(styles.input, styles.sign)}
                      isReseted={isReseted}
                    />
                  </div>
                )}
                <TextArea
                  ref={textAreaRef}
                  name="description"
                  placeholder="Описание"
                  initialValue={
                    initialValues.description ?? product.description
                  }
                  className={styles.inputHigh}
                  isReseted={isReseted}
                />
                {isDrink && (
                  <div className={styles.drinkInfoWrapper}>
                    <Input
                      name="subcategories"
                      placeholder="Категории (разделяются запятой)"
                      initialValue={
                        initialValues.subcategory ??
                        product.subcategories?.join(", ")
                      }
                      className={styles.inputHigh}
                      isReseted={isReseted}
                    />
                    <div className={styles.drinkInfo}>
                      <Input
                        name="alc"
                        placeholder="% Алкоголя"
                        initialValue={initialValues.alc ?? product.alc}
                        className={styles.inputHigh}
                        isReseted={isReseted}
                      />
                      <Input
                        name="ibu"
                        placeholder="IBU"
                        initialValue={initialValues.ibu ?? product.ibu}
                        className={styles.inputHigh}
                        isReseted={isReseted}
                      />
                      <Input
                        name="volume"
                        placeholder="Объем"
                        initialValue={product.volume}
                        className={styles.inputHigh}
                        isReseted={isReseted}
                      />
                    </div>
                  </div>
                )}
                <Select
                  name="status"
                  label="Показывать карточку"
                  className={cn(styles.inputHigh, styles.shortInput)}
                  initialValue={
                    product.status?.toLowerCase() !== "new"
                      ? product.status
                      : "NotPublished"
                  }
                  isReseted={isReseted}
                >
                  <SelectItem value="NotPublished">Только в админке</SelectItem>
                  <SelectItem value="Published">В меню и админке</SelectItem>
                </Select>
                {category?.toLowerCase() === "alcohol" && (
                  <div className={styles.untappdWrapper}>
                    <Input
                      name="untappdUrl"
                      placeholder="Ссылка на Untappd"
                      initialValue={
                        initialValues.untappdUrl ?? product.untappdUrl
                      }
                      isReseted={isReseted}
                      getValue={(value: string) => setUntappdUrl(value)}
                      validationErrorMessage={untappdErrorMessage}
                      withCopy
                      className={cn(styles.input, styles.untappdInput)}
                    />
                    <Button
                      type="button"
                      size="large"
                      icon={<RefreshIcon />}
                      color="transparent"
                      onClick={() => {
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
                      className={styles.untappdAction}
                    >
                      Обновить данные из Untappd
                    </Button>
                  </div>
                )}
                <div className={styles.pictureInfo}>
                  <Body bold>Картинка</Body>
                  <div className={styles.pictureInfoWrapper}>
                    <div className={styles.pictureWrapper}>
                      <div className={styles.picture}>
                        {product.photo || photoSrc ? (
                          <img
                            src={photoSrc || product.photo}
                            alt={`Фото ${product.name}`}
                          />
                        ) : (
                          <>
                            Место
                            <br />
                            для
                            <br />
                            фото
                          </>
                        )}
                      </div>

                      <div className={styles.pictureActionsWrapper}>
                        <div className={styles.pictureActionsMobile}>
                          {/* TODO: Убрать disabled после добавления untappd */}
                          <Button
                            type="button"
                            icon={<CloudDownloadIcon />}
                            disabled
                          >
                            Загрузить из Untappd
                          </Button>
                          <Button
                            type="button"
                            icon={<PictureIcon />}
                            color="transparent"
                            onClick={() => setUploaderOpened(true)}
                          >
                            Загрузить с устройства
                          </Button>
                        </div>
                        <div className={styles.pictureActionsDesktop}>
                          {/* TODO: Убрать disabled после добавления untappd */}
                          <Button
                            size="large"
                            type="button"
                            icon={<CloudDownloadIcon />}
                            disabled
                          >
                            Загрузить из Untappd
                          </Button>
                          <Button
                            size="large"
                            type="button"
                            icon={<PictureIcon />}
                            color="transparent"
                            onClick={() => setUploaderOpened(true)}
                          >
                            Загрузить с устройства
                          </Button>
                        </div>

                        <Text wide className={styles.recommendationsDesktop}>
                          Рекомендуемый размер — 680×760px.
                          <br /> Основной контент картинки должен находиться по
                          центру
                        </Text>
                      </div>
                    </div>
                    <Typography
                      variant="caption"
                      className={styles.recommendationsMobile}
                    >
                      Рекомендуемый размер — 680×760px.
                      <br /> Основной контент картинки должен находиться по
                      центру
                    </Typography>
                  </div>
                </div>
                <div className={styles.changeActionsDesktop}>
                  {
                    // eslint-disable-next-line no-nested-ternary
                    fetched ? (
                      fetchSuccess ? (
                        <Label
                          size="large"
                          icon={<CheckIcon />}
                          className={styles.changeLabelSuccess}
                          changeIconFill
                        >
                          Изменения сохранены
                        </Label>
                      ) : (
                        <Label
                          size="large"
                          icon={<CrossIcon />}
                          className={styles.changeLabelError}
                          changeIconFill
                        >
                          Попробуйте еще раз
                        </Label>
                      )
                    ) : (
                      <>
                        <Button
                          type="button"
                          size="large"
                          icon={<CancelIcon />}
                          color="transparent"
                          onClick={handleReset}
                        >
                          Отменить
                        </Button>
                        <Button
                          ref={saveDesktopButtonRef}
                          size="large"
                          icon={
                            isSaving ? <Spinner forElements /> : <SaveIcon />
                          }
                          color="green"
                          form="editProduct"
                          style={
                            saveDesktopButtonWidth
                              ? { width: `${saveDesktopButtonWidth}px` }
                              : {}
                          }
                          disabled={isSaving}
                        >
                          {isSaving ? "" : "Сохранить изменения"}
                        </Button>
                      </>
                    )
                  }
                </div>
              </form>
              <div className={styles.productInfo}>
                <div className={styles.productInfoWrapper}>
                  <div className={styles.productInfoItem}>
                    <Body size="large" bold>
                      Остаток
                    </Body>
                    <Body size="large">
                      {`${product.rest} ${getDeclension(
                        "штука",
                        "штуки",
                        "штук"
                      )(product.rest)}`}
                    </Body>
                  </div>
                  <div className={styles.productInfoItem}>
                    <Body size="large" bold>
                      Закупочная цена
                    </Body>
                    <Body size="large">Будет позже</Body>
                  </div>
                  <div className={styles.productInfoItem}>
                    <Body size="large" bold>
                      Розничная цена
                    </Body>
                    <Body size="large">{product.price}&thinsp;₽</Body>
                  </div>
                </div>
                <div className={styles.barcodeWrapper}>
                  <Body bold>Штрих-код</Body>
                  <div className={styles.barcode}>
                    {product.barcode ? product.barcode : "0000000000000"}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div className={styles.changeActionsMobile}>
            {
              // eslint-disable-next-line no-nested-ternary
              fetched ? (
                fetchSuccess ? (
                  <Label
                    size="large"
                    icon={<CheckIcon />}
                    className={styles.changeLabelSuccess}
                    changeIconFill
                  >
                    Изменения сохранены
                  </Label>
                ) : (
                  <Label
                    size="large"
                    icon={<CrossIcon />}
                    className={styles.changeLabelError}
                    changeIconFill
                  >
                    Попробуйте еще раз
                  </Label>
                )
              ) : (
                <>
                  <Button
                    type="button"
                    size="large"
                    icon={<CancelIcon />}
                    color="transparent"
                    onClick={handleReset}
                  >
                    Отменить
                  </Button>
                  <Button
                    ref={saveMobileButtonRef}
                    size="large"
                    icon={isSaving ? <Spinner forElements /> : <SaveIcon />}
                    color="green"
                    form="editProduct"
                    style={
                      saveMobileButtonWidth
                        ? { width: `${saveMobileButtonWidth}px` }
                        : {}
                    }
                    disabled={isSaving}
                  >
                    {isSaving ? "" : "Сохранить"}
                  </Button>
                </>
              )
            }
          </div>
        </>
      )}
    </>
  );
};

export default AdminEditProductPage;
