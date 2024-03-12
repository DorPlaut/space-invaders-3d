const express = require('express');
const app = express();
const axios = require('axios');
require('dotenv').config();

const tokken = process.env.SHOPIFY_TOKEN;
const shopID = process.env.SHOP_ID;

async function submitOrder(shipTo, lineItems, externalId) {
  try {
    const res = await axios.post(
      `https://api.printify.com/v1/shops/${shopID}/orders.json`,
      {
        external_id: externalId,
        line_items: lineItems,
        shipping_method: 1,
        send_shipping_notification: false,
        address_to: shipTo,
      },
      {
        headers: {
          Authorization: `Bearer ${tokken}`,
        },
      }
    );
    const data = res.data;
    console.log('submited to Printify');
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { submitOrder };

// "external_id": "2750e210-39bb-11e9-a503-452618153e6a",
//     "line_items": [
//       {
//         "sku": "MY-SKU",
//         "quantity": 1
//       }
//     ],
//     "shipping_method": 1,
//     "send_shipping_notification": false,
//     "address_to": {
//       "first_name": "John",
//       "last_name": "Smith",
//       "email": "example@msn.com",
//       "phone": "0574 69 21 90",
//       "country": "BE",
//       "region": "",
//       "address1": "ExampleBaan 121",
//       "address2": "45",
//       "city": "Retie",
//       "zip": "2470"
//     }
// }
