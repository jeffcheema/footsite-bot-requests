var module = require("./module.js")

var instance = new module.footsiteBotTask({
    sku:'D2920111', 
    footsite: "footlocker", // footlocker, champssports, eastbay, kidsfootlocker, footaction 
    size: "04.0",
    capmonsterKey: ""
});

instance.main()