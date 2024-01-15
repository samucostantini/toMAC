function inserisciSpesa() {
    var amount = document.getElementById('amount').value;
    var category = document.getElementById('category').value;
    var date_p = document.getElementById('date_p').value;
    var comment_p = document.getElementById('comment_p').value;
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var latitudine = position.coords.latitude;
            var longitudine = position.coords.longitude;
            
            alert("Latitude: " + latitudine + "\nLongitude: " + longitudine);

            // Chiamata a funzione in db.js per inserire la spesa nel database
            inserisciSpesaDB(amount, category, date_p, comment_p, latitudine, longitudine);
        },
        function (error) {
            console.error('Errore nella geolocalizzazione:', error.message);

            // Se c'è un errore nella geolocalizzazione, puoi comunque inserire la spesa senza latitudine e longitudine
            inserisciSpesaDB(amount, category, date_p, comment_p, 0, 0);
        }
    );
    
}


function visualizzaSpese() {
    // Chiamata a funzione in db.js per visualizzare le spese dal database
    visualizzaSpeseDB();
}

function visualizzaSpese2() {
    // Assicurati che la variabile db sia disponibile e inizializzata
    if (!db) {
        console.error("Database non inizializzato correttamente.");
        return;
    }

    var transaction = db.transaction(["spese"], "readonly");
    var objectStore = transaction.objectStore("spese");
    var expensesList = document.getElementById("expensesList");

    // Cancella il contenuto della lista prima di riempirla di nuovo
    expensesList.innerHTML = "";

    // Apre un cursore per iterare sugli oggetti memorizzati nell'object store
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            // Creare un elemento di lista e aggiungere i dati delle spese ad esso
            var listItem = document.createElement("li");
            var x=cursor.value.id;
            listItem.textContent = "Amount: " + cursor.value.amount + ", Category: " + cursor.value.category+ ", Data: " + cursor.value.date_p + ", Comment: "+ cursor.value.comment_p;
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Elimina";
            deleteButton.addEventListener("click", function() {
                // Chiamare la funzione deleteExpense con l'ID della spesa
                deleteExpense(x);
                // Aggiornare la visualizzazione delle spese dopo l'eliminazione
                visualizzaSpese2();
            });
            listItem.appendChild(deleteButton);
            expensesList.appendChild(listItem);

            // Continua a iterare sul cursore
            cursor.continue();
        }
    };

    transaction.oncomplete = function() {
        console.log("Visualizzazione spese completata.");
    };

    transaction.onerror = function(event) {
        console.error("Errore durante la visualizzazione delle spese:", event.target.error);
    };
}


function latest3payment(n) {
    // Assicurati che la variabile db sia disponibile e inizializzata
    if (!db) {
        console.error("Database non inizializzato correttamente.");
        return;
    }

    var transaction = db.transaction(["spese"], "readonly");
    var objectStore = transaction.objectStore("spese");
    var expensesTable = document.getElementById("ltpayment");

    // Cancella il contenuto della tabella prima di riempirla di nuovo
    expensesTable.innerHTML = "";
    var i = 0;

    // Creazione della riga delle intestazioni della tabella
    var tableHeaderRow = document.createElement("tr");
    tableHeaderRow.innerHTML = "<th>Amount</th><th>Category</th><th>Date</th><th>Comment</th><th>Action</th>";
    expensesTable.appendChild(tableHeaderRow);

    // Apre un cursore per iterare sugli oggetti memorizzati nell'object store
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor && i < n) {
            // Creare una riga di tabella e aggiungere i dati delle spese alle colonne
            var tableRow = document.createElement("tr");
            var x = cursor.value.id;

            // Split delle informazioni di amount
            var amountInfo = cursor.value.amount.split(':');

            // Altre colonne della tabella
            var amountCell = document.createElement("td");
            amountCell.textContent = amountInfo[0];
            tableRow.appendChild(amountCell);

            var categoryCell = document.createElement("td");
            categoryCell.textContent = cursor.value.category;
            tableRow.appendChild(categoryCell);

            var dateCell = document.createElement("td");
            dateCell.textContent = cursor.value.date_p;
            tableRow.appendChild(dateCell);

            var commentCell = document.createElement("td");
            commentCell.textContent = cursor.value.comment_p;
            tableRow.appendChild(commentCell);

            var actionCell = document.createElement("td");
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Elimina";
            deleteButton.addEventListener("click", function () {
                // Chiamare la funzione deleteExpense con l'ID della spesa
                deleteExpense(x);
                // Aggiornare la visualizzazione delle spese dopo l'eliminazione
                latest3payment();
            });
            actionCell.appendChild(deleteButton);
            tableRow.appendChild(actionCell);

            expensesTable.appendChild(tableRow);

            // Continua a iterare sul cursore
            if(n!=1){
            i++;
            }
            cursor.continue();
        }
    };
}

