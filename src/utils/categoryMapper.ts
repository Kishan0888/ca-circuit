interface CategoryMap {
  id: string;
  name: string;
}

export function mapCategory(category: string): CategoryMap {
  const value = category.toLowerCase();

  if (value.includes("hotel")) {
    return {
      id: "hospitality",
      name: "Hospitality",
    };
  }

  if (value.includes("restaurant")) {
    return {
      id: "food-beverage",
      name: "Food & Beverage",
    };
  }

  if (value.includes("hospital")) {
    return {
      id: "healthcare",
      name: "Healthcare",
    };
  }

  if (value.includes("factory")) {
    return {
      id: "manufacturing",
      name: "Manufacturing",
    };
  }

  if (value.includes("real estate")) {
    return {
      id: "real-estate",
      name: "Real Estate",
    };
  }

  if (value.includes("franchise")) {
    return {
      id: "franchise",
      name: "Franchise",
    };
  }

  if (value.includes("investment")) {
    return {
      id: "investment",
      name: "Investment",
    };
  }

  return {
    id: "business",
    name: "Business",
  };
}