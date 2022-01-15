const { v4: uuidv4 } = require("uuid");
const delay = require('delay');
const { NoCaptchaTaskProxyless } = require("node-capmonster");
const querystring = require("querystring");
const jsdom = require("jsdom");
const fs = require("fs");
const aydenScript = fs.readFileSync("ayden.js", "utf-8");
const { JSDOM } = jsdom;

var key = "10001|A237060180D24CDEF3E4E27D828BDB6A13E12C6959820770D7F2C1671DD0AEF4729670C20C6C5967C664D18955058B69549FBE8BF3609EF64832D7C033008A818700A9B0458641C5824F5FCBB9FF83D5A83EBDF079E73B81ACA9CA52FDBCAD7CD9D6A337A4511759FA21E34CD166B9BABD512DB7B2293C0FE48B97CAB3DE8F6F1A8E49C08D23A98E986B8A995A8F382220F06338622631435736FA064AEAC5BD223BAF42AF2B66F1FEA34EF3C297F09C10B364B994EA287A5602ACF153D0B4B09A604B987397684D19DBC5E6FE7E4FFE72390D28D6E21CA3391FA3CAADAD80A729FEF4823F6BE9711D4D51BF4DFCB6A3607686B34ACCE18329D415350FD0654D";
const { window } = new JSDOM(
  `<body>
  <script>
  ${aydenScript}
  var encryptObject = adyen.encrypt.createEncryption('${key}', {});
  function encrypt(data){
      return encryptObject.encrypt(data);
  }
  </script>
</body>`,
  {runScripts: "dangerously"});

  class footsiteBotTask {
      constructor(data) {
        this.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36"
        this.carted = false;
        this.capmonsterKey = process.env.APIKEY;
        this.sku = data.sku;
        this.footsite = data.footsite;
        this.size = data.size;
        this.footsiteUrl = `www.${this.footsite}.com`;
        this.url = `https://${this.footsiteUrl}/product/~/${this.sku}.html`;
        this.request = require("request-promise");
        this.retryOnFailure = data.retryOnFailure
        this.productId;
        this.shippingMode;
        this.cartGUID = "";
        this.tough = require("tough-cookie");
        this.jar = require("request-promise").jar();
        this.shippingAddress = JSON.parse(fs.readFileSync("./billingShippingInfo.json", "utf-8"))["shippingAddress"]
        this.payment = JSON.parse(fs.readFileSync("./billingShippingInfo.json", "utf-8"))["paymentInfo"]

        this.csrfToken = ""
        this.request = require("request-promise").defaults({
            jar: this.jar
          });
        this.cookie;
        this.sessionData;
        this.datadomeURL = "";
        this.sizes;
        this.step = 0;
      }
      timestamp() {
        return Math.floor(new Date().getTime() / 1000);
      }
      genAydenEncryption(obj) {
        var i = window.eval(`encrypt(${JSON.stringify(obj)})`);
        return i;
      }
      genHeaders(csrf = false) {
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          accept: "application/json",
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          "x-fl-request-id": uuidv4(),
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: this.url,
          "accept-language": "en-US,en;q=0.9"
        };
        return headers;
      }
      async initialInit() {

        var headers = this.genHeaders();
        var options = {
          url: `https://${this.footsiteUrl}`,
          headers: headers,
        };
        var response = await this.request(options)
          .then(function (htmlString) {
            return htmlString;
          })
          .catch(async (err) => {
        });
      }
      
      async initiateSession() {
        var headers = this.genHeaders();
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/v3/session?timestamp=${this.timestamp()}`,
          headers: headers,
        };
        var response = await this.request(options)
          .then(function (htmlString) {
            return htmlString;
          })
          .catch(async (err) => {
              
          });
        return response;
      }      
      async getSizes() {
        //rewrite
      }
      async handleDataDome(url, referer) {
        const recaptcha = new NoCaptchaTaskProxyless(
          this.capmonsterKey
        );
        var r = await recaptcha
          .createTask("6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX", url)
          .then((taskId) => {
            return taskId;
          })
          .then((taskId) => {
            return taskId;
          })
          .then((taskId) => {
            var x = recaptcha.joinTaskResult(taskId).then((response) => {
              return response;
            });
            return x;
          });
        var parameters = querystring.parse(url.split("?")[1]);
    
        var headers = {
          Connection: "keep-alive",
          "sec-ch-ua": "^^Google",
          "sec-ch-ua-mobile": "?0",
          "User-Agent":
            this.UserAgent,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: url,
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: `_ga=GA1.2.1095121226.1615953761; _gid=GA1.2.1222391565.1616295549; _gat=1; datadome=${this.dataDomeCookie}`,
        };
        var newParameters = {
          cid: parameters.cid,
          icid: "AHrlqAAAAAMAanbxBtc8Rr4AaLfzjw==",
          ccid: this.dataDomeCookie,
          "g-recaptcha-response": r,
          hash: parameters.hash,
          ua:
            this.UserAgent,
          referer: `http://${this.footsiteUrl}/api/users/carts/current/entries`,
          parent_url: url,
          "x-forwarded-for": "",
          captchaChallenge: "173576913",
          s: parameters.s,
        };
    
        var options = {
          url: `https://geo.captcha-delivery.com/captcha/check?${querystring.stringify(
            newParameters
          )}`,
          headers: headers,
        };
        var response = await this.request(options).then(function (htmlString) {
          return htmlString;
        });
    
        this.dataDomeCookie = JSON.parse(response)
        .cookie.split("; ")[0]
        .split("=")[1];
        let cookie = new this.tough.Cookie({
          key: "datadome",
          value: this.dataDomeCookie,
          domain: `.${this.footsite}.com`,
          httpOnly: false,
          maxAge: 31536000,
        });
      this.jar.setCookie(cookie.toString(), `https://${this.footsiteUrl}`);
        return response;
      }
      
      async atc() {
        console.log("Adding to Cart");
    
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "x-csrf-token": this.csrfToken,
          "sec-ch-ua-mobile": "?0",
          "x-fl-productid": this.productId,
          "content-type": "application/json",
          accept: "application/json",
          "user-agent":
            this.UserAgent,
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: this.url,
          "accept-language": "en-US,en;q=0.9",
                ...this.manualCookie
    
        };
    
        var dataString = {
          productQuantity: 1,
          productId: this.productId,
        };
    
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/users/carts/current/entries?timestamp=${this.timestamp()}`,
          method: "POST",
          headers: headers,
          resolveWithFullResponse: true,
          body: JSON.stringify(dataString),
        };
        var response = await this.request(options)
          .then(function (htmlString) {
            console.log("Added to Cart!");
            return htmlString;
          })
          .catch(async (err) => {
            if (err.statusCode == 531) {
              console.log("Out of Stock Trying Again")
              await delay(5000)
              await this.atc();
            }
            else if (err.statusCode == 429) {
              console.log("429 Ghost stock?")
              await delay(5000)
              await this.atc();
            }
            else if (err.statusCode == 400) {
              console.log("400 Actually out of stock")
              await delay(5000)
              await this.atc();
            }
            else if (err.statusCode == 403) {
              console.log("Datadome - Solving");
              var dataDomeUrl = JSON.parse(err.error).url;
              var c = await this.handleDataDome(dataDomeUrl);
    
              await this.atc();
            }
            else if (err.code == "ECONNRESET") {
              console.log("Proxy connection dropped - retrying")
              await delay(5000)
              if (!this.carted) {
                await this.atc();
              }
              
            }
            else if (err.statusCode == 503) {
              await this.atc();
    
            }
            else if (err.statusCode == undefined) {
              return true;
            }
          });
        return response;
      }
      async getDataDomeCookie() {
        var headers = {
          Connection: "keep-alive",
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "User-Agent":
            this.UserAgent,
          "Content-type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          Origin: `https://${this.footsiteUrl}`,
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: `https://${this.footsiteUrl}/`,
          "Accept-Language": "en-US,en;q=0.9",
          
        };
    
        var dataString = `jsData=%7B%22ttst%22%3A21.730000007664785%2C%22ifov%22%3Afalse%2C%22wdifts%22%3Afalse%2C%22wdifrm%22%3Afalse%2C%22wdif%22%3Afalse%2C%22br_h%22%3A1297%2C%22br_w%22%3A1197%2C%22br_oh%22%3A1400%2C%22br_ow%22%3A2560%2C%22nddc%22%3A0%2C%22rs_h%22%3A1440%2C%22rs_w%22%3A2560%2C%22rs_cd%22%3A24%2C%22phe%22%3Afalse%2C%22nm%22%3Afalse%2C%22jsf%22%3Afalse%2C%22ua%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F89.0.4389.90%20Safari%2F537.36%22%2C%22lg%22%3A%22en-US%22%2C%22pr%22%3A1%2C%22hc%22%3A8%2C%22ars_h%22%3A1400%2C%22ars_w%22%3A2560%2C%22tz%22%3A420%2C%22str_ss%22%3Atrue%2C%22str_ls%22%3Atrue%2C%22str_idb%22%3Atrue%2C%22str_odb%22%3Atrue%2C%22plgod%22%3Afalse%2C%22plg%22%3A3%2C%22plgne%22%3Atrue%2C%22plgre%22%3Atrue%2C%22plgof%22%3Afalse%2C%22plggt%22%3Afalse%2C%22pltod%22%3Afalse%2C%22lb%22%3Afalse%2C%22eva%22%3A33%2C%22lo%22%3Afalse%2C%22ts_mtp%22%3A0%2C%22ts_tec%22%3Afalse%2C%22ts_tsa%22%3Afalse%2C%22vnd%22%3A%22Google%20Inc.%22%2C%22bid%22%3A%22NA%22%2C%22mmt%22%3A%22application%2Fpdf%2Capplication%2Fx-google-chrome-pdf%2Capplication%2Fx-nacl%2Capplication%2Fx-pnacl%22%2C%22plu%22%3A%22Chrome%20PDF%20Plugin%2CChrome%20PDF%20Viewer%2CNative%20Client%22%2C%22hdn%22%3Afalse%2C%22awe%22%3Afalse%2C%22geb%22%3Afalse%2C%22dat%22%3Afalse%2C%22med%22%3A%22defined%22%2C%22aco%22%3A%22probably%22%2C%22acots%22%3Afalse%2C%22acmp%22%3A%22probably%22%2C%22acmpts%22%3Atrue%2C%22acw%22%3A%22probably%22%2C%22acwts%22%3Afalse%2C%22acma%22%3A%22maybe%22%2C%22acmats%22%3Afalse%2C%22acaa%22%3A%22probably%22%2C%22acaats%22%3Atrue%2C%22ac3%22%3A%22%22%2C%22ac3ts%22%3Afalse%2C%22acf%22%3A%22probably%22%2C%22acfts%22%3Afalse%2C%22acmp4%22%3A%22maybe%22%2C%22acmp4ts%22%3Afalse%2C%22acmp3%22%3A%22probably%22%2C%22acmp3ts%22%3Afalse%2C%22acwm%22%3A%22maybe%22%2C%22acwmts%22%3Afalse%2C%22ocpt%22%3Afalse%2C%22vco%22%3A%22probably%22%2C%22vcots%22%3Afalse%2C%22vch%22%3A%22probably%22%2C%22vchts%22%3Atrue%2C%22vcw%22%3A%22probably%22%2C%22vcwts%22%3Atrue%2C%22vc3%22%3A%22maybe%22%2C%22vc3ts%22%3Afalse%2C%22vcmp%22%3A%22%22%2C%22vcmpts%22%3Afalse%2C%22vcq%22%3A%22%22%2C%22vcqts%22%3Afalse%2C%22vc1%22%3A%22probably%22%2C%22vc1ts%22%3Afalse%2C%22dvm%22%3A8%2C%22sqt%22%3Afalse%2C%22so%22%3A%22landscape-primary%22%2C%22wbd%22%3Afalse%2C%22wbdm%22%3Atrue%2C%22wdw%22%3Atrue%2C%22cokys%22%3A%22bG9hZFRpbWVzY3NpYXBwcnVudGltZQ%3D%3DL%3D%22%2C%22ecpc%22%3Afalse%2C%22lgs%22%3Atrue%2C%22lgsod%22%3Afalse%2C%22bcda%22%3Afalse%2C%22idn%22%3Atrue%2C%22capi%22%3Afalse%2C%22svde%22%3Afalse%2C%22vpbq%22%3Atrue%2C%22xr%22%3Atrue%2C%22bgav%22%3Atrue%2C%22rri%22%3Atrue%2C%22idfr%22%3Atrue%2C%22ancs%22%3Atrue%2C%22inlc%22%3Atrue%2C%22cgca%22%3Atrue%2C%22inlf%22%3Atrue%2C%22tecd%22%3Atrue%2C%22sbct%22%3Atrue%2C%22aflt%22%3Atrue%2C%22rgp%22%3Atrue%2C%22bint%22%3Atrue%2C%22spwn%22%3Afalse%2C%22emt%22%3Afalse%2C%22bfr%22%3Afalse%2C%22dbov%22%3Afalse%2C%22glvd%22%3A%22Google%20Inc.%22%2C%22glrd%22%3A%22ANGLE%20(NVIDIA%20GeForce%20GTX%201060%203GB%20Direct3D11%20vs_5_0%20ps_5_0)%22%2C%22tagpu%22%3A7.12500000372529%2C%22prm%22%3Atrue%2C%22tzp%22%3A%22America%2FLos_Angeles%22%2C%22cvs%22%3Atrue%2C%22usb%22%3A%22defined%22%7D&events=%5B%5D&eventCounters=%5B%5D&jsType=ch&cid=null&ddk=A55FBF4311ED6F1BF9911EB71931D5&Referer=https%253A%252F%252F${this.footsiteUrl}%252Fproduct%252F%7E%252F42964104.html&request=%252Fproduct%252F%7E%252F42964104.html&responsePage=origin&ddv=4.1.37`;
        var options = {
          url: "https://api-js.datadome.co/js/",
          method: "POST",
          headers: headers,
          body: dataString,
        };
        var response = await this.request(options).then(function (htmlString) {
          return htmlString;
        }).catch((err) => {
          return false;
        });
        if (!response){
          return false;
        }
        if (JSON.parse(response).cookie == undefined) {
          return true;
        }
        this.dataDomeCookie = JSON.parse(response)
        .cookie.split("; ")[0]
        .split("=")[1];
        let cookie = new this.tough.Cookie({
          key: "datadome",
          value: this.dataDomeCookie,
          domain: `.${this.footsite}.com`,
          httpOnly: false,
          maxAge: 31536000,
        });
      this.jar.setCookie(cookie.toString(), `https://${this.footsiteUrl}`);
        return true;
      }
      async email() {
        var headers = {
          authority: this.footsiteUrl,
          "content-length": "0",
          "sec-ch-ua": "^^Google",
          "x-csrf-token": this.csrfToken,
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          accept: "application/json",
          tracestate:
            "1461577^@nr=0-1-2684125-655559411-4cbad26deeabb320----1616300902869",
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9"
    
        };
    
        var options = {
          url: `https://${this.footsiteUrl}/api/users/carts/current/email/${this.shippingAddress.email}?timestamp=${this.timestamp()}`,
          method: "PUT",
          headers: headers,
        };
        var response = await this.request(options).then(function (htmlString) {
          return true;
        }).catch(async (err) => {
          if (err.statusCode == 403) {
            console.log("Datadome - Solving");
            var dataDomeUrl = JSON.parse(err.error).url;

            var c = await this.handleDataDome(dataDomeUrl);
    
          }

          return false;
        });
        if (!response){
          return false;
        };

        return response;
      }
      async shippingModes() {
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          tracestate:
            "1461577@nr=0-1-2684125-655559411-a3cb6c5dce3556ca----1616301570896",
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          accept: "application/json",
          "x-fl-request-id": uuidv4(),
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9"
    
        };
    
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/users/carts/current/deliverymodes?timestamp=${this.timestamp()}`,
          headers: headers,
        };
        var response = await this.request(options).then(function (htmlString) {
          return htmlString;
        }).catch((err) => {
    
          return false;
        });

        if (response === false) {
          return false;
        }
        this.shippingMode = JSON.parse(response).deliveryModes[0].code;
    
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "x-csrf-token": this.csrfToken,
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          "content-type": "application/json",
          accept: "application/json",
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9",
                ...this.manualCookie
    
        };
    
        var dataString = {
          deliveryModeId: this.shippingMode,
        };
    
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/users/carts/current/deliverymode?timestamp=${this.timestamp()}`,
          method: "PUT",
          headers: headers,
          body: JSON.stringify(dataString),
        };
        var response = await this.request(options).then(function (htmlString) {
          return true;
        }).catch(async (err) => {
          if (err.statusCode == 403) {
            console.log("Datadome - Solving");
            var dataDomeUrl = JSON.parse(err.error).url;
            var c = await this.handleDataDome(dataDomeUrl);
    
          }
          return false;
        });
     
        return response;
      }
      async shipping() {
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "x-csrf-token": this.csrfToken,
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          "content-type": "application/json",
          accept: "application/json",
          tracestate:
            "1461577@nr=0-1-2684125-655559411-f78c9c11cd03dfb8----1616301215344",
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9"
    
        };
    
        var dataString = {
          shippingAddress: this.shippingAddress,
        };
    
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/users/carts/current/addresses/shipping?timestamp=${this.timestamp()}`,
          method: "POST",
          headers: headers,
          body: JSON.stringify(dataString),
        };
        var response = await this.request(options).then(function (htmlString) {
          return true;
        }).catch(async (err) => {
          if (err.statusCode == 403) {
            console.log("Datadome - Solving");
            var dataDomeUrl = JSON.parse(err.error).url;
            var c = await this.handleDataDome(dataDomeUrl);
    
          }
          return false;
        });
        if (!response){
          return false;
        };
    
        return response;
      }
      async setBilling() {
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "x-csrf-token": this.csrfToken,
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          "content-type": "application/json",
          accept: "application/json",
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9"
    
        };
    
        var dataString = this.shippingAddress;
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/users/carts/current/set-billing?timestamp=${this.timestamp()}`,
          method: "POST",
          headers: headers,
          body: JSON.stringify(dataString)
         
        };
        var response = await this.request(options).then(function (htmlString) {
          return true;
    
        }).catch(async (err) => {
          if (err.statusCode == 403) {
            console.log("Datadome - Solving");
            var dataDomeUrl = JSON.parse(err.error).url;
            var c = await this.handleDataDome(dataDomeUrl);
    
          }
          return false;
        });
        if (!response){
          return false;
        };
    
        return response;
      }
      async submitPayment() {
        var headers = {
          authority: this.footsiteUrl,
          "sec-ch-ua":
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          "x-csrf-token": this.csrfToken,
          traceparent: "00-626efbea305bf638c43c238569c05ca0-c8cb0d43baaedea0-01",
          "sec-ch-ua-mobile": "?0",
          "user-agent":
            this.UserAgent,
          "content-type": "application/json",
          accept: "application/json",
          tracestate:
            "1461577@nr=0-1-2684125-655559411-c8cb0d43baaedea0----1616302942263",
          "x-fl-request-id": uuidv4(),
          origin: `https://${this.footsiteUrl}`,
          "sec-fetch-site": "same-origin",
          "sec-fetch-mode": "cors",
          "sec-fetch-dest": "empty",
          referer: `https://${this.footsiteUrl}/checkout`,
          "accept-language": "en-US,en;q=0.9"
        };
        var encryptedCardNumber = {
          number: this.payment.number,
          generationtime: new Date().toISOString(),
        };
        var encryptedExpiryMonth = {
          expiryMonth: this.payment.expiryMonth,
          generationtime: new Date().toISOString(),
        };
        var encryptedExpiryYear = {
          expiryYear: this.payment.expiryYear,
          generationtime: new Date().toISOString(),
        };
        var encryptedSecurityCode = {
          cvc: this.payment.cardCVV,
          generationtime: new Date().toISOString(),
        };
        var dataString = {
          preferredLanguage: "en",
          termsAndCondition: false,
          deviceId:
            "0400tyDoXSFjKeoNf94lis1ztrjQCvk297SBnrp/XmcfWoVVgr+Rt2dAZIo7BJIRIWDNtjiuvPP9Vk+xH1ZPRIwM6njw/ujAyYdbGKZt5JLThTvosS1xgSAgNfLEMokGoGJxFIfAVsN/zYkLZvJf+ufB1Z5jUZy7hqneDPWCyXC02/owt6O60biHEnpKsuVkvIWFKA75SqnFv74B84+POrI4MlDvgCJ6XflMpM5YbymrVY7rLMnUY2Yy4xZkFqaUZegb+KaePAdj0dC1DOkZ9ybRxHxfYV3WeA0UYsMZmVY5fSMcCN0j9wmCHAZXdN3cxRjgTMj6Y82LrlflYU9iUMb03U590nH6wX2Ew6EDn3071cvrZK78rEblacPV2HBd3HvhoLODmTextWYw+Mgt/W/Ytcotm9dnr3csjofZbR2X0CIID6FY6p00ehQugOFx8rWegR9JAaPaCBTvsD8Ae2HMhAjTuni0YYcF7yZHbT+hap8R+G5BfVwGecCq9DH/qIFmOg9w7I7EUjaf0r+W0Eu9cEGuVKUNAFCt1PXpN4zl2IQd/tZS2Kh2ROY0VDU8CdF7JuFd1AoSV44KuIPyhP/+tc3X8S8pWAYm7BFQVjvF0CKqWvTbz/c+r1tndiE3t0c6oJFizjmIBpFAR27Zdi+vjqJygRQgGX10lcABhHdx+C9adQeFciREm30mzajy+Y8AQ4JudHOlf1KSnrbJSNyIsWB9R+WFa6fdxifyrThRovESnjwNVGXSgGQ8InPsuf6/kpMgG84gzO5PMQF00uJew9XqxzJ4y+q4qed3UtjRESyJGoIAqMo4FKF2IIwuIOQsVIAW7uDQjXPJ5KZOY+8O2Z5lbKwbkY1WLiLEJ4zNTnk1gG7+dJK6MAX8iYyy5jvS7oc5h1YbsShmp4h4IdsMnbuYhkZkoQqHvFQ3SxgXyvTx/y4JwLTE4P4M9O7lUiDQIMyfBSWv/vuXVqFEs8cInSe4mbw3sJmBuGu8HRFfl1d2lPKoFt9iGCAf/lM3SIdtFKdazWzBsEDZ2fE0jdAYtzK13OyWV2XVNRc42M1shcPpQ02Adufmh26jqQ3pQAbKirTQ2FG2mS/b7Zq+a2dgmEYBKknoROYtRRe98FD+RVZWwyLusCg/ZwalR6tq92sLof950W4kmx4Hyf83JPkBAvdbw86vRscVZ/lrwsKFYh1C4MHuHozkPSBfcDhwAT1javSu9sFFV3ncE4nZ3meVnqg0ESQ1nWNXzz8g3vl43JiK6/pdx/gqwnKtH8fVJ2O/erQDFsxcUB8LxNELX944B+yY8Gh6Z0G6PBDZJvzW3drgxBanajQp/g==",
          cartId: this.cartGUID,
          encryptedCardNumber: this.genAydenEncryption(encryptedCardNumber),
          encryptedExpiryMonth: this.genAydenEncryption(encryptedExpiryMonth),
          encryptedExpiryYear: this.genAydenEncryption(encryptedExpiryYear),
          encryptedSecurityCode: this.genAydenEncryption(encryptedSecurityCode),
          paymentMethod: "CREDITCARD",
          returnUrl: `https://${this.footsiteUrl}/adyen/checkout`,
          browserInfo: {
            screenWidth: 2560,
            screenHeight: 1440,
            colorDepth: 24,
            userAgent:
              this.UserAgent,
            timeZoneOffset: 420,
            language: "en-US",
            javaEnabled: false,
          },
        };
        var options = {
          url: `https://${
            this.footsiteUrl
          }/api/v2/users/orders?timestamp=${this.timestamp()}`,
          method: "POST",
          headers: headers,
          body: JSON.stringify(dataString),
        };
        var response = await this.request(options).then(function (htmlString) {
          return htmlString
    
        }).catch(async (err) => {
          if (err.statusCode == 403) {
            console.log("Datadome - Solving");
            var dataDomeUrl = JSON.parse(err.error).url;
            var c = await this.handleDataDome(dataDomeUrl);
    
          }
         
            return err.statusCode;
    
          
        });
        return response;
      }
      isJSON(str) {
            try {
                return (JSON.parse(str) && !!str);
            } catch (e) {
                return false;
            }
        }

      async main() {
        
        if (this.step == 0) { //Initializing Session
            this.sessionData = await this.initiateSession();
            if (!this.isJSON(this.sessionData)) {
              await delay(this.errorDelay);
              console.log("session error retry")
              this.main();
              return;
            }
            this.sessionData = JSON.parse(this.sessionData);
            console.log("Session Initialized")
            this.step++;     
        }
        if (this.step == 1) { // Getting Sizes
            // this.sizes = await this.getSizes();
            this.productId = "22656274"
            this.step++;
          }

          if (this.step == 2) { // Getting Datadome
            console.log("Getting Datadome");
            var getDataDomeCookie = await this.getDataDomeCookie();
            if (!getDataDomeCookie){
              await delay(this.errorDelay)
              this.main();
              return;
            }
            this.step++;
          }
          if (this.step == 3) { //ATC
            var atc = await this.atc();
            var cookies = JSON.parse(JSON.stringify(this.jar))["_jar"].cookies; 
            cookies.forEach((cookie) => {
              if(cookie.key == "cart-guid") {
                this.cartGUID = cookie.value;
              }
            })
            if (this.cartGUID == "") {
              await delay(this.errorDelay)
              console.log("Cart GUID Error")
              this.main();
              return;
            }
            console.log("Added to cart successfully")
            this.step++;
          }

          if (this.step == 4) { //Get a new CSRF token to checkout with
            this.sessionData = await this.initiateSession();
            if (!this.isJSON(this.sessionData)) {
              this.main();
              this.status("NOT JSON, retrying")
              return;
            }
            
            this.sessionData = JSON.parse(this.sessionData);
            this.csrfToken = this.sessionData.data.csrfToken
            console.log(this.csrfToken)
            console.log("Acquired new CSRF token for checkout")
            this.step++;
          }


          //Small for loop to iterate some functions to make code less redundant 
          var functions = [this.email, this.setBilling, this.shipping, this.shippingModes]
          

          if (this.step == 5) { //Submit Email
            console.log("submitting email")
            var email = await this.email();
            console.log(email)
            if (!email){
              await delay(this.errorDelay)
              this.main();
              return;
            }
            this.step++;
          }
      
          if (this.step == 6) { //Set Billing 
            console.log("submitting billing")
            var setBilling = await this.setBilling();
            console.log(setBilling)
            if (!setBilling){
              await delay(this.errorDelay)
              this.main();
              return;
            }
            this.step++;
          }
      
          if (this.step == 7) { //Set Shipping Address
      
            console.log("submitting shipping")
      
            var shipping = await this.shipping();
            if (!shipping){
              await delay(this.errorDelay)
              this.main();
              return;
            }
            this.step++;
          }
      
      
          if (this.step == 8) { //Set Shipping Mode 
            console.log("submitting shipping-method")
      
            var shippingModes = await this.shippingModes();
            if (!shippingModes){
              await delay(this.errorDelay)
              this.main();
              return;
            }
            this.step++;
          }
         
          if (this.step == 9) { //Submit Payment
            console.log("submitting payment")
      
            var payment = await this.submitPayment();
            if (payment == 400) {
              console.log("Payment Decline, retrying");
              await delay(5000)
              this.main();
            }
            else if (payment == 403){
              console.log("Datadome, retrying");
              await delay(5000)
              this.main();
            }
            else {
              this.step++;
            }
          }

        
      }
         
  }

  module.exports = {
    footsiteBotTask
  };