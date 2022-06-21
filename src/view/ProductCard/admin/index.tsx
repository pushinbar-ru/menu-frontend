import React from "react";
import { Link } from "react-router-dom";
import { Body } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

import Price from "../../Price";
import Like from "../../Like";

export interface AdminProductCardProps {
  id: string;
  category: string;
  name: string;
  likesCount: number;
  priceAmount: number;
  isNew?: boolean;
  photoSrc?: string;
}

const AdminProductCard = ({
  id,
  category,
  name,
  likesCount,
  priceAmount,
  isNew,
  photoSrc,
}: AdminProductCardProps) => {
  // TODO: убрать category после правок на бэке
  const productLink =
    isNew && category.toLowerCase() === "alcohol"
      ? `./untappd/${id}`
      : `./products/${category}/${id}`;

  return (
    <div className={styles.wrapper}>
      <Link to={productLink}>
        {!isNew && (
          <div className={styles.photo}>
            {photoSrc ? (
              <img src={photoSrc} alt={`Фото товара «${name}»`} />
            ) : (
              <Body>
                Здесь могло быть <br /> ваше фото
              </Body>
            )}
          </div>
        )}
      </Link>
      <div className={styles.info}>
        <div className={styles.name}>
          <Link to={productLink}>
            <Body size="small" bold>
              {name}
            </Body>
          </Link>
        </div>
        <div className={styles.otherInfo}>
          <Like count={likesCount} />
          <Price amount={priceAmount} />
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
