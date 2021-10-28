const express = require('express');
const router = express.Router();
const app = require('../../app');

router.get('/', async function(req, res){
    if (req.session.username == undefined) {
        res.redirect('/');
    } else if (req.session.username != undefined && req.session.type == "admin") {
        res.locals.title = 'Home';
        res.locals.subtitle = 'Home';
        req.session.company_name = "MetalLinks";

        total_expense = await getTotalExpenses()
        total_recoveries = await getTotalRecoveries()
        balance_amount = await getTotalBalance()
        total_weight_in = await getTotalWeightsIn()
        total_weight_out = await getTotalWeightsOut()
        balance_weight = total_weight_out - total_weight_in

        total_weight_in = (Math.round(total_weight_in * 100) / 100).toFixed(2);
        total_weight_out = (Math.round(total_weight_out * 100) / 100).toFixed(2);
        balance_weight = (Math.round(balance_weight * 100) / 100).toFixed(2);

        total_weight_in_tons = convert_to_words(total_weight_in)
        total_weight_out_tons = convert_to_words(total_weight_out)
        balance_weight_tons = convert_to_words(balance_weight)

        // total_expense = total_expense.toLocaleString('en-US')
        // total_recoveries = total_recoveries.toLocaleString('en-US')
        // balance_amount = balance_amount.toLocaleString('en-US')
        // total_weight_in = total_weight_in.toLocaleString('en-US')
        // total_weight_out = total_weight_out.toLocaleString('en-US')
        // balance_weight = balance_weight.toLocaleString('en-US')

        total_cheques = await getTotalCheques()
        paid_cheques = await getPaidCheques()
        pending_cheques = await getPendingCheques()

        let dataset = {
            total_expense,
            total_recoveries,
            balance_amount,
            total_weight_in, 
            total_weight_out, 
            balance_weight, 
            total_cheques, 
            paid_cheques, 
            pending_cheques,
            total_weight_in_tons,
            total_weight_out_tons,
            balance_weight_tons
        }

        res.render('admin/home', dataset);
    }
});

function convert_to_words(num){
    temp = num
    let tons, mons, kgs
    
    temp = num/1000
    tons = parseInt(temp)
    num = num%1000
        
    temp = num/37.324
    mons = parseInt(temp)
    num = num%37.324
    
    kgs = (Math.round(num * 100) / 100).toFixed(2);
   
    return {tons,mons,kgs}
}

function getTotalExpenses(){
    return new Promise(function(resolve,reject){
        query = "select * from ledger where l_debit=0 and l_credit!=0"
        app.conn.query(query, function(err,result){
            if(err) console.log(err.message)
            else if(result.length==0) resolve(0)
            else if(result.length>0) {
                let total_expense = 0
                for(let i=0; i<result.length; i++){
                    if(i==0) total_expense = result[i].l_credit
                    else {
                        if(result[i].l_credit != result[i-1].l_credit){
                            total_expense = parseFloat(total_expense)+parseFloat(result[i].l_credit)
                        }
                    }
                }
                resolve(total_expense)
            }
        })
    })
}

function getTotalRecoveries(){
    return new Promise(function(resolve,reject){
        query = "select * from ledger where l_debit!=0 and l_credit=0"
        app.conn.query(query, function(err,result){
            if(err) console.log(err.message)
            else if(result.length==0) resolve(0)
            else if(result.length>0) {
                let total_recoveries = 0
                for(let i=0; i<result.length; i++){
                    if(i==0) total_recoveries = result[i].l_debit
                    else {
                        if(result[i].l_debit != result[i-1].l_debit){
                            total_recoveries = parseFloat(total_recoveries)+parseFloat(result[i].l_debit)
                        }
                    }
                }
                resolve(total_recoveries)
            }
        })
    })
}

function getTotalBalance(){
    return new Promise(function(resolve,reject){
        query = "select l_balance as balance from ledger order by l_id desc limit 1"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length>0) {resolve(result[0].balance)}
            else if(result.length==0) {resolve("0")}
        })
    })
}

function getTotalWeightsIn(){
    // return new Promise(function(resolve,reject){
    //     query = "select ifnull(sum(l_seller_weight),0) as total_weight_in from ledger where l_debit=0 and l_credit!=0"
    //     app.conn.query(query, function(err,result){
    //         if(err) {console.log(err.message)}
    //         else if(result.length==0) {resolve("0")}
    //         else if(result.length>0) {resolve(result[0].total_weight_in)}
    //     })
    // })

    return new Promise(function(resolve,reject){
        query = "select l_unit,l_seller_weight from ledger where l_debit=0 and l_credit!=0"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length==0) {resolve("0")}
            else if(result.length>0) {
                let total_weight_in=0;
                for(let i=0; i<result.length; i++){
                    if(result[i].l_unit=="MONS") {
                        result[i].l_seller_weight = parseFloat(result[i].l_seller_weight) * 37.324
                    }
                    if(result[i].l_unit=="TONS") {
                        result[i].l_seller_weight = parseFloat(result[i].l_seller_weight) * 1000
                    }
                    total_weight_in = parseFloat(total_weight_in) + parseFloat(result[i].l_seller_weight)
                }
                resolve(total_weight_in)
            }
        })
    })
}

function getTotalWeightsOut(){
    // return new Promise(function(resolve,reject){
    //     query = "select ifnull(sum(l_seller_weight),0) as total_weight_out from ledger where l_debit!=0 and l_credit=0"
    //     app.conn.query(query, function(err,result){
    //         if(err) {console.log(err.message)}
    //         else if(result.length==0) {resolve("0")}
    //         else if(result.length>0) {resolve(result[0].total_weight_out)}
    //     })
    // })
    
    return new Promise(function(resolve,reject){
        query = "select l_unit,l_seller_weight from ledger where l_debit!=0 and l_credit=0"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length==0) {resolve("0")}
            else if(result.length>0) {
                let total_weight_out=0;
                for(let i=0; i<result.length; i++){
                    if(result[i].l_unit=="MONS") {
                        result[i].l_seller_weight = parseFloat(result[i].l_seller_weight) * 37.324
                    }
                    if(result[i].l_unit=="TONS") {
                        result[i].l_seller_weight = parseFloat(result[i].l_seller_weight) * 1000
                    }
                    total_weight_out = parseFloat(total_weight_out) + parseFloat(result[i].l_seller_weight)
                }
                resolve(total_weight_out)
            }
        })
    })
}

function getTotalCheques(){
    return new Promise(function(resolve,reject){
        query = "select ifnull(count(note_entry_id),0) as cheques from note_entries"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length>0) {resolve(result[0].cheques)}
            else if(result.length==0) {resolve("0")}
        })
    })
}

function getPaidCheques(){
    return new Promise(function(resolve,reject){
        query = "select ifnull(count(note_entry_id),0) as cheques from note_entries where note_status='Paid'"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length>0) {resolve(result[0].cheques)}
            else if(result.length==0) {resolve("0")}
        })
    })
}

function getPendingCheques(){
    return new Promise(function(resolve,reject){
        query = "select ifnull(count(note_entry_id),0) as cheques from note_entries where note_status='Pending'"
        app.conn.query(query, function(err,result){
            if(err) {console.log(err.message)}
            else if(result.length>0) {resolve(result[0].cheques)}
            else if(result.length==0) {resolve("0")}
        })
    })
}

module.exports = router;