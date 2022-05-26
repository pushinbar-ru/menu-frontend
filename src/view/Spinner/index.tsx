import React from "react";

import { ReactComponent as SpinnerIcon } from "./Spinner.svg";
import styles from "./styles.module.css";

export interface SpinnerProps {
  forElements?: boolean;
}

const Spinner = ({ forElements = false }: SpinnerProps) => {
  return forElements ? (
    <SpinnerIcon className={styles.icon} />
  ) : (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}>
        <div />
        <div />
      </div>
    </div>
  );
};

export default Spinner;
