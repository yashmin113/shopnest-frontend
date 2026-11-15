export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books & Stationery",
  "Toys & Games",
  "Grocery",
  "Accessories",
  "Other",
];

export const getCategoryOptions = (currentCategory) => {
  if (currentCategory && !PRODUCT_CATEGORIES.includes(currentCategory)) {
    return [currentCategory, ...PRODUCT_CATEGORIES];
  }

  return PRODUCT_CATEGORIES;
};
