const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

const tokken = process.env.SHOPIFY_TOKEN;
const shopID = process.env.SHOP_ID;

async function calculateShippingfunc(cart, shippingDetails) {
  try {
    const res = await axios.post(
      `https://api.printify.com/v1/shops/${shopID}/orders/shipping.json`,
      {
        line_items: cart,
        address_to: shippingDetails,
      },
      {
        headers: {
          Authorization: `Bearer ${tokken}`,
        },
      }
    );
    const data = res.data;
    let standartShipping = data.standard.toString().split('');
    standartShipping.splice(-2, 0, '.').toString();
    return { standard: standartShipping, shippingRaw: data.standard };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { calculateShippingfunc };
