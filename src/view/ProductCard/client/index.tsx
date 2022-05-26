/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-curly-brace-presence */
import React from "react";
import { Body, Typography, Text } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

import Price from "../../Price";
import Like from "../../Like";
import { CategoryLabel } from "../../CategoryLabel";

// TODO: вынести в ProductCard как общее
export interface ClientProductCardProps {
  category: string;
  subcategories?: string[];
  name: string;
  volume?: string;
  brewery?: string;
  alc?: string;
  likesCount: number;
  priceAmount: number;
  photoSrc?: string;
  onClick?: () => void;
}

const ClientProductCard = ({
  category,
  subcategories = [],
  name,
  volume,
  brewery,
  alc,
  likesCount,
  priceAmount,
  photoSrc,
  onClick,
}: ClientProductCardProps) => {
  // TODO: вынести штуки ниже в model, так как они повторяются в EditProduct
  const isDrink = ["alcohol", "notalcohol"].includes(
    category?.toLowerCase() || ""
  );

  const getTitle = () => {
    let title = name;
    if (volume) {
      title += `, ${volume}`;
      if (isDrink) {
        title += "л";
      } else {
        title += "г";
      }
    }
    return title;
  };

  const getAdditional = () => {
    let additional = "";
    if (brewery) {
      additional += brewery;
      if (alc) {
        additional += ` | ${alc}`;
      }
      return additional;
    }
    if (alc) {
      additional += alc;
    }
    return additional;
  };

  const additional = getAdditional();

  return (
    <div className={styles.wrapper}>
      {
        <div className={styles.photoWrapper} onClick={onClick}>
          <div className={styles.photo}>
            {photoSrc ? (
              <img src={photoSrc} alt={`Фото товара «${name}»`} />
            ) : (
              <Body>
                Фото <br /> будет <br /> позже
              </Body>
            )}
          </div>
          <div className={styles.subcategories}>
            {subcategories.map((item) => (
              <CategoryLabel key={item} name={item} />
            ))}
          </div>
          <Price amount={priceAmount} className={styles.price} />
        </div>
      }
      <div className={styles.productInfoWrapper}>
        <div className={styles.productInfo}>
          <Text bold onClick={onClick} className={styles.title}>
            {getTitle()}
          </Text>
          {additional && (
            <Typography variant="caption">{additional}</Typography>
          )}
        </div>
        <div className={styles.likes}>
          <Like count={likesCount} />
        </div>
      </div>
    </div>
  );
};

export default ClientProductCard;
