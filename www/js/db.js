var db;

// Funzione per inizializzare e aprire il database

function initDatabase() {
    var request = indexedDB.open("myfDB", 2);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        
        if (!db.objectStoreNames.contains("spese")) {
            var objectStore = db.createObjectStore("spese", { keyPath: "id", autoIncrement: true });
                       
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
            if (!objectStore.indexNames.contains("latitudineIndex")) {
                objectStore.createIndex("latitudineIndex", "latitudine", { unique: false });
            }

            if (!objectStore.indexNames.contains("longitudineIndex")) {
                objectStore.createIndex("longitudineIndex", "longitudine", { unique: false });
            }
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Database aperto con successo.");
        //mostraGrafico();
    };

    request.onerror = function(event) {
        console.error("Errore durante l'apertura del database:", event.target.error);
    };

    
}
function inserisciSpesaDB(amount, category, date_p, comment_p, latitude,longitude) {
    console.log("Appena ricevuto");
    var transaction = db.transaction(["spese"], "readwrite");
    var objectStore = transaction.objectStore("spese");

    var request = objectStore.add({
        amount: amount,
        category: category,
        date_p: date_p,
        comment_p: comment_p,
        latitude: latitude,
        longitude: longitude
    });

    transaction.oncomplete = function (event) {
        console.log("Spesa inserita con successo.");
        // Reindirizzamento dopo il completamento della transazione
        window.location.href = "index.html";
    };

    transaction.onerror = function (event) {
        console.error("Errore durante l'inserimento della spesa:", event.target.error);
        // Gestisci l'errore, se necessario
    };
}
/*
function inserisciSpesaDB(amount, category, date_p, comment_p, latitudine, longitudine) {
    if (!amount || isNaN(amount) || amount <= 0 || !comment_p || comment_p.length > 100) {
        console.error("Input parameters are invalid.");
        return;
    }

    var transaction = db.transaction(["spese"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Transaction completed successfully.");
        alert("Spesa inserita con successo.");
        // Reindirizzamento dopo il completamento della transazione
        window.location.href = "index.html";
    };

    transaction.onerror = function (event) {
        console.error("Errore durante l'inserimento della transazione:", event.target.error);
        alert("Errore durante l'inserimento della transazione");
    };

    var speseObjectStore = transaction.objectStore("spese");

    var spesaData = {
        amount: amount,
        category: category,
        date: date_p,
        comment: comment_p,
        latitudine: latitudine,
        longitudine: longitudine
    };

    var request = speseObjectStore.add(spesaData);

    request.onerror = function (event) {
        console.error("Errore durante l'inserimento della spesa:", event.target.error);
        alert("Errore durante l'inserimento della spesa");
    };
}*/
/*

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


function initDatabase() {
    var request = indexedDB.open("Speses2DB", 2);

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
*/

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