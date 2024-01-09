var db;

// Funzione per inizializzare e aprire il database
function initDatabase() {
    var request = indexedDB.open("SpesesDB", 2);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        

        // Crea l'object store "spese" se non esiste
        if (!db.objectStoreNames.contains("spese")) {
            var objectStore = db.createObjectStore("spese", { keyPath: "id", autoIncrement: true });

            // Crea l'indice solo se non esiste già
            if (!objectStore.indexNames.contains("amountIndex")) {
                objectStore.createIndex("amountIndex", "amount", { unique: false });
            }

            if (!objectStore.indexNames.contains("categoryIndex")) {
                objectStore.createIndex("categoryIndex", "category", { unique: false });
            }

            if (!objectStore.indexNames.contains("dateIndex")) {
                objectStore.createIndex("dateIndex", "date", { unique: false });
            }

            if (!objectStore.indexNames.contains("commentIndex")) {
                objectStore.createIndex("commentIndex", "comment", { unique: false });
            }
        }

    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database aperto con successo.");
    };

    request.onerror = function(event) {
        console.error("Errore durante l'apertura del database:", event.target.error);
    };
}

// Funzione per inserire una spesa nel database
function inserisciSpesaDB(amount, category, date_p, comment_p) {
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(["spese"], "readwrite");
        var objectStore = transaction.objectStore("spese");

        var request = objectStore.add({ amount: amount, category: category, date_p:date_p, comment_p:comment_p });

        transaction.oncomplete = function(event) {
            console.log("Spesa inserita con successo.");
            resolve();  // Risolve la promessa in caso di successo
        };

        transaction.onerror = function(event) {
            console.error("Errore durante l'inserimento della spesa:", event.target.error);
            reject("Errore durante l'inserimento della spesa");  // Rigetta la promessa in caso di errore
        };

        window.location.href = "index.html";

    });
    

}

// Funzione per visualizzare tutte le spese dal database
function visualizzaSpeseDB() {
    var transaction = db.transaction(["spese"], "readonly");
    var objectStore = transaction.objectStore("spese");
    var richiesta = objectStore.openCursor();

    richiesta.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("ID: " + cursor.value.id + ", Amount: " + cursor.value.amount + ", Category: " + cursor.value.category +", Date: "+cursor.value.date+ ", Comment:"+cursor.value.comment);
            cursor.continue();
        } else {
            console.log("Fine delle spese.");
        }
    };

    transaction.oncomplete = function(event) {
        console.log("Lettura dati completata.");
    };
}

document.addEventListener("DOMContentLoaded", function() {
    initDatabase();
});