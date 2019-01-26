const express = require('express')
const fs = require('fs')
const path = require('path')
const shortid = require('shortid')
const session = require('express-session')
const app = express()
const { Todo, User } = require('./db/mongoose.js')

const TWO_HOURS = 2 * 360000
const {
	SESS_NAME = 'kid',
	PORT = 5000,
	SESS_SECRET = 'ahgdhb@hdh&hfj)nfj-nbbf',
	SESS_LIFETIME = TWO_HOURS,
	NODE_ENV = 'developement'
} = process.env

app.set('view engine', 'pug')

// register the bodyPareser middleware for processing forms
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, '..', '/public')))
// register session with it's secret ID
app.use(
	session({
		name: SESS_NAME,
		secret: SESS_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: SESS_LIFETIME,
			secure: process.env.NODE_ENV === 'production'
		}
	})
)

// LOGS
const util = require('util')
app.use((req, res, next) => {
	// console.log('shortId: ', shortid.generate())
	// console.log('secret: ', req.session.secret)

	req.session.email &&
		fs.appendFile(
			'./logFile.log',
			'// ========================= The Req Object ========================\n' +
				'[' +
				new Date().toLocaleString() +
				'] ' +
				' Email: ' +
				util.inspect(req.session.email) +
				' NAME: ' +
				util.inspect(req.session.firstName) +
				// JSON.stringify(req, null, 2) +
				'\n',
			err => err
		)
	next()
})

const loggedIn = (req, res, next) => {
	// if (req.session.email === 'j' && req.session.password === 'j') {
	// 	next()
	// } else {
	// 	res.status(401).redirect('/home')
	// }

	User.findOne(
		{ email: req.session.email, password: req.session.password },
		(err, user) => {
			if (err) {
				return res.status(500).redirect('login')
			}
			if (!user) {
				return res.status(404).redirect('login')
			}
			next()
			// return res.status(200).send('welcome,', user)
		}
	)
}

app.get('/home', (req, res) => {
	res.render('home', {
		name: req.session.firstName
	})
})

// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login', {
		name: t
	})
})

app.post('/login', (req, res, next) => {
	req.session.email = req.body.email
	req.session.password = req.body.password
	req.session.firstName = req.body.email
	res.redirect('/')
})

// POST ROUTE
app.get('/register', (req, res) => {
	res.render('register', {
		name: t
	})
})

app.post('/register', (req, res, next) => {
	req.session.email = req.body.email
	req.session.password = req.body.password
	req.session.firstName = req.body.email

	const u2 = new User({
		email: req.session.email,
		password: req.session.password,
		firstName: req.session.email,
		createdAt: Date.now().toString()
	})

	u2.save().then(t => console.log('user saved!'))

	res.redirect('/')
})

app.get('/', loggedIn, (req, res) => {
	res.redirect('home')
})
// LOGGED ROUTE
app.get('/logged', (req, res) => {
	res.redirect('addTodo')
})

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
	req.session.destroy(e => {
		if (e) {
			res.negotiate(e)
		}
		// console.log('secret: ', req.session)
		res.redirect('/')
	})
})

let t = []

// YOUR APP
app.get('/addTodo', loggedIn, (req, res) => {
	User.findOneAndUpdate(
		{
			email: 'j' // search query
		},
		{
			$set: {
				email: 'JAMAL' // field:values to update
			}
		},
		{
			new: true, // return updated doc
			runValidators: true // validate before update
		}
	)
		.then(doc => {
			console.log(doc)
		})
		.catch(err => {
			console.error(err)
		})

	res.render('addTodo', {
		name: t,
		email: req.session.email
	})
})

app.post('/addTodo', (req, res) => {
	t = [...t, req.body.name]
	// console.log(t)
	res.redirect('addTodo')
})

app.get('/dashboard', loggedIn, (req, res) => {
	res.status(200).send('Welcome to your top-secret dashboard!')
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
