const express = require('express');
const router = express.Router();
const app = require('../../app');

router.get('/', (req, res, next) => {
    // if (req.session.username == undefined) {
    //     res.redirect('/');
    // } else if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Notes';
        res.locals.subtitle = 'Add Notes';
        res.render("admin/notes")
    // }
});

module.exports = router;