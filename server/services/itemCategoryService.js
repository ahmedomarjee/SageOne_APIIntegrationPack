var config = require('../config/config'),
    mongoose = require('mongoose'),
    itemCategoryModel = mongoose.model('ItemCategory'),
    _ = require('lodash'),
    restClient = require('node-rest-client').Client,
    restClient = new restClient(),
    Q = require('q');

module.exports = {
    model: itemCategoryModel,
    sync: function() { //TODO: Implement Sage One API Paging
        var deferred = Q.defer();
        restClient.get(config.sageone_apiPath, {
            path: {
                "model": "itemCategory",
                "method": "get",
                "apikey": config.sageone_apiKey,
                "companyid": config.sageone_companyId,
                "filter": ""
            },
            headers: {
                "Authorization": config.sageone_authorization,
                "Content-Type": "Application/Json"
            }

        }, function(data, response) {
            data = JSON.parse(data);
            deferred.resolve(data);
            for (var i = 0; i < data.ReturnedResults; i++) {
                itemCategoryModel.findOneAndUpdate({
                    'sageone_id': data.Results[i].ID
                }, {
                    description: data.Results[i].Description,

                    sageone_id: data.Results[i].ID,
                    modified: data.Results[i].Modified,
                    created: data.Results[i].Created
                }, {
                    upsert: true
                }, function(err, data) {});
            }
        });
        return deferred.promise;
    }
};
