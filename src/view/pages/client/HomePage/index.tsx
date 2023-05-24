/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";

import { setProductsByCategories } from "../../../../model/product/fetchers";

// TODO: вынести все компоненты в один файл
import Filters from "../../../Filters";
import Header from "../../../Header";
import Spinner from "../../../Spinner";
import ClientProductCard from "../../../ProductCard/client";
import { InfoSlider } from "../../../InfoSlider";

const ClientHomePage = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // TODO: заменить any на другой тип, когда вынесу
  const [products, setProducts] = useState<Record<string, any>[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    Record<string, any>[]
  >([]);
  const [contentLoading, setContentLoading] = useState(false);
  // TODO: вынести многие штуки для state'а в Redux
  const [category, setCategory] = useState("");
  const [sortType, setSortType] = useState("");
  const [descending, setDescending] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tags, setActiveTags] = useState<string[]>([]);

  const [opened, setOpened] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({}); // TODO: заменить any на productType

  useEffect(() => {
    // TODO: добавить вывод ошибок об отсутствии категорий с айдишнком, или типизировать useParams, или типизировать AdminEditProductPage (сославшись на роутинг, где этот путь точно должен быть)
    // TODO: накинуть типы вместо any
    setProductsByCategories<any>(
      ["alcohol", "notAlcohol", "eat", "snacks"],
      setPageLoading,
      setErrorMessage,
      setProducts
    );
  }, []);

  // TODO: вынести сортировки в модель
  // TODO: добавить useCallback и useMemo для оптимизации
  useEffect(() => {
    const categoryAndTagsFiltered = products.filter(
      (product) =>
        product.status.toLowerCase() === "published" &&
        product.type.toLowerCase() === category.toLowerCase() &&
        (tags.length === 0 ||
          product.subcategories.some((tag: string) => allTags.includes(tag)))
    );
    // TODO: вынести в общую функцию sort, принимающая массив и тип сортировки. В начале проверить на null, а потом вызывать sortByType
    const sortByType = {
      "по алфавиту": (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
      "по цене": ({ price: a }, { price: b }) =>
        a === null ? -1 : b === null ? 1 : a - b,
      // "по популярности": ({ likesCount: a }, { likesCount: b }) =>
      //   a === null ? -1 : b === null ? 1 : a - b,
      "по остаткам": ({ rest: a }, { rest: b }) =>
        a === null ? -1 : b === null ? 1 : a - b,
      "по градусу": ({ alc: a }, { alc: b }) =>
        a === null ? -1 : b === null ? 1 : a - b,
      "по кислотности": ({ ibu: a }, { ibu: b }) =>
        a === null ? -1 : b === null ? 1 : a - b,
      // eslint-disable-next-line no-unused-vars
    } as Record<string, (a: any, b: any) => number>; // TODO: any заменить на ProductType
    const sortedProducts = categoryAndTagsFiltered.sort((a, b) => {
      const result = sortByType[sortType](a, b);
      return descending ? -result : result;
    });
    setFilteredProducts(sortedProducts);

    setAllTags(
      sortedProducts
        // TODO: исправить фильтрацию, когда на бэке исправят split тэгов
        .filter((product) => product.subcategories[0] !== "")
        .map((product) => product.subcategories)
        .flat()
    );

    setContentLoading(false);
  }, [category, sortType, descending, tags]);

  return pageLoading ? (
    <Spinner />
  ) : (
    <>
      <div className={styles.headerWrapper}>
        <Header className={styles.header} />
        <Filters
          setCategory={setCategory}
          setSortType={setSortType}
          setSortDescending={setDescending}
          setActiveTags={setActiveTags}
          setContentLoading={setContentLoading}
          // TODO: добавить оптимизацию для вытягивания тэгов (например, в redux при fetch добавлять в set)
          allTags={allTags}
          activeTags={tags}
          className={styles.filters}
        />
      </div>
      {errorMessage || contentLoading ? (
        <Spinner />
      ) : (
        <>
          <main className={styles.main}>
            {
              // TODO: заменить у карточек прием аргументов: принимать product, а деструктуризацию делать внутри элементов
              filteredProducts.map((product) => (
                <ClientProductCard
                  key={product.id}
                  category={product.type}
                  name={product.name}
                  // likesCount={product.likesCount}
                  priceAmount={product.price}
                  photoSrc={product.photo}
                  volume={product.volume}
                  alc={product.alc}
                  subcategories={product.subcategories}
                  brewery={product.brewery}
                  onClick={() => {
                    setCurrentProduct(product);
                    setOpened(true);
                  }}
                />
              ))
            }
          </main>
          <InfoSlider
            product={currentProduct}
            opened={opened}
            setOpened={setOpened}
          />
        </>
      )}
    </>
  );
};

export default ClientHomePage;
