function inserisciSpesa() {
    var amount = document.getElementById('amount').value;
    var category = document.getElementById('category').value;
    var date_p = document.getElementById('date_p').value;
    var comment_p = document.getElementById('comment_p').value;

    // Chiamata a funzione in db.js per inserire la spesa nel database
    inserisciSpesaDB(amount, category, date_p, comment_p);
    
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