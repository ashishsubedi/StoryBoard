const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send("WORKING");
});

router.get('/dashboard',(req,res)=>{
    res.send("DASHBOARD");
});

module.exports = router;