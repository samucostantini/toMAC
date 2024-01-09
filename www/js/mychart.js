function mostraGrafico() {
    // Chiama la funzione di aggiornamento del grafico quando il pulsante viene cliccato
    aggiornaGraficoTorta();
}

// Chiamiamo la funzione di aggiornamento del grafico solo dopo che il database è stato aperto con successo

// Funzione per aggiornare il grafico a torta
function aggiornaGraficoTorta() {
    

    if (db) {  // Assicurati che db sia definito
        var transaction = db.transaction(["spese"], "readonly");
        var objectStore = transaction.objectStore("spese");
        var richiesta = objectStore.openCursor();

        var datiGrafico = {};

        richiesta.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                
                var amount=cursor.value.amount;
                var parsedAmount = parseFloat(amount);
                var categoria = cursor.value.category;
                if (isNaN(parsedAmount)) {
                    console.error("Invalid amount for category", categoria);
                } else{ 
                if (datiGrafico[categoria]) {
                    datiGrafico[categoria] = datiGrafico[categoria] + parsedAmount;
                } else {
                    datiGrafico[categoria] = parsedAmount;
                }
                }
                cursor.continue();
            } else {
                
                creaGraficoTorta(datiGrafico);
            }
        };
    } else {
        console.error("Il database non è stato inizializzato correttamente.");
    }
}

// Funzione per creare il grafico a torta
function creaGraficoTorta(dati) {
    var ctx = document.getElementById('myPieChart').getContext('2d');
    
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(dati),
            datasets: [{
                data: Object.values(dati),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)', // Nuovo colore
                    'rgba(153, 102, 255, 1)', // Nuovo colore
                    'rgba(255, 159, 64, 1)', // Nuovo colore
                    'rgba(128, 0, 0, 1)', // Nuovo colore
                    'rgba(0, 128, 0, 1)', // Nuovo colore
                    
                ],
            }],
        },
    });
}


function mostraGrafico2() {
    // Chiama la funzione di aggiornamento del grafico quando il pulsante viene cliccato
    aggiornaGraficoBarre();
}

function aggiornaGraficoBarre() {
    if (db) {
        var transaction = db.transaction(["spese"], "readonly");
        var objectStore = transaction.objectStore("spese");
        var richiesta = objectStore.openCursor();

        var datiGrafico = {};

        richiesta.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var amount = cursor.value.amount;
                var parsedAmount = parseFloat(amount);
                var categoria = cursor.value.category;
                if (isNaN(parsedAmount)) {
                    console.error("Importo non valido per la categoria", categoria);
                } else {
                    if (datiGrafico[categoria]) {
                        datiGrafico[categoria] = datiGrafico[categoria] + parsedAmount;
                    } else {
                        datiGrafico[categoria] = parsedAmount;
                    }
                }
                cursor.continue();
            } else {
                creaGraficoBarre(datiGrafico);
            }
        };
    } else {
        console.error("Il database non è stato inizializzato correttamente.");
    }
}
function creaGraficoBarre(dati) {
    var ctx = document.getElementById('myPieChart').getContext('2d');
    
    var myPieChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dati),
            datasets: [{
                label: 'Spese per categoria',
                data: Object.values(dati),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(128, 0, 0, 1)',
                    'rgba(0, 128, 0, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(128, 0, 0, 1)',
                    'rgba(0, 128, 0, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}



function mostraGrafico3() {
    // Chiama la funzione di aggiornamento del grafico quando il pulsante viene cliccato
    aggiornaGraficoTorta();
}
