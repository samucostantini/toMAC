function inserisciSpesa() {
    var amount = document.getElementById('amount').value;
    var category = document.getElementById('category').value;
    var date_p = document.getElementById('date_p').value;
    var comment_p = document.getElementById('comment_p').value;


    inserisciSpesaDB(amount, category, date_p, comment_p)
    .then(() => {
        alert("Payment successfully submitted");
        window.location.href = "index.html";
    })
    .catch(error => {
        // Si è verificato un errore durante l'inserimento nel database
        console.error(error);
        alert("Oops! Something went wrong. Please try again");
        window.location.href = "insert.html";
    });
    
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

function deleteExpense(expenseId) {
    var request = indexedDB.open("SpesesDB", 2);

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