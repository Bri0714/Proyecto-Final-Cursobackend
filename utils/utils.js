import bcrypt from "bcrypt";
import MockingModel from "../dao/models/mocking.model.js";
import productModel from "../dao/models/product.model.js";
import { faker } from "@faker-js/faker";
import { createProductsDB } from "./createProducts.DB.js";
import logger from "./logger.js";

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateProductsMocking = async () => {
  try {
    const existMocking = await MockingModel.countDocuments().maxTimeMS(30000); // Aumenta el tiempo de espera a 60 segundos

    if (!existMocking) {
      const mockingData = [];

      for (let i = 0; i < 100; i++) {
        mockingData.push({
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          status: true,
          code: faker.string.uuid(),
          stock: faker.number.int({ min: 1, max: 15 }),
          category: faker.commerce.department(),
          thumbnail: [faker.image.urlPicsumPhotos()],
        });
      }

      await MockingModel.insertMany(mockingData);

      logger.info("Generating products mocking");
    }
  } catch (error) {
    logger.error("Error generating mocking products: " + error.message);
  }
};

export const generateProducts = async () => {
  try {
    const existProducts = await productModel.countDocuments().maxTimeMS(30000);

    if (!existProducts) {
      logger.info("Generating products");
      createProductsDB();
    }
  } catch (error) {
    logger.error("Error generating products: " + error.message);
  }
};

export const generateRandomString = (num) => {
  return [...Array(num)]
    .map(() => {
      const randomNum = ~~(Math.random() * 36);
      return randomNum.toString(36);
    })
    .join("")
    .toUpperCase();
};