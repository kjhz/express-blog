var express = require('express');
var router = express.Router();

var User = require('../controllers/userController'); 
/* GET users listing. */
router.get('/',function(req,res){
  res.send("user");
} );

module.exports = router;
