const { Schema, model } = require('mongoose');


const UserSchema =  Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    online: {
        type: Boolean,
        default: false
    },

});

UserSchema.method('toJSON', function() {
    // Extraemos todos los datos que no queremos mostrar
    // ...object -> todo lo demas lo guardamos en una constante que se llama object
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id; // cambiamos el nombre (a nivel visual) del _id a uid
    return object;
});

module.exports = model('User', UserSchema);