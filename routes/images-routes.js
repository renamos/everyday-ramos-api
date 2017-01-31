var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var imageModel = require('../models/image-models')


// Add headers
router.use(function (req, res, next) {
    console.log("hoola");
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


router.route('/create')
    .post(function (req, res) {

        if (req.body.password != 'password1') {
            res.status(401).send({
                message: 'Password is incorrect.'
            })
            return
        }


        cloudinary.v2.uploader.upload(req.body.image, {width: 0.5, height: 0.5, crop: "limit"}, function (error, result) {

            var img = new imageModel()

            img.title = req.body.title;
            img.height = result.height;
            img.width = result.width;
            img.caption = req.body.caption;
            img.cloudinaryID = result.public_id;
            img.imageURL = result.secure_url;
            img.description = req.body.description;
            img.camera_settings = req.body.camera_settings;
            img.created_at = new Date()

            img.save(function (err) {
                if (err) {
                    console.log(err)
                    return
                }

                res.json({
                    message: 'new image saved!'
                })

            })

        });

    });


router.route('/delete/:id')
    .delete(function (req, res) {
        cloudinary.v2.uploader.destroy(req.params.id, function (error, result) {
            if (error) {
                res.json({
                    message: 'something went wrong in cloudinary'
                })
                return
            }

            imageModel.remove({cloudinaryID: req.params.id}, function (err) {
                if (err) {
                    res.json({
                        message: "something went wrong in mongoose" + err
                    })
                    return
                }
                res.json({
                    message: "successfully deleted from db!"
                })
            });


        })
    });

router.route('/last-image')
    .get(function (req, res) {
        imageModel.find().sort({"created_at": -1}).limit(7).exec(function (err, image) {
            if (err) {
                res.json({
                    message: 'something went wrong'
                })
                return
            }
            res.json({
                image: image
            })
        })

    })

router.route('/recent')
    .get(function (req, res) {
        imageModel.find().sort({"created_at": -1}).limit(9).exec(function (err, image) {
            if (err) {
                res.json({
                    message: 'something went wrong'
                })
                return
            }
            res.json({
                image: image
            })
        })

    })


module.exports = router