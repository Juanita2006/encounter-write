document.getElementById('encounterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const classCode = document.getElementById('classCode').value;
    const classDisplay = document.getElementById('classDisplay').value;
    const startDateTime = document.getElementById('startDateTime').value;
    const endDateTime = document.getElementById('endDateTime').value;
    const participantType = document.getElementById('participantType').value;
    const participantActor = document.getElementById('participantActor').value;
    const patientId = document.getElementById('patientId').value;

    // Crear el objeto Encounter en formato FHIR
    const encounter = {
        resourceType: "Encounter",
        status: status,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        class: {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
            code: classCode,
            display: classDisplay
        },
        subject: {
            reference: `Patient/${patientId}`
        },
        period: {
            start: startDateTime,
            end: endDateTime
        },
        participant: [{
            type: [{
                text: participantType
            }],
            individual: {
                display: participantActor
            }
        }]
    };

    // Enviar los datos usando Fetch API
    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/encounter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encounter)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Encuentro clínico creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el encuentro clínico.');
    });
});

