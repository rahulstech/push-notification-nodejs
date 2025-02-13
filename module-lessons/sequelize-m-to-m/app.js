const { sequelize, Doctor, Patient, Diagnosis } = require('./models')

async function init() {

    await sequelize.sync({ force: true })

    // create doctors
    const doc1 = await Doctor.create({ name: "doctor1" })

    const doc2 = await Doctor.create({ name: "doctor2"})

    // create patients
    const pat1 = await Patient.create({ name: "patient1" })

    const pat2 = await Patient.create({ name: "patient2" })

    // create diagnosis
    const diag1 = await Diagnosis.create({
        docid: doc1.doctorId,
        patid: pat1.id,
    })

    const diag2 = await Diagnosis.create({
        docid: doc2.doctorId,
        patid: pat2.id,
    })

    const diag3 = await Diagnosis.create({
        docid: doc2.doctorId,
        patid: pat1.id,
    })

    // some queries

    const results = await Diagnosis.findAll({
        raw: true,
        include: {
            model: Doctor, // should not the name of model as String
            attributes: [
                [
                    'name', // name of attribute 
                    'doc_name' // alias
                ]
            ]  
        },
        where: {
            docid: doc2.doctorId
        }
    })

    console.log('all diagnosis done by doc ', doc2.name, ' ', results)

    // let's test the primary key violation for Disagnosis
    Diagnosis.create({
        docid: doc1.id,
        patid: pat1.id,
    })
    .then(() => {
        console.log('diagnosis created successfully, but it should not happen')
    })
    .catch( err => {
        console.log('diagnosis not created as expected due primary key constraint violation')
    })
}

init()

