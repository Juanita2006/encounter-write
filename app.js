document.getElementById('encounterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const participantType = document.getElementById('participantType').value;
    const patientId = document.getElementById('patientId').value;

    const encounter = {
        resourceType: "Encounter",
        status: status,
        identifier: [
            {
                system: identifierSystem,
                value: identifierValue
            }
        ],
        subject: {
            reference: "Patient/" + patientId
        },
        participant: [
            {
                type: [
                    {
                        text: participantType
                    }
                ]
            }
        ]
    };

    
    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/encounter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encounter)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('¡Encuentro clínico creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al crear el encuentro clínico. Revisa la consola.');
    });
});




