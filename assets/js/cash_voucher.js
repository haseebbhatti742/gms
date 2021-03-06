document.getElementById('cash_voucher_date').valueAsDate = new Date();

var $selectParty = $('#cash_voucher_party_id');
var partyNameArray = [];
var partyIdArray = [];
getParty();
autocomplete(document.getElementById("cash_voucher_party_id"), partyNameArray);
function getParty() {
    var name = "";
    fetch("/gate_pass/getParty", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }).then(data => data.json()).then(data => {
        if (data.status == "yes") {
            partyNameArray.length = 0;
            partyIdArray.length = 0;
            for (var i = 0; i < data.party.length; i++) {
                partyNameArray.push(data.party[i].party_name);
                partyIdArray.push(data.party[i].party_id);
            }
            //addSelectItems(partyNameArray, partyIdArray, $selectParty);
        }
    })
}

function getContact(party_id){
  //party_id = document.getElementById("gate_pass_party_id").value
  fetch("/gate_pass/get-contact", {
      method: "POST",
      body: JSON.stringify({ party_id }),
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
  }).then(data => data.json()).then(data => {
      if (data.status == "ok") {
          document.getElementById("cash_voucher_contact").value = data.contact
      } else if(data.status == "error"){
          toastr.error("Error: "+data.errorMessage)
      }
  })
}

function addCashVoucher(){
    document.getElementById("btn2").disabled = true
    cash_voucher_number_manual = document.getElementById("cash_voucher_number_manual").value
    party_id = document.getElementById("cv_party_id").value
    cv_date = document.getElementById("cash_voucher_date").value
    cv_type = document.getElementById("cash_voucher_type").value
    cv_payment_type = "Debit"
    cv_name = document.getElementById("cash_voucher_party_id").value
    cv_contact = document.getElementById("cash_voucher_contact").value
    cv_signature = document.getElementById("cash_voucher_signature").value
    cv_amount = document.getElementById("cash_voucher_amount").value
    cv_details = document.getElementById("cash_voucher_details").value
    cv_commodity = document.getElementById("cv_commodity").value
    cv_currency = document.getElementById("cash_voucher_currency").value

    fetch("/cash_voucher/add", {
        method: "POST",
        body: JSON.stringify({ cash_voucher_number_manual,party_id, cv_date, cv_type, cv_commodity, cv_contact, cv_payment_type, cv_name, cv_signature, cv_amount, cv_details, cv_currency }),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    }).then(data => data.json()).then(data => {
        if (data.status == "ok") {
            toastr.success("Cash Voucher Added")
            window.location.replace("/cash_voucher/view-cash-voucher/"+data.cv_number)
        } else if (data.status == "error") {
            toastr.error("Error: "+data.errorMessage)
            document.getElementById("btn2").disabled = false
        }
    })
}

$(document).on('submit', 'form', function(e){
    e.preventDefault();
    addCashVoucher()
    return;
});

//autocomplete start
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
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
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                index = partyNameArray.indexOf(inp.value)
                document.getElementById("cv_party_id").value = partyIdArray[index];
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
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
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
      if (currentFocus < 0) currentFocus = (x.length - 1);
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