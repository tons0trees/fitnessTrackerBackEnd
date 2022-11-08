const {getAllRoutinesByUser} = require('./db')

try {
    getAllRoutinesByUser({username: 'albert'}).then( result => console.log("**** test ****", result))  
} catch (error) {
    console.error(error)
}