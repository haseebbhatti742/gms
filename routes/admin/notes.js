const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const app = require("../../app");

router.get("/add-new-note", (req, res, next) => {
  if (req.session.username == undefined) {
      res.redirect('/');
  } else if (req.session.username != undefined && req.session.type == "admin") {
    res.locals.title = "Notes";
    res.locals.subtitle = "Add Notes";
    res.render("admin/notes");
  }
});

router.post("/add-note", function (req, res) {
  try {
    let {
      note_party_id,
      note_party_name,
      note_contact,
      note_current_date,
      note_details,
      note_entries,
    } = req.body;
    let note_id;

    query1 = `insert into notes(note_party_id, note_party_name, note_contact,	note_current_date, note_details) values(${note_party_id}, '${note_party_name}', '${note_contact}',	'${note_current_date}',   '${note_details}')`;
    app.conn.query(query1, (err, result1) => {
      if (err) throw err;
      else {
        note_id = result1.insertId;
        for (let i = 0; i < note_entries.length; i++) {
          query2 = `insert into note_entries(note_id, note_cheque_number, note_cheque_amount, note_bank_name, note_clear_date	,note_status) values(${note_id}, '${note_entries[i].note_check_no}', '${note_entries[i].note_check_amount}', '${note_entries[i].note_bank_name}', '${note_entries[i].note_clear_date}', '${note_entries[i].note_status}')`;

          app.conn.query(query2, (err, result2) => {
            if (err) throw err;
          });
        }

        res.status(200).json({ status: "ok", note_id: note_id });
      }
    });
  } catch (err) {
    res.status(200).json({ status: "error", errorMessage: err.message });
  }
});

router.get("/view_all", function (req, res) {
  res.locals.title = "Notes";
  res.locals.subtitle = "All Notes";
  const query1 = "select * from notes join note_entries on notes.note_id=note_entries.note_id order by note_entry_id desc";
  app.conn.query(query1, function (err, result1) {
    if(err) {res.render("admin/notes_view_all", {status: "error", errorMessage:err.message})}
    else if(result1.length==0) {res.render("admin/notes_view_all", {status: "error", errorMessage:"No Record Found"})}
    else {
      for(let i=0; i<result1.length; i++){
        note_current_date = new Date(result1[i].note_current_date)
        note_current_date = note_current_date.getDate()+"-"+(note_current_date.getMonth()+1)+"-"+note_current_date.getFullYear()
        result1[i].note_current_date = note_current_date

        note_clear_date = new Date(result1[i].note_clear_date)
        note_clear_date = note_clear_date.getDate()+"-"+(note_clear_date.getMonth()+1)+"-"+note_clear_date.getFullYear()
        result1[i].note_clear_date = note_clear_date
      }
      res.render("admin/notes_view_all", {status: "ok", length:result1.length, dataset:result1})
    }
  });
});

router.get("/view_pending", function (req, res) {
  res.locals.title = "Notes";
  res.locals.subtitle = "Pending Notes";
  const query1 = "select * from notes join note_entries on notes.note_id=note_entries.note_id where note_entries.note_status='Pending'  order by note_entry_id desc";
  app.conn.query(query1, function (err, result1) {
    if(err) {res.render("admin/notes_view_pending", {status: "error", errorMessage:err.message})}
    else if(result1.length==0) {res.render("admin/notes_view_pending", {status: "error", errorMessage:"No Record Found"})}
    else {
      for(let i=0; i<result1.length; i++){
        note_current_date = new Date(result1[i].note_current_date)
        note_current_date = note_current_date.getDate()+"-"+(note_current_date.getMonth()+1)+"-"+note_current_date.getFullYear()
        result1[i].note_current_date = note_current_date

        note_clear_date = new Date(result1[i].note_clear_date)
        note_clear_date = note_clear_date.getDate()+"-"+(note_clear_date.getMonth()+1)+"-"+note_clear_date.getFullYear()
        result1[i].note_clear_date = note_clear_date
      }
      res.render("admin/notes_view_pending", {status: "ok", length:result1.length, dataset:result1})
    }
  });
});

router.get("/clear/:note_entry_id", (req,res)=>{
  note_entry_id = req.params.note_entry_id
  query = `update note_entries set note_status='Paid' where note_entry_id='${note_entry_id}'`
  
  app.conn.query(query, (err,result)=>{
    if(err) console.log(err)
    else res.redirect("/notes/view_pending")
  })
})

router.get("/show-notes/:party_id", function (req, res) {
  party_id = req.params.party_id
  const query1 = `select * from notes join note_entries on notes.note_id=note_entries.note_id where notes.note_party_id='${party_id}' order by note_entry_id desc`;
  app.conn.query(query1, function (err, result1) {
    if(err) {res.render("admin/show_notes", {status: "error", errorMessage:err.message})}
    else if(result1.length==0) {res.render("admin/show_notes", {status: "error", errorMessage:"No Record Found"})}
    else {
      for(let i=0; i<result1.length; i++){
        note_current_date = new Date(result1[i].note_current_date)
        note_current_date = note_current_date.getDate()+"-"+(note_current_date.getMonth()+1)+"-"+note_current_date.getFullYear()
        result1[i].note_current_date = note_current_date

        note_clear_date = new Date(result1[i].note_clear_date)
        note_clear_date = note_clear_date.getDate()+"-"+(note_clear_date.getMonth()+1)+"-"+note_clear_date.getFullYear()
        result1[i].note_clear_date = note_clear_date
      }
      res.render("admin/show_notes", {status: "ok", length:result1.length, dataset:result1})
    }
  });
});

module.exports = router;
