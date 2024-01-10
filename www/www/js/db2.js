var db;

// Funzione per inizializzare e aprire il database
function initDatabase() {
    var request = indexedDB.open("GestioneVotiDB", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;

        // Crea l'object store "Voti" se non esiste
        if (!db.objectStoreNames.contains("Voti")) {
            // L'object store con campi per voto e crediti
            var objectStore = db.createObjectStore("Voti", { autoIncrement: true });
            objectStore.createIndex("votoIndex", "voto", { unique: false });
            objectStore.createIndex("creditiIndex", "crediti", { unique: false });
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

// Funzione per scrivere i voti nel database
function scriviDati(voto, crediti) {
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(["Voti"], "readwrite");
        var objectStore = transaction.objectStore("Voti");

        var request = objectStore.add({ voto: voto, crediti: crediti });

        transaction.oncomplete = function(event) {
            console.log("Dati scritti con successo.");
            resolve();  // Risolve la promessa in caso di successo
        };

        transaction.onerror = function(event) {
            console.error("Errore durante la scrittura dei dati:", event.target.error);
            reject("Errore durante la scrittura dei dati");  // Rigetta la promessa in caso di errore
        };
    });
}

// Funzione per leggere tutti i voti dal database
function leggiTuttiIVoti() {
    var transaction = db.transaction(["Voti"], "readonly");
    var objectStore = transaction.objectStore("Voti");
    var richiesta = objectStore.openCursor();

    richiesta.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("Voto: " + cursor.value.voto + ", Crediti: " + cursor.value.crediti);
            cursor.continue();
        } else {
            console.log("Fine dei voti.");
        }
    };

    transaction.oncomplete = function(event) {
        console.log("Lettura dati completata.");
    };
}

document.addEventListener("DOMContentLoaded", function() {
    initDatabase();
});