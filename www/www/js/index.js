/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
function saveData() {
    var inputData = document.getElementById('dataInput').value;

    var request = window.indexedDB.open('MyDatabase', 1);

    request.onerror = function(event) {
        console.error('Error opening database');
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;

        if (!db.objectStoreNames.contains('MyObjectStore')) {
            var objectStore = db.createObjectStore('MyObjectStore', { keyPath: 'id', autoIncrement: true });
        }
    };

    request.onsuccess = function(event) {
        var db = event.target.result;
        var transaction = db.transaction(['MyObjectStore'], 'readwrite');
        var objectStore = transaction.objectStore('MyObjectStore');

        var addRequest = objectStore.add({ data: inputData });

        addRequest.onsuccess = function() {
            console.log('Data saved successfully');

            // Dopo aver salvato i dati, leggili tutti e aggiorna l'interfaccia utente
            var readTransaction = db.transaction(['MyObjectStore'], 'readonly');
            var readObjectStore = readTransaction.objectStore('MyObjectStore');
            var getAllRequest = readObjectStore.getAll();

            getAllRequest.onsuccess = function() {
                var allSavedData = getAllRequest.result;
                displayAllSavedData(allSavedData);
            };

            getAllRequest.onerror = function() {
                console.error('Error reading all saved data');
            };
        };

        addRequest.onerror = function() {
            console.error('Error saving data');
        };
    };
}

function displayAllSavedData(allData) {
    console.log('Displaying all saved data:', allData);

    // Costruisci una stringa contenente tutti i dati salvati
    var displayText = 'Saved Data:\n';

    for (var i = 0; i < allData.length; i++) {
        displayText += allData[i].data + '\n';
    }

    // Aggiorna l'HTML o il contenuto della casella per mostrare tutti i dati salvati
    document.getElementById('savedDataDisplay').innerText = displayText;
}

document.addEventListener('deviceready', function () {
    // Verifica se il dispositivo supporta l'autenticazione delle impronte digitali
    Fingerprint.isAvailable(
      function (result) {
        if (result.isAvailable) {
          // Autentica l'utente
          Fingerprint.show({
            clientId: "Il_tuo_nome_di_app",
            clientSecret: "Chiave_segreta_opzionale"
          }, function (success) {
            alert("Autenticazione riuscita!");
          }, function (error) {
            alert("Errore durante l'autenticazione: " + error);
          });
        } else {
          alert("Impronte digitali non disponibili sul dispositivo.");
        }
      },
      function (error) {
        alert("Errore nella verifica delle impronte digitali: " + error);
      }
    );
  });

  