const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const uri0 = 'mongodb://localhost:27017/Todoooooos'

const db_coll = 'TodosColl'

const uri =
	'mongodb+srv://jamal123:' +
	'jamal123' +
	'@jamalcluster-vebwi.mongodb.net/' +
	db_coll +
	'?retryWrites=true/'

mongoose.connect(
	uri,
	{ useNewUrlParser: true }
)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("we're connected!")
})

let todoSchema = new mongoose.Schema({
	text: String,
	completed: Boolean,
	userId: String
})

const Todo = mongoose.model('todos', todoSchema)

// const t1 = new Todo({
// 	text: 'Rayane',
// 	completed: false
// })

let userSchema = new mongoose.Schema({
	email: String,
	password: String,
	firstName: String,
	lastName: String,
	createdAt: Date,
	updatedAt: Date
})

const User = mongoose.model('users', userSchema)

module.exports = { Todo, User }
