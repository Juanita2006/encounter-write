document.getElementById('encounterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Datos del Encounter
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const participantType = document.getElementById('participantType').value;
    const patientId = document.getElementById('patientId').value;

    // Datos Diagnosis, Solicitud y Medicamento
    const diagnosisCode = document.getElementById('diagnosisCode').value;
    const diagnosisStatus = document.getElementById('diagnosisStatus').value;
    const requestType = document.getElementById('requestType').value;
    const requestCode = document.getElementById('requestCode').value;
    const medicationCode = document.getElementById('medicationCode').value;
    const dosage = document.getElementById('dosage').value;

    // Construir objeto Encounter
    const encounter = {
        resourceType: "Encounter",  // CORRECTO: mayúscula singular
        status: status,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        subject: {
            reference: "Patient/" + patientId
        },
        participant: [{
            type: [{ text: participantType }]
        }]
    };

    // Diagnosis
    const diagnosis = {
        resourceType: "Condition",
        code: { coding: [{ code: diagnosisCode }] },
        subject: { reference: "Patient/" + patientId },
        clinicalStatus: { coding: [{ code: diagnosisStatus }] }
        // Nota: No poner encounter todavía, lo añade backend
    };

    // Solicitud de Servicio
    const serviceRequest = {
        resourceType: "ServiceRequest",  // CORRECTO: mayúscula singular
        intent: "order",
        status: "active",
        subject: { reference: "Patient/" + patientId },
        category: [{ coding: [{ code: requestType }] }],
        code: { coding: [{ code: requestCode }] }
        // encounter se añade en backend
    };

    // Medicación
    const medicationRequest = {
        resourceType: "MedicationRequest",  // CORRECTO: mayúscula singular
        status: "active",
        intent: "order",
        medicationCodeableConcept: { coding: [{ code: medicationCode }] },
        subject: { reference: "Patient/" + patientId },
        dosageInstruction: [{ text: dosage }]
        // encounter se añade en backend
    };

    // Enviar todo en un solo JSON
    const payload = {
        encounter: encounter,
        condition: diagnosis,
        service_request: serviceRequest,
        medication_request: medicationRequest
    };

    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/encounter_with_resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta servidor:', data);
        alert('¡Encounter y recursos asociados creados exitosamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al crear recursos. Revisa consola.');
    });
});
