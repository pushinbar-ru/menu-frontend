import React from "react";
import cn from "classnames";
import {
  Body,
  Button,
  CrossIcon,
  LikeIcon,
  Text,
  Typography,
} from "@pushinbar-ru/bar-ui";

import { getDeclension } from "../../helpers/getDeclension";

import { CategoryLabel } from "../CategoryLabel";
import Price from "../Price";

import styles from "./styles.module.css";

export interface InfoSliderProps {
  product: any; // TODO: заменить на productType;
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InfoSlider = ({ product, opened, setOpened }: InfoSliderProps) => {
  const {
    type: category,
    name,
    likesCount,
    price: priceAmount,
    photo: photoSrc,
    subcategories = [],
    volume,
    alc,
    ibu,
    brewery,
    rest,
    description,
  } = product;

  // TODO: вынести в модель, повторяется в EditProductPage
  const isDrink = ["alcohol", "notalcohol"].includes(
    category?.toLowerCase() || ""
  );

  return (
    <div className={cn(styles.wrapper, { [styles.wrapperOpened]: opened })}>
      <div className={styles.photoWrapper}>
        {photoSrc ? (
          <img src={photoSrc} alt={`Фото товара «${name}»`} />
        ) : (
          <Body>
            Фото <br /> будет <br /> позже
          </Body>
        )}
      </div>
      <div className={styles.productInfoWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            <Body size="large" bold className={styles.textForMobile}>
              {name}
            </Body>
            <Typography variant="h3" className={styles.textForDesktop}>
              {name}
            </Typography>
            {brewery && (
              <>
                <Text className={styles.textForMobile}>{brewery}</Text>
                <Text size="large" className={styles.textForDesktop}>
                  {brewery}
                </Text>
              </>
            )}
          </div>
          <Price amount={priceAmount} />
        </div>
        <div
          className={cn(styles.productInfo, {
            [styles.productInfoNotDrink]: !isDrink,
          })}
        >
          <div className={styles.volume}>
            <Typography variant="caption" className={styles.textForMobile}>
              Объем
            </Typography>
            <Text size="small" className={styles.textForDesktop}>
              Объем
            </Text>
            <Body className={styles.textForMobile}>
              {volume ? `${volume} ${isDrink ? "л" : "г"}` : "-"}
            </Body>
            <Body size="large" className={styles.textForDesktop}>
              {volume ? `${volume} ${isDrink ? "л" : "г"}` : "-"}
            </Body>
          </div>
          {isDrink && (
            <>
              <div className={styles.alc}>
                <Typography variant="caption" className={styles.textForMobile}>
                  % Алк
                </Typography>
                <Text size="small" className={styles.textForDesktop}>
                  % Алк
                </Text>
                <Body className={styles.textForMobile}>
                  {alc ? `${alc}%` : "-"}
                </Body>
                <Body size="large" className={styles.textForDesktop}>
                  {alc ? `${alc}%` : "-"}
                </Body>
              </div>
              <div className={styles.ibu}>
                <Typography variant="caption" className={styles.textForMobile}>
                  IBU
                </Typography>
                <Text size="small" className={styles.textForDesktop}>
                  IBU
                </Text>
                <Body className={styles.textForMobile}>{ibu || "-"}</Body>
                <Body size="large" className={styles.textForDesktop}>
                  {ibu || "-"}
                </Body>
              </div>
            </>
          )}
          <div className={styles.rest}>
            <Typography variant="caption" className={styles.textForMobile}>
              Остаток
            </Typography>
            <Text size="small" className={styles.textForDesktop}>
              Остаток
            </Text>
            <Body className={styles.textForMobile}>{rest}</Body>
            <Body size="large" className={styles.textForDesktop}>
              {rest}
            </Body>
          </div>
        </div>
        {subcategories.length !== 0 && (
          <div className={styles.subcategoriesWrapper}>
            <Text size="large" bold className={styles.textForMobile}>
              Категории
            </Text>
            <Body size="small" bold className={styles.textForDesktop}>
              Категории
            </Body>
            <div className={styles.subcategories}>
              {subcategories.map((item: string) => (
                <CategoryLabel key={item} name={item} />
              ))}
            </div>
          </div>
        )}
        <div className={styles.description}>
          <Text size="large" bold className={styles.textForMobile}>
            Описание
          </Text>
          <Body size="small" bold className={styles.textForDesktop}>
            Описание
          </Body>
          <Text>{description}</Text>
        </div>
        <div className={styles.likeInfoWrapper}>
          <Text size="large" className={styles.likeInfo}>
            {`Понравилось ${likesCount} ${getDeclension(
              "посетителю",
              "посетителям",
              "посетителям"
            )(likesCount)}`}
          </Text>
          {
            // TODO: убрать disabled, когда решим, что делать с лайками
            <Button size="large" icon={<LikeIcon />} disabled>
              Оценить напиток
            </Button>
          }
        </div>
      </div>
      <Button
        size="large"
        icon={<CrossIcon />}
        className={styles.cancelButton}
        onClick={() => setOpened(false)}
      />
    </div>
  );
};