function paymentOrderByAmount(n) {
    // Assicurati che la variabile db sia disponibile e inizializzata
    if (!db) {
        console.error("Database non inizializzato correttamente.");
        return;
    }

    var transaction = db.transaction(["spese"], "readonly");
    var objectStore = transaction.objectStore("spese");
    var expensesTable = document.getElementById("ltpayment");

    // Cancella il contenuto della tabella prima di riempirla di nuovo
    expensesTable.innerHTML = "";
    var i = 0;

    // Creazione della riga delle intestazioni della tabella
    var tableHeaderRow = document.createElement("tr");
    tableHeaderRow.innerHTML = "<th>Amount</th><th>Category</th><th>Date</th><th>Comment</th><th>Action</th>";
    expensesTable.appendChild(tableHeaderRow);

    // Creare un array per memorizzare le spese
    var expensesArray = [];

    // Apre un cursore per iterare sugli oggetti memorizzati nell'object store
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            expensesArray.push(cursor.value);
            cursor.continue();
        } else {
            // Ordina l'array in base all'importo crescente
            expensesArray.sort(function(a, b) {
                return parseFloat(a.amount) - parseFloat(b.amount);
            });

            // Itera sull'array ordinato
            for (var j = 0; j < Math.min(n, expensesArray.length); j++) {
                var expense = expensesArray[j];

                // Creare una riga di tabella e aggiungere i dati delle spese alle colonne
                var tableRow = document.createElement("tr");

                // Altre colonne della tabella
                var amountCell = document.createElement("td");
                amountCell.textContent = expense.amount;
                tableRow.appendChild(amountCell);

                var categoryCell = document.createElement("td");
                categoryCell.textContent = expense.category;
                tableRow.appendChild(categoryCell);

                var dateCell = document.createElement("td");
                dateCell.textContent = expense.date_p;
                tableRow.appendChild(dateCell);

                var commentCell = document.createElement("td");
                commentCell.textContent = expense.comment_p;
                tableRow.appendChild(commentCell);

                var actionCell = document.createElement("td");
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Elimina";
                deleteButton.addEventListener("click", function () {
                    // Chiamare la funzione deleteExpense con l'ID della spesa
                    deleteExpense(expense.id);
                    // Aggiornare la visualizzazione delle spese dopo l'eliminazione
                    paymentOrderByAmount(n);
                });
                actionCell.appendChild(deleteButton);
                tableRow.appendChild(actionCell);

                expensesTable.appendChild(tableRow);
            }
        }
    };
}

function deleteExpense(expenseId) {
    var request = indexedDB.open("myfDB", 2);

    request.onsuccess = function(event) {
        var db = event.target.result;

        var transaction = db.transaction(["spese"], "readwrite");
        var objectStore = transaction.objectStore("spese");

       

        var deleteRequest = objectStore.delete(expenseId);
        

        deleteRequest.onsuccess = function() {
            console.log("Oggetto eliminato con successo");
        };

        deleteRequest.onerror = function() {
            console.error("Errore durante l'eliminazione dell'oggetto");
        };
    };

    request.onerror = function(event) {
        console.error("Errore durante l'apertura del database");
    };
}






