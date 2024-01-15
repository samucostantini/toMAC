function mostraGrafico() {
    deleteChart();
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
    deleteChart();
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
    
    aggiornaGraficoTorta();
}






function showGraphMontlyLine() {
    deleteChart();
    updateGraphMontlyLine();
    
}

//grafico linee per statistics
function graphMontlyLine(dati) {
    var ctx = document.getElementById('myChart').getContext('2d');
    
    var myPieChart = new Chart(ctx, {
        type: 'line',
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


function updateGraphMontlyLine() {
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

                // Estrai il mese e l'anno dalla data
                var dataSpesa = new Date(cursor.value.date_p);
                var meseAnno = dataSpesa.getFullYear() + "-" + (dataSpesa.getMonth() + 1);

                if (isNaN(parsedAmount)) {
                    console.error("Importo non valido per la categoria", categoria);
                } else {
                    // Usa meseAnno come chiave per tenere traccia delle somme mensili
                    if (datiGrafico[meseAnno]) {
                        datiGrafico[meseAnno] = datiGrafico[meseAnno] + parsedAmount;
                    } else {
                        datiGrafico[meseAnno] = parsedAmount;
                    }
                }
                cursor.continue();
            } else {
                // Ordina l'array finale in base alle chiavi (date)
                var sortedKeys = Object.keys(datiGrafico).sort(function (a, b) {
                    var dateA = new Date(a);
                    var dateB = new Date(b);
                    return dateA - dateB;
                });

                var datiGraficoOrdinati = {};
                sortedKeys.forEach(function (key) {
                    datiGraficoOrdinati[key] = datiGrafico[key];
                });

                graphMontlyLine(datiGraficoOrdinati);
            }
        };
    } else {
        console.error("Il database non è stato inizializzato correttamente.");
    }
}

function creaGraficoPolar(dati) {
    var ctx = document.getElementById('myPieChart').getContext('2d');

    var myPieChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(dati),
            datasets: [{
                label: 'Spese per categoria',
                data: Object.values(dati),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(128, 0, 0, 0.7)',
                    'rgba(0, 128, 0, 0.7)',
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
                r: {
                    beginAtZero: true
                }
            }
        }
    });
}

function parseCustomDate(customDate) {
    var dateObject = new Date(customDate);
    return dateObject.toLocaleDateString('en-GB'); // 'en-GB' imposta il formato della data come "DD/MM/YYYY"
}
function generate(initDate,endDate,chartType){
    deleteChart();
    console.log("inizio chart pers");

    if(db){
        var transaction = db.transaction(["spese"], "readonly");
        var objectStore = transaction.objectStore("spese");
        var richiesta = objectStore.openCursor();
        var datiGrafico = {};
        richiesta.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var amount = cursor.value.amount;
            var parsedAmount = parseFloat(amount);
            var category = cursor.value.category;
            var dataSpesa = parseCustomDate(cursor.value.date_p);

            console.log("1:  "+dataSpesa + "   "+ parseCustomDate(initDate));
           
            if(dataSpesa >= parseCustomDate(initDate) &&  dataSpesa <= parseCustomDate(endDate)){
                if(datiGrafico[category]){
                    datiGrafico[category]=datiGrafico[category]+ parsedAmount;
                }
                else{
                    datiGrafico[category]=parsedAmount;
                }

            }else{
                console.log("out");
                
            }
            cursor.continue();

    }else {
        
        if(chartType=="1"){
            creaGraficoTorta(datiGrafico)
        }
        if(chartType=="2"){
            creaGraficoBarre(datiGrafico)
        }
        if(chartType=="3"){
            creaGraficoPolar(datiGrafico)
        }
    
    }}

}
}




function deleteChart() {
    var existingChart = Chart.getChart("myPieChart");
    if (existingChart) {
        existingChart.destroy();
    }
}