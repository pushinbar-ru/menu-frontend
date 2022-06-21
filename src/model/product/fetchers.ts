const headers = { "Content-Type": "application/json" };
// const mode = "no-cors";
const requestInit = { headers } as RequestInit;

const getProductFetch = (url: string) => {
  return fetch(url, requestInit)
    .then((r) => r.json())
    .then((r) => {
      return Promise.resolve(r);
    })
    .catch((error) => {
      return Promise.reject(error.message);
    });
};

const setProductFetch = <T>(
  url: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setResult: React.Dispatch<React.SetStateAction<Record<string, T>>>
) => {
  setLoading(true);
  fetch(url, requestInit)
    .then((r) => r.json())
    .then((r) => {
      setResult(r);
      setLoading(false);
    })
    .catch((error) => {
      setErrorMessage(error.message);
      setLoading(false);
    });
};

const getProductsByCategory = (category: string) =>
  getProductFetch(`https://api.pushinbar.ru/products/${category}`);

export const setProductsByCategories = <T>(
  // TODO: Типизировать категории (new, alcohol…)
  categories: string[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setResult: React.Dispatch<React.SetStateAction<Record<string, T>[]>>
) => {
  setLoading(true);
  Promise.all(categories.map(getProductsByCategory))
    .then((r) => {
      setResult(r.flat());
      setLoading(false);
    })
    .catch((error) => {
      setErrorMessage(error.message);
      setLoading(false);
    });
};

export const setProductsByCategory = <T>(
  category: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setResult: React.Dispatch<React.SetStateAction<Record<string, T>>>
) =>
  setProductFetch(
    `https://api.pushinbar.ru/products/${category}`,
    setLoading,
    setErrorMessage,
    setResult
  );

export const setProductByCategoryAndId = <T>(
  category: string,
  id: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setResult: React.Dispatch<React.SetStateAction<Record<string, T>>>
) =>
  setProductFetch(
    `https://api.pushinbar.ru/products/${category}/${id}?id=${id}` /* TODO: убрать query параметр после фикса на бэкенде + вынести URL куда-то */,
    setLoading,
    setErrorMessage,
    setResult
  );

// TODO: заменить any на productType
export const putProductFetch = (category: string, id: string, body: any) => {
  return fetch(`https://api.pushinbar.ru/products/${category}/${id}?id=${id}`, {
    /* TODO: убрать query параметр после фикса на бэкенде + вынести URL куда-то */
    ...requestInit,
    method: "PUT",
    body: JSON.stringify(body),
  })
    .then((r) => {
      return Promise.resolve(r);
    })
    .catch((error) => {
      return Promise.reject(error.message);
    });
};

export const getUntappdFetch = <T>(
  untappdUrl: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setInitialValues: React.Dispatch<React.SetStateAction<Record<string, T>>>
) => {
  setLoading(true);
  fetch(`https://api.pushinbar.ru/Untappd?sourceUrl=${untappdUrl}`, requestInit)
    .then((r) => r.json())
    .then((r) => {
      setInitialValues(r);
      setLoading(false);
    })
    .catch((error) => {
      setErrorMessage(error.message);
      setLoading(false);
    });
};
