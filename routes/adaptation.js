/**
 * Created by root on 10/05/14.
 */

'use strict';

module.exports = function(app) {

    var userDAO = require('../api/dao/userDAO');

    app.post('/test', function(req, res) {
        console.log('ca marche !!!')
        res.send(200, req.body);
    });


};