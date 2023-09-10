const express = require('express');

class HomeController{
    async index(req, res) {
        res.send('APP EXPRESS - Guia do Programador');
    }
};

module.exports = new HomeController();