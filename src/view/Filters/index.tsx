import React, { useEffect, useState } from "react";
import cn from "classnames";
import {
  FireIcon,
  BeerIcon,
  MilkIcon,
  SaladIcon,
  PeanutIcon,
  SortAZIcon,
  FilterIcon,
  Body,
  Text,
  Label,
  Button,
  Checkbox,
  Input,
  SearchIcon,
} from "@pushinbar-ru/bar-ui";

import styles from "./styles.module.css";
import TransparentSelect from "../TransparentSelect";

export interface FiltersProps {
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setSortType: React.Dispatch<React.SetStateAction<string>>;
  setSortDescending: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
  setContentLoading: React.Dispatch<React.SetStateAction<boolean>>;
  allTags: string[];
  activeTags: string[];
  forAdmin?: boolean;
  className?: string;
}

const Filters = ({
  setCategory,
  setSortType,
  setSortDescending,
  setActiveTags,
  setContentLoading,
  allTags,
  activeTags,
  forAdmin = false,
  className = "",
}: FiltersProps) => {
  const adminFields = forAdmin
    ? [
        {
          icon: <FireIcon size="large" />,
          value: "new",
          label: "Новое из Маркета",
        },
      ]
    : [];
  const items = [
    ...adminFields,
    {
      icon: <BeerIcon size="large" />,
      value: "alcohol",
      label: "Алко",
    },
    {
      icon: <MilkIcon size="large" />,
      value: "notAlcohol",
      label: "Безалко",
    },
    {
      icon: <SaladIcon size="large" />,
      value: "eat",
      label: "Еда",
    },
    {
      icon: <PeanutIcon size="large" />,
      value: "snacks",
      label: "Снэки",
    },
  ];

  // TODO: Вынести это в типы модели и передавать как аргумент
  const adminSortTypes = [
    "по алфавиту",
    "по цене",
    // "по популярности",
    "по остаткам",
  ] as const;

  const clientSortTypes = [
    "по цене",
    "по градусу",
    "по кислотности",
    // "по популярности",
  ] as const;

  const neededSortTypes = forAdmin ? adminSortTypes : clientSortTypes;
  const [currentSort, setCurrentSort] = useState(
    neededSortTypes[neededSortTypes.length - 1]
  );

  const [descending, setDescending] = useState(true);
  const [extendedSort, setExtendedSort] = useState(false);

  const [currentValue, setCurrentValue] = useState(items[0].value);

  // TODO: вынести setAction функции все в родительский компонент (пока нет редакса), передавать сюда значение и сеттер
  useEffect(() => {
    setContentLoading(true);
    setCategory(currentValue);
    setActiveTags([]);
  }, [currentValue]);

  useEffect(() => {
    setContentLoading(true);
    setSortType(currentSort);
  }, [currentSort]);

  useEffect(() => {
    setContentLoading(true);
    setSortDescending(descending);
  }, [descending]);

  return (
    <div
      className={cn(
        styles.container,
        { [styles.clientContainer]: !forAdmin },
        className
      )}
    >
      <TransparentSelect
        name="category"
        items={items}
        setCurrentValue={setCurrentValue}
        className={styles.select}
      />
      <div className={styles.label}>
        {items.map((item) => (
          <Label
            key={item.value}
            onClick={() => setCurrentValue(item.value)}
            size="large"
            icon={item.icon}
            selected={currentValue === item.value}
            changeIconFill={item.value.toLowerCase() === "new"}
          >
            {item.label.toUpperCase()}
          </Label>
        ))}
        {forAdmin && (
          <Input
            name="search"
            placeholder="Поиск"
            icon={<SearchIcon />}
            className={styles.search}
          />
        )}
      </div>
      <div
        className={cn(styles.sorting, {
          [styles.descending]: descending,
          [styles.extended]: extendedSort,
        })}
      >
        <div className={styles.sortOptions}>
          <Body size="small" bold className={styles.sortTitleMobile}>
            Сортировка:
          </Body>
          <Text size="large" className={styles.sortTitleDesktop}>
            Сортировка:
          </Text>
          <Label
            size="large"
            icon={<SortAZIcon />}
            iconPosition="right"
            onClick={() => {
              setContentLoading(true);
              setDescending(!descending);
            }}
            selected
            className={styles.sortLabel}
          >
            {currentSort}
          </Label>
          <div className={styles.sortLabels}>
            {neededSortTypes.map((type) =>
              type === currentSort ? (
                <Label
                  key={type}
                  size="large"
                  icon={<SortAZIcon />}
                  iconPosition="right"
                  onClick={() => {
                    setContentLoading(true);
                    setDescending(!descending);
                  }}
                  selected
                >
                  {type}
                </Label>
              ) : (
                <Label
                  key={type}
                  size="large"
                  onClick={() => setCurrentSort(type)}
                >
                  {type}
                </Label>
              )
            )}
          </div>
        </div>
        <div className={styles.moreOptions}>
          <div className={styles.tagOptions}>
            <Body size="small" bold>
              Тэги:
            </Body>
            {
              // eslint-disable-next-line no-nested-ternary
              currentValue === "new" ? (
                <Text size="large">
                  Тэги доступны только в разделах с заполненными карточками
                  товаров
                </Text>
              ) : allTags.length > 0 ? (
                <div className={styles.tags}>
                  {allTags.map((tag, index) => {
                    const id = `${tag}_${index}`;
                    return (
                      <Checkbox
                        key={id}
                        name="tags"
                        label={tag}
                        id={id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setContentLoading(true);
                            setActiveTags([...activeTags, e.target.value]);
                          } else {
                            setContentLoading(true);
                            setActiveTags(
                              activeTags.filter(
                                (currentTag) => currentTag !== e.target.value
                              )
                            );
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <Text size="large">У данной категории пока нет тегов</Text>
              )
            }
          </div>
          <Button
            size="large"
            color="transparent"
            onClick={() => setExtendedSort(false)}
          >
            Скрыть фильтры
          </Button>
        </div>
        {/* TODO: сделать рендеринг таких компонентов (Mobile/Desktop) с помощью React, а не css */}
        <Button
          size="large"
          color="transparent"
          icon={<FilterIcon />}
          onClick={() => setExtendedSort(true)}
          className={styles.filterButtonDesktop}
        >
          {forAdmin ? "Фильтры" : "Фильтры и сортировка"}
        </Button>
        <Button
          size="large"
          color="transparent"
          icon={<FilterIcon />}
          onClick={() => setExtendedSort(true)}
          className={styles.filterButtonMobile}
        />
      </div>
    </div>
  );
};

export default Filters;
