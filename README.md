# Footsites Bot
## What is a "Footsite" ? 
A Footsite is any brands/websites under the Footlocker company and they all use the same backend checkout process for all of their products.
Many sneaker bots support footsites and they mainly do it using a request based method as it is more efficient compared to a browser based solution. 
**Keep in mind that this code may be outdated as footsites constantly change their back-end code to help combat sneaker bots**

## How To Replicate The Checkout Process
### 1. Getting the session
In order to replicate the checkout process I had to figure out how the Footlocker front-end communicates with the back-end. 
I quickly found that Footlocker identifies users by their session id stored in the cookies and they have an endpoint where a session can be generated. This endpoint is `/api/v3/session`. This returns a CSRF token which is used in all subsequent requests in the `x-csrf-token` header. 

### 2. Fetching Sizes
After a session has been created, the next step is to fetch the sizes (this is currently outdated and needs to be updated). I have the old code for fetching sizes on my local machine but it is currently ommited in this repository.

### 3. Generating Datadome
At the time this script was written, Datadome was being used as Footlocker's anti bot measure. To generate a Datadome token a POST request must be made to `https://api-js.datadome.co/js/` and the token must be inserted into the Footlocker website's cookies for subsequent requests. 

### 4. Adding to Cart
Adding to cart is as simple as making a POST request to `/api/users/carts/current/entries` with the productId and productQuantity. 

### 5. Getting a new CSRF Token
A new CSRF token needs to be generated to checkout so the process in step #1 is repeated again. 

### 6. Submitting Email, Billing Address, and Shipping Address.
These are all simple POST requests which are not that complex and do not require any tokens to be generated or anything of that sort. 

### 7. Submitting Payment
In order to submit payment, the card number MUST be encrypted using Adyen's JS library. Since Adyen's JS encryption library is meant for the browser and not for the Node runtime environment, I used the [jsdom](https://github.com/jsdom/jsdom) library in order to get mimic the JavaScript Browser runtime environment. After encrypting the card info, it is sent to the `/api/v2/users/orders` endpoint. 

### Does it work? 
Yes it does! Here's an order confirmation for a pair of socks I ordered on Eastbay, only took 7 seconds to checkout!
![Receipt](https://raw.githubusercontent.com/jeffcheema/footsite-bot-requests/main/receipt.png)
