document.getElementById("date_current").valueAsDate = new Date();
idCounter = 0;
idList = [idCounter];
let data = [];
let note_party_id,
  note_party_name,
  note_contact,
  note_current_date,
  note_details;

function submitForm() {
  if (getGatePass()) {
    document.getElementById("btn2").disabled = true;
    fetch("/notes/add-note", {
      method: "POST",
      body: JSON.stringify({
        note_party_id: note_party_id,
        note_party_name: note_party_name,
        note_contact: note_contact,
        note_current_date: note_current_date,
        note_details: note_details,
        note_entries: data,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.status == "ok") {
          toastr.success("Note Added " + data.note_id);
          window.location.replace("/notes/add-new-note");
        } else if (data.status == "error") {
          toastr.error("Error: " + data.errorMessage);
          document.getElementById("btn2").disabled = false;
        }
      });
  }
}

function getGatePass() {
  note_party_id = document.getElementById("party_id").value;
  note_party_name = document.getElementById("party_name").value;
  note_contact = document.getElementById("contact").value;
  note_current_date = document.getElementById("date_current").value;
  note_details = document.getElementById("details").value;

  if (note_party_id == "") {
    document.getElementById("party_name_error").innerHTML = "Enter Party Name";
    return false;
  } else if (note_details == "") {
    document.getElementById("party_name_error").innerHTML = "";
    document.getElementById("details_error").innerHTML = "Enter Details";
    return false;
  } else {
    document.getElementById("party_name_error").innerHTML = "";
    document.getElementById("details_error").innerHTML = "";
    let note_check_no, note_bank_name, note_clear_date, note_status;
    for (let i = 0; i <= idList.length; i++) {
      if (i == idList.length) {
        console.log("breaking");
        break;
      }

      note_check_no = document.getElementById("note_check_no" + i).value;
      note_check_amount = document.getElementById(
        "note_check_amount" + i
      ).value;
      note_bank_name = document.getElementById("note_bank_name" + i).value;
      note_clear_date = document.getElementById("note_clear_date" + i).value;
      note_status = document.getElementById("note_status" + i).value;

      let row = {};
      row.note_check_no = note_check_no;
      row.note_check_amount = note_check_amount;
      row.note_bank_name = note_bank_name;
      row.note_clear_date = note_clear_date;
      row.note_status = note_status;

      data[i] = row;
    }
    return true;
  }
}

function add_gp_row() {
  ++idCounter;
  idList.push(idCounter);
  addNoteRow();
}

function remove_last_gp_row() {
  if (idCounter > 0) {
    removeFromIdList(idCounter);
    document
      .getElementById("tab2")
      .removeChild(document.getElementById("gp_row" + idCounter));
    document
      .getElementById("tab2")
      .removeChild(document.getElementById("row_hr" + idCounter));
    idCounter--;
  }
}

function removeFromIdList() {
  const index = idList.indexOf(idCounter);
  if (index > -1) {
    idList.splice(index, 1);
  }
}

function addNoteRow() {
  //making gp_row start
  var gp_row = document.createElement("div");
  gp_row.setAttribute("id", "gp_row" + idCounter);
  gp_row.setAttribute("class", "row form-group");
  //making gp_row end

  //making col Cheque No. start
  var col_md_2 = document.createElement("div");
  col_md_2.setAttribute("class", "col-md-2");

  var form_group = document.createElement("div");
  form_group.setAttribute("class", "form-group input-group-md");

  var label = document.createElement("label");
  label.innerHTML = "Cheque No.";

  var inputChequeNumber = document.createElement("input");
  inputChequeNumber.setAttribute("id", "note_check_no" + idCounter);
  inputChequeNumber.setAttribute("type", "text");
  inputChequeNumber.setAttribute("class", "form-control");
  inputChequeNumber.setAttribute("placeholder", "Cheque Number");

  form_group.appendChild(label);
  form_group.appendChild(inputChequeNumber);
  col_md_2.appendChild(form_group);
  gp_row.appendChild(col_md_2);
  //making col Cheque No. end

  //making col Cheque Amount start
  var col_md_2 = document.createElement("div");
  col_md_2.setAttribute("class", "col-md-2");

  var form_group = document.createElement("div");
  form_group.setAttribute("class", "form-group input-group-md");

  var label = document.createElement("label");
  label.innerHTML = "Amount";

  var inputChequeAmount = document.createElement("input");
  inputChequeAmount.setAttribute("id", "note_check_amount" + idCounter);
  inputChequeAmount.setAttribute("type", "number");
  inputChequeAmount.setAttribute("class", "form-control");
  inputChequeAmount.setAttribute("placeholder", "Amount");

  form_group.appendChild(label);
  form_group.appendChild(inputChequeAmount);
  col_md_2.appendChild(form_group);
  gp_row.appendChild(col_md_2);
  //making col Cheque Amount end

  //making col Bank Name start
  var col_md_2 = document.createElement("div");
  col_md_2.setAttribute("class", "col-md-3");

  var form_group = document.createElement("div");
  form_group.setAttribute("class", "form-group input-group-md");

  var label = document.createElement("label");
  label.innerHTML = "Bank Name";

  var inputBankName = document.createElement("input");
  inputBankName.setAttribute("id", "note_bank_name" + idCounter);
  inputBankName.setAttribute("type", "text");
  inputBankName.setAttribute("class", "form-control");
  inputBankName.setAttribute("placeholder", "Bank Name");

  form_group.appendChild(label);
  form_group.appendChild(inputBankName);
  col_md_2.appendChild(form_group);
  gp_row.appendChild(col_md_2);
  //making col Bank Name end

  //making col Cheque Clear Date start
  var col_md_2 = document.createElement("div");
  col_md_2.setAttribute("class", "col-md-3");

  var form_group = document.createElement("div");
  form_group.setAttribute("class", "form-group input-group-md");

  var label = document.createElement("label");
  label.innerHTML = "Cheque Clear Date";

  var inputChequeClearDate = document.createElement("input");
  inputChequeClearDate.setAttribute("id", "note_clear_date" + idCounter);
  inputChequeClearDate.setAttribute("type", "date");
  inputChequeClearDate.setAttribute("class", "form-control");
  inputChequeClearDate.setAttribute("placeholder", "Cheque Clear Date");

  form_group.appendChild(label);
  form_group.appendChild(inputChequeClearDate);
  col_md_2.appendChild(form_group);
  gp_row.appendChild(col_md_2);
  //making col Bank Name end

  //making col Status start
  var col_md_2 = document.createElement("div");
  col_md_2.setAttribute("class", "col-md-2");
  var form_group = document.createElement("div");
  form_group.setAttribute("class", "form-group input-group-md");
  var label = document.createElement("label");
  label.innerHTML = "Status";

  var status_select = document.createElement("select");
  status_select.setAttribute("class", "form-control");
  status_select.setAttribute("id", "note_status" + idCounter);

  var option1 = document.createElement("option");
  option1.setAttribute("value", "Pending");
  option1.innerText = "Pending";
  status_select.appendChild(option1);

  var option2 = document.createElement("option");
  option2.setAttribute("value", "Paid");
  option2.innerText = "Paid";
  status_select.appendChild(option2);

  form_group.appendChild(label);
  form_group.appendChild(status_select);
  col_md_2.appendChild(form_group);
  gp_row.appendChild(col_md_2);
  //making col Status end

  var row_hr = document.createElement("div");
  row_hr.setAttribute("class", "row");
  row_hr.setAttribute("id", "row_hr" + idCounter);
  var col_hr = document.createElement("div");
  col_hr.setAttribute("class", "col-md-12");
  var hr = document.createElement("hr");
  col_hr.appendChild(hr);
  row_hr.appendChild(col_hr);

  //adding gp_row
  var idInput = document.createElement("input");
  idInput.setAttribute("value", idCounter);
  idInput.setAttribute("type", "hidden");
  idInput.setAttribute("id", "idInput" + idCounter);
  gp_row.appendChild(idInput);

  document.getElementById("tab2").appendChild(gp_row);
  document.getElementById("tab2").appendChild(row_hr);
}

//party select start
var $selectParty = $("#party_name");
var partyNameArray = [];
var partyIdArray = [];
getParty();
autocomplete(document.getElementById("party_name"), partyNameArray);
function getParty() {
  var name = "";
  fetch("/gate_pass/getParty", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status == "yes") {
        partyNameArray.length = 0;
        partyIdArray.length = 0;
        for (var i = 0; i < data.party.length; i++) {
          partyNameArray.push(data.party[i].party_name);
          partyIdArray.push(data.party[i].party_id);
        }
        //addSelectItems(partyNameArray, partyIdArray, $selectParty);
      }
    });
}

function getContact(party_id) {
  //party_id = document.getElementById("gate_pass_party_id").value
  fetch("/gate_pass/get-contact", {
    method: "POST",
    body: JSON.stringify({ party_id }),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.status == "ok") {
        document.getElementById("contact").value = data.contact;
      } else if (data.status == "error") {
        toastr.error("Error: " + data.errorMessage);
      }
    });
}

//autocomplete start
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          index = partyNameArray.indexOf(inp.value);
          document.getElementById("party_id").value = partyIdArray[index];
          getContact(partyIdArray[index]);
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
//autocomplete end
