const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

const tokken = process.env.SHOPIFY_TOKEN;
const shopID = process.env.SHOP_ID;

async function getProducts() {
  try {
    const res = await axios.get(
      `https://api.printify.com/v1/shops/${shopID}/products.json`,
      {
        headers: {
          Authorization: `Bearer ${tokken}`,
        },
      }
    );
    const allProductsFullData = res.data.data;

    // veriantsIdArr = allProductsFullData.map((i) => {
    //   console.log(i.images);
    // });
    const allProductsfillterdData = allProductsFullData.map((product) => {
      generalID = product.id;
      title = product.title;
      description = product.description;
      images = product.images.map((product) => {
        return {
          img: product.src,
          id: product.variant_ids,
          isDefault: product.is_default,
        };
      });
      categories = product.tags;
      optionTypes = product.options.map((product) => {
        return product.type;
      });

      // variants
      variants = product.variants.filter((product) => {
        if (product.is_enabled) {
          return product;
        }
      });
      // avilable id's
      avilableOptionsIdsRaw = variants.map((i) => {
        return i.options;
      });
      let avilableOptionsIds = [];
      avilableOptionsIdsRaw.map((i) => {
        i.map((x) => {
          avilableOptionsIds.push(x);
        });
      });
      // options
      fullOptions = product.options;
      optionsValues = fullOptions.map((i) => {
        return i.values.filter((i) => {
          if (avilableOptionsIds.includes(i.id)) {
            return i.id;
          }
        });
      });
      options = fullOptions.map((i, index) => {
        return {
          name: i.name,
          type: i.type,
          values: optionsValues[index],
        };
      });

      return {
        generalID: generalID,
        title: title,
        description: description,
        images: images,
        categories: categories,
        optionTypes: optionTypes,
        variants: variants,
        options: options,
      };
      // end of return
    });
    // console.log(allProductsFullData);
    // return allProductsFullData;
    return allProductsfillterdData;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getProducts };
