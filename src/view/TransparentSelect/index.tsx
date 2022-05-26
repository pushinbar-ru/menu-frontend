import React, { useState } from "react";
import cn from "classnames";
import { CaretDownIcon, SelectItem, Typography } from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";

export interface SelectItemProps {
  icon?: JSX.Element;
  label: string;
  value: string;
}

export interface TransparentSelectProps {
  name: string;
  items: Array<SelectItemProps>;
  setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const TransparentSelect = ({
  name,
  items,
  setCurrentValue,
  className,
}: TransparentSelectProps) => {
  const firstItem = items[0];

  const [opened, setOpened] = useState(false);
  const [currentItem, setCurrentItem] = useState(firstItem);

  return (
    <div
      className={cn(styles.select, {
        [styles.select_opened]: opened,
        [className ?? ""]: className,
      })}
    >
      <input
        tabIndex={-1}
        name={name}
        value={currentItem.value}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange={() => {}}
        aria-hidden
      />
      <button
        type="button"
        className={styles.caretDownButton}
        onClick={() => {
          setOpened(!opened);
        }}
      >
        {currentItem.icon}
        <Typography variant="h3">{currentItem.label}</Typography>
        <CaretDownIcon size="large" />
      </button>
      <div className={styles.items}>
        {items.map((item, index) => (
          <SelectItem
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => {
              setOpened(false);
              setCurrentItem(item);
              setCurrentValue(item.value);
              // TODO: переделать на ref
              document
                .querySelector(".select-item_selected")
                ?.classList.remove("select-item_selected");
              e.currentTarget.classList.add("select-item_selected");
            }}
            value={item.value}
          >
            {item.label}
          </SelectItem>
        ))}
      </div>
    </div>
  );
};

export default TransparentSelect;
