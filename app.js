document.getElementById('encounterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const participantType = document.getElementById('participantType').value;
    const patientId = document.getElementById('patientId').value;

    const diagnosisCode = document.getElementById('diagnosisCode').value;
    const diagnosisStatus = document.getElementById('diagnosisStatus').value;
    const requestType = document.getElementById('requestType').value;
    const requestCode = document.getElementById('requestCode').value;
    const medicationCode = document.getElementById('medicationCode').value;
    const dosage = document.getElementById('dosage').value;

    // Construir objeto Encounter
    const encounter = {
        resourceType: "Encounter",
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

    // Construir diagnóstico (Condition)
    const diagnosis = {
        resourceType: "Condition",
        code: { coding: [{ code: diagnosisCode }] },
        subject: { reference: "Patient/" + patientId },
        clinicalStatus: { coding: [{ code: diagnosisStatus }] }
    };

    // Construir solicitud (ServiceRequest)
    const serviceRequest = {
        resourceType: "ServiceRequest",
        intent: "order",
        status: "active",
        subject: { reference: "Patient/" + patientId },
        category: [{ coding: [{ code: requestType }] }],
        code: { coding: [{ code: requestCode }] }
    };

    // Construir receta (MedicationRequest)
    const medicationRequest = {
        resourceType: "MedicationRequest",
        status: "active",
        intent: "order",
        medicationCodeableConcept: { coding: [{ code: medicationCode }] },
        subject: { reference: "Patient/" + patientId },
        dosageInstruction: [{ text: dosage }]
    };

    // Payload final estructurado correctamente
    const payload = {
        encounter: encounter,
        condition: [diagnosis],                // ← Enviar como arreglo
        service_request: [serviceRequest],     // ← Enviar como arreglo
        medication_request: [medicationRequest]// ← Enviar como arreglo
    };

    // Enviar al backend
    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/encounter_with_resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('¡Encounter y recursos asociados creados exitosamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al crear recursos. Revisa la consola.');
    });
});
