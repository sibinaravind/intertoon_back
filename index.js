const express = require("express");
const app = express();
var body_parser = require('body-parser');
app.use(express.json());
app.use(body_parser.urlencoded({ extended: false }));
var db = require('./config/connection');
var collection = require("./config/collections")
const port = process.env.PORT || 3000;

const { checkToken } = require("./middleware");
db.connect((err) => {
    if (err)
        console.log("mongo connection error " + err)
    else
        console.log("mongo connected")
});

app.post('/products', checkToken, async function (req, res) {
    let foodlist = await db.get().collection(collection.FOODLIST).
        find({ name: req.body.searchstring != '' ? { $regex: new RegExp(req.body.searchstring), $options: '$i' } : { $exists: true } }).sort({ name: -1 }).toArray()
    if (foodlist.length == 0) {
        res.status(500).json({
            msg: "No Result Found",
            data: {
                products: foodlist,
                total: foodlist.length
            }

        });
    }
    else if (req.body.searchstring != '') {
        res.status(500).json({
            msg: "",
            data: {
                products: foodlist,
                total: foodlist.length
            },
        });
    }
    else {
        let first = (req.body.currentpage - 1) * req.body.pagesize
        let last = req.body.currentpage * req.body.pagesize > foodlist.length ? foodlist.length : req.body.currentpage * req.body.pagesize;
        if (foodlist.length < req.body.pagesize && req.body.pagesize == 1) {
            res.status(500).json({
                msg: "",
                data: {
                    products: foodlist,
                    total: foodlist.length
                },
            });
        }
        else {
            res.status(500).json({
                msg: "",
                data: {
                    products: foodlist.slice(first, last),
                    total: foodlist.length
                },
            });
        }
    }

});
app.get('/products/:id', checkToken, async function (req, res) {
    await db.get().collection(collection.FOODLIST).
        findOne({ "id": req.params.id }).then((result, err) => {
            if (err || result == null) {
                res.status(500).json({
                    msg: "Unable to retrive product details. Please try again later.",
                    data: {
                        products: result,
                    }
                })
            }
            else {
                res.status(500).json({
                    msg: "",
                    data: {
                        products: result,
                    }
                });
            }

        }
        )

});
app.listen(port, "0.0.0.0", () =>
    console.log(`welcome your listernig at port ${port}`)
);// 0.0.0.0 for access through local host
