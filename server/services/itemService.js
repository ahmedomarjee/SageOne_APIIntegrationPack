var config = require('../config/config'),
    mongoose = require('mongoose'),
    itemModel = mongoose.model('Item'),
    itemCategoryService = require('./itemCategoryService'),
    itemCategoryModel = itemCategoryService.model,
    _ = require('lodash'),
    restClient = require('node-rest-client').Client,
    restClient = new restClient(),
    Q = require('q');


var sageone_args = {
    path: {
        "apikey": config.sageone_apiKey,
        "companyid": config.sageone_companyId,
        "filter": ""
    },
    headers: {
        "Authorization": config.sageone_authorization,
        "Content-Type": "Application/Json"
    }
};


// To limit the number of services I've included the code here temporarily
var getCustomer = function(email) {
    var deferred = Q.defer();
    restClient.get(config.sageone_apiPath, {
        path: _.defaults({
            "model": "customer",
            "method": "get",
            "filter": "&$filter=Email eq '" + email + "'"
        }, sageone_args.path),
        headers: sageone_args.headers
    }, function(data, response) {
        data = JSON.parse(data);
        deferred.resolve(data.Results[0]);
    });
    return deferred.promise;
}

var createCustomer = function(customer) {
    var deferred = Q.defer();
    restClient.post(config.sageone_apiPath, {
        path: _.defaults({
            "model": "customer",
            "method": "save"
        }, sageone_args.path),
        headers: sageone_args.headers,
        data: {
            Name: customer.name,
            Email: customer.email,
            CommunicationMethod: 0
        }
    }, function(data, response) {
        data = JSON.parse(data);
        deferred.resolve(data);
    });
    return deferred.promise;
}

var createOrder = function(item, customer) {
    var deferred = Q.defer();
    restClient.post(config.sageone_apiPath, {
        path: _.defaults({
            "model": "quote",
            "method": "save"
        }, sageone_args.path),
        headers: sageone_args.headers,
        data: {
            Date: new Date(),
            ExpiryDate: new Date(),
            CustomerId: customer.ID,
            Lines: [{
                SelectionId: item.sageone_id,
                TaxTypeId: item.taxTypeIdSales,
                Description: item.description,
                LineType: 0,
                Quantity: 1,
                UnitPriceExclusive: item.priceExclusive
            }]
        }
    }, function(data, response) {
        data = JSON.parse(data);
        deferred.resolve(data);
    });
    return deferred.promise;
}

var emailOrder = function(order, customer) {
    var deferred = Q.defer();
    restClient.post(config.sageone_apiPath, {
        path: _.defaults({
            "model": "quote",
            "method": "email"
        }, sageone_args.path),
        headers: sageone_args.headers,
        data: {
            ID: order.ID,
            EmailAddress: customer.Email
        }
    }, function(data, response) {        
        deferred.resolve();
    });
    return deferred.promise;
}


module.exports = {
    model: itemModel,
    order: function(item, user) {
        getCustomer(user.email).then(function(customer) {
            if (!customer)
                createCustomer({
                    name: user.firstName + ' ' + user.lastName,
                    email: user.email
                }).then(function(customer) {
                    createOrder(item, customer).then(function(order){emailOrder(order,customer);});
                });
            else
                createOrder(item, customer).then(function(order){emailOrder(order,customer);});
        })
    },
    sync: function() { //TODO: Implement Sage One API Paging
        var deferred = Q.defer();
        restClient.get(config.sageone_apiPath, {
            path: _.defaults({
                "model": "item",
                "method": "get",
            }, sageone_args.path),
            headers: sageone_args.headers
        }, function(data, response) {
            data = JSON.parse(data);
            deferred.resolve(data);

            itemCategoryModel.find({}, function(err, categories) {

                for (var i = 0; i < data.ReturnedResults; i++) {
                    var d = data.Results[i];

                    itemModel.findOneAndUpdate({
                        'sageone_id': d.ID
                    }, {
                        code: d.Code,
                        description: d.Description,
                        quantityOnHand: d.QuantityOnHand,
                        priceExclusive: d.PriceExclusive,
                        priceInclusive: d.PriceInclusive,
                        taxTypeIdSales: d.TaxTypeIdSales,
                        taxTypeIdPurchases: d.TaxTypeIdPurchases,
                        category: _.first(_.where(categories, {
                            sageone_id: d.Category.ID
                        })),

                        sageone_id: d.ID,
                        modified: d.Modified,
                        created: d.Created
                    }, {
                        upsert: true
                    }, function(err, data) {});
                }

            });


        });
        return deferred.promise;
    }
};
