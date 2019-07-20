/**
 * Fetch all countries
 */
exports.countries = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-07/countries.json', function(err, countrytData, headers) {
        res.json(countrytData);
    });
}

/**
 * Fetch all provinces
 */
exports.provinces = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-07/countries/'+req.params.countryId+'/provinces.json', function(err, provincesData, headers) {
        res.json(provincesData);
    });
}

/**
 * Fetch all policies
 */
exports.policies = (req, res, next) => {
    req.shopifyToken.get('/admin/api/2019-07/policies.json', function(err, policiesData, headers) {
        res.json(policiesData);
    });
}


