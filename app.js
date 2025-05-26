document.getElementById('encounterForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Datos del Encounter (existente)
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const status = document.getElementById('status').value;
    const participantType = document.getElementById('participantType').value;
    const patientId = document.getElementById('patientId').value;

    // Datos nuevos: Diagnosis, Solicitud, Medicamento
    const diagnosisCode = document.getElementById('diagnosisCode').value;
    const diagnosisStatus = document.getElementById('diagnosisStatus').value;
    const requestType = document.getElementById('requestType').value;
    const requestCode = document.getElementById('requestCode').value;
    const medicationCode = document.getElementById('medicationCode').value;
    const dosage = document.getElementById('dosage').value;

    // 1. Crear el Encounter
    const encounter = {
        resourceType: "encounters",
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

    // 2. Crear los recursos adicionales
    const diagnosis = {
        resourceType: "Condition",
        code: { coding: [{ code: diagnosisCode }] },
        subject: { reference: "Patient/" + patientId },
        encounter: { reference: "encounters/" }, // Se actualizará después
        clinicalStatus: { coding: [{ code: diagnosisStatus }] }
    };

    const serviceRequest = {
        resourceType: "ServiceRequest",
        intent: "order",
        status: "active",
        subject: { reference: "Patient/" + patientId },
        encounter: { reference: "encounters/" }, // Se actualizará después
        category: [{ coding: [{ code: requestType }] }],
        code: { coding: [{ code: requestCode }] }
    };

    const medicationRequest = {
        resourceType: "MedicationRequest",
        status: "active",
        intent: "order",
        medicationCodeableConcept: { coding: [{ code: medicationCode }] },
        subject: { reference: "Patient/" + patientId },
        encounter: { reference: "encounters/" }, // Se actualizará después
        dosageInstruction: [{ text: dosage }]
    };

    // 3. Enviar primero el Encounter para obtener su ID
    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encounter)
    })
    .then(response => response.json())
    .then(encounterData => {
        const encounterId = encounterData.id;

        // Actualizar referencias en los otros recursos
        diagnosis.encounter.reference = "encounters/" + encounterId;
        serviceRequest.encounter.reference = "encounters/" + encounterId;
        medicationRequest.encounter.reference = "encounters/" + encounterId;

        // Enviar todos los recursos en paralelo
        return Promise.all([
            fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/Condition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(diagnosis)
            }),
            fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/ServiceRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceRequest)
            }),
            fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/MedicationRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(medicationRequest)
            })
        ]);
    })
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
        console.log('Éxito:', data);
        alert('¡Encounter y recursos asociados creados exitosamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al crear los recursos. Revisa la consola.');
    });
});



