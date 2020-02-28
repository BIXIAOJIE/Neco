/**
 * API:/api/customers
 * methods:
 *       - CRUD
 *  
 */
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    // 1.校验1：校验数据
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // 2.新建 document
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    // 存储 document 到 table
    customer = await customer.save();
    // 发送 document
    res.send(customer);
});

// customer更新数据
router.put('/:id', async (req, res) => {
    // 1.校验
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // 2.修改数据
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }, { new: true });
    // 3.判断是否存在
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    // 4.返回修改的customer
    res.send(customer);
});


router.delete('/:id', [auth,admin],async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

module.exports = router; 