import React from "react";
import cn from "classnames";
import { Text } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";
import { ReactComponent as PriceIcon } from "./Price.svg";

export interface PriceProps {
  amount: number;
  className?: string;
}

const Price = ({ amount, className = "" }: PriceProps) => (
  <div className={cn(styles.wrapper, className)}>
    <PriceIcon />
    <div className={styles.price}>
      <Text size="large" wide bold>
        {amount}&thinsp;₽
      </Text>
    </div>
  </div>
);

export default Price;
