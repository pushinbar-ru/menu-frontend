import React from "react";
import { Typography } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

export interface CategoryLabelProps {
  name: string;
}

export const CategoryLabel = ({ name }: CategoryLabelProps) => (
  <Typography variant="caption" wide className={styles.label}>
    {name}
  </Typography>
);
