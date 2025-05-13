import { getCookie } from "cookies-next/client";

import {
  CreateProductDto,
  PaginatedProducts,
  Product,
  ProductQueryParams,
} from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetProducts = async (
  params: ProductQueryParams = {}
): Promise<PaginatedProducts> => {
  const { page = 1, limit = 10 } = params;

  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  try {
    const res = await fetch(
      `${API_URL}/products?includeInactive=true&${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err = await res.json();

      const message =
        typeof err.message === "object" ? err.message[0] : err.message;
      throw new Error(message);
    }

    return await res.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
};

export const apiGetProduct = async (id: string): Promise<Product> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const response = await res.json();

  return response;
};

export const apiCreateProduct = async (
  data: CreateProductDto
): Promise<Product> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const formData = new FormData();
  const {
    name,
    description,
    quantity,
    price,
    priceAfterDiscount,
    imageCover,
    images,
    warranty,
    weight,
    dimensions,
    status,
    categoryId,
    subCategoryId,
    brandId,
  } = data;

  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (quantity) formData.append("quantity", quantity.toString());
  if (price) formData.append("price", price.toFixed(2));
  if (priceAfterDiscount)
    formData.append("priceAfterDiscount", priceAfterDiscount.toFixed(2));
  if (imageCover) formData.append("imageCover", imageCover);
  if (images) {
    images.forEach((file) => {
      formData.append("images", file);
    });
  }
  if (warranty) formData.append("warranty", warranty);
  if (weight) formData.append("weight", weight.toFixed(2));
  if (dimensions) formData.append("dimensions", JSON.stringify(dimensions));
  if (status) formData.append("status", status);
  if (categoryId) formData.append("categoryId", categoryId.toString());
  if (subCategoryId) formData.append("subCategoryId", subCategoryId.toString());
  if (brandId) formData.append("brandId", brandId.toString());

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const response = await res.json();

  return response;
};

export const apiUpdateProduct = async (
  id: number,
  data: Partial<CreateProductDto>
): Promise<Product> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const formData = new FormData();
  const {
    name,
    description,
    quantity,
    price,
    priceAfterDiscount,
    imageCover,
    images,
    warranty,
    weight,
    dimensions,
    status,
    categoryId,
    subCategoryId,
    brandId,
  } = data;

  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (quantity) formData.append("quantity", quantity.toString());
  if (price) formData.append("price", price.toFixed(2));
  if (priceAfterDiscount)
    formData.append("priceAfterDiscount", priceAfterDiscount.toFixed(2));
  if (imageCover) formData.append("imageCover", imageCover);
  if (images) {
    images.forEach((file) => {
      formData.append("images", file);
    });
  }
  // if (images) {
  //   formData.append("images", JSON.stringify(images)); // Send as JSON string
  // }
  if (warranty) formData.append("warranty", warranty);
  if (weight) formData.append("weight", weight.toFixed(2));
  if (dimensions) formData.append("dimensions", JSON.stringify(dimensions));
  if (status) formData.append("status", status);
  if (categoryId) formData.append("categoryId", categoryId.toString());
  if (subCategoryId) formData.append("subCategoryId", subCategoryId.toString());
  if (brandId) formData.append("brandId", brandId.toString());


  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const response = await res.json();

  return response;
};

export const apiDeleteProduct = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }
};
