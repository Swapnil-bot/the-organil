let express = require("express");
let app = express();
let router = require("./routes")
let config = require("config");
let port = config.get("port")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port,()=>{
    console.log(`Connected to ${port}`);
})
