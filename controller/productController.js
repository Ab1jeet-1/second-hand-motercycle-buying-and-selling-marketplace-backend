const catchAsync = require('../utils/catchAsync');
const database = require('./../model/index');
const product = database.products;
const addToCart = database.addToCarts;
const favourite = database.favourites;

const statusFunc = (res, status, message) => {
    res.json({
        status,
        message
    })
}

exports.create_product = catchAsync(async (req, res) => {
    const created_product = await product.create({
        name: req.body.name,
        brand: req.body.brand,
        years: req.body.years,
        description: req.body.description,
        price: req.body.price,
        modal: req.body.modal,
        images: "img-001.png",
        shortDescription: req.body.shortDescription,
        userId: res.locals.userData.id
    })

    statusFunc(res, 201, created_product);
})


exports.show_products = async (req, res) => {
    const showed_products = await database.products.findAll({
        attributes: {
            exclude: ["name"]
        }
    });
    statusFunc(res, 200, showed_products);
}

exports.delete_products = catchAsync(async (req, res) => {
    const deleteProduct = await product.findOne({
        where: {
            id: req.params.id
        }
    });
    deleteProduct.destroy();
    statusFunc(res, 200, "item delete successfully");
})

exports.showone = catchAsync(async (req, res) => {
    console.log(req.params.id)
    const showone = await product.findOne({
        where: {
            id: req.params.id
        }
    });
    console.log(showone)
    statusFunc(res, 200, showone);
})

// update product
exports.update_products = catchAsync(async (req, res) => {
    const {
        name,
        brand,
        years,
        description,
        price,
        modal
    } = req.body;
    const update_product = await product.findOne({
        where: {
            id: req.params.id
        }
    });
    update_product.name = name;
    update_product.brand = brand;
    update_product.years = years;
    update_products.description = description;
    update_products.price = price;
    update_products.modal = modal;
    update_product.save();
    statusFunc(res, 200, update_product);
})


// add to cart
exports.addToCart = catchAsync(async (req, res) => {
    console.log("user" + res.locals.userData.id, " product " + req.params.productId);

    const checkCart = await addToCart.findOne({
        where: {
            userId: res.locals.userData.id,
            productId: req.params.productId * 1
        }
    })

    if (checkCart) {
        return statusFunc(res, 403, "already added in cart");
    }

    const add_to_cart = await addToCart.create({
        userId: res.locals.userData.id,
        productId: req.params.productId * 1
    })

    statusFunc(res, 201, add_to_cart)
})

exports.AddToFavourites = catchAsync(async (req, res) => {
    const checkFavourite = await favourite.findOne({
        where: {
            userId: res.locals.userData.id,
            productId: req.params.id
        }
    })

    if(checkFavourite){
        return statusFunc(res, 403, "already added in favourite");
    }

    const add_favourite = await favourite.create({
        userId: res.locals.userData.id,
        productId: req.params.id
    })
    statusFunc(res, 201, add_favourite)
})