function getPay() {
    return new Promise(function (resolve, reject) {
        var transaction = db.transaction(["spese"], "readonly");
        var objectStore = transaction.objectStore("spese");
        var request = objectStore.openCursor();
        var speseList = [];

        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var spesa = {
                    id: cursor.value.id,
                    amount: cursor.value.amount,
                    category: cursor.value.category,
                    date: cursor.value.date_p,
                    comment: cursor.value.comment_p
                };
                console.log("ID: " + cursor.value.id + ", Amount: " + cursor.value.amount + ", Category: " + cursor.value.category + ", Date: " + cursor.value.date_p + ", Comment:" + cursor.value.comment_p);
                speseList.push(spesa);
                cursor.continue();
            } else {
                console.log("Fine delle spese.");
                resolve(speseList); // Risolvi la Promessa quando la lettura è completa
            }
        };

        request.onerror = function (event) {
            console.error("Errore nella lettura delle spese.");
            reject(event.error);
        };
    });
}

//funzione per visualizzare in tabella una lista passata 
function paymentOrderByAmount2(speseList) {
  
        var expensesTable = document.getElementById("ltpayment");
        expensesTable.innerHTML = "";
        var tableHeaderRow = document.createElement("tr");
    tableHeaderRow.innerHTML = "<th>Amount</th><th>Category</th><th>Date</th><th>Comment</th><th>Action</th>";
    expensesTable.appendChild(tableHeaderRow);

    
    for (var i = 0; i < speseList.length; i++) {
        
        var expense = speseList[i];
        console.log("am:"+expense.amount);
        var tableRow = document.createElement("tr");

        var amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;
        tableRow.appendChild(amountCell);

        var categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;
        tableRow.appendChild(categoryCell);

        var dateCell = document.createElement("td");
        dateCell.textContent = expense.date;
        tableRow.appendChild(dateCell);

        var commentCell = document.createElement("td");
        commentCell.textContent = expense.comment;
        tableRow.appendChild(commentCell);

        var actionCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Elimina";

        // Utilizza una funzione di chiusura per catturare il valore corretto di expense
        deleteButton.addEventListener("click", (function (exp) {
            return function () {
                deleteExpense(exp.id);
                paymentOrderByAmount2();
            };
        })(expense));

        actionCell.appendChild(deleteButton);
        tableRow.appendChild(actionCell);

        expensesTable.appendChild(tableRow);
    }

       
   
}


function paymentOrderByAmountASC(){
    getPay().then(function (speseList) {
        speseList.sort(function (a, b) {
            return parseFloat(a.amount) - parseFloat(b.amount);
        });

        paymentOrderByAmount2(speseList);

    
    }).catch(function (error) {
            console.error("Errore nel recupero delle spese: ", error);
        });
}

function paymentOrderByAmountDESC(){
    getPay().then(function (speseList) {
        speseList.sort(function (a, b) {
            return parseFloat(b.amount) - parseFloat(a.amount);
        });

        paymentOrderByAmount2(speseList);

    
    }).catch(function (error) {
            console.error("Errore nel recupero delle spese: ", error);
        });
}
function paymentOrderByDateASC() {
    getPay().then(function (speseList) {
        speseList.sort(function (a, b) {
            // Confronta le date come stringhe direttamente
            return a.date.localeCompare(b.date);
        });

        paymentOrderByAmount2(speseList);
    }).catch(function (error) {
        console.error("Errore nel recupero delle spese: ", error);
    });
}

function paymentOrderByDateASCL() {
    getPay().then(function (speseList) {
        speseList.sort(function (a, b) {
            // Confronta le date come stringhe direttamente
            return a.date.localeCompare(b.date);
        });

       
    }).catch(function (error) {
        console.error("Errore nel recupero delle spese: ", error);
    });
}


function paymentOrderByDateDESC() {
    getPay().then(function (speseList) {
        speseList.sort(function (a, b) {
            // Confronta le date come stringhe direttamente
            return b.date.localeCompare(a.date);
        });

        paymentOrderByAmount2(speseList);
    }).catch(function (error) {
        console.error("Errore nel recupero delle spese: ", error);
    });
}

