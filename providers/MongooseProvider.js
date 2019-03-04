'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const mongoose = require('mongoose')

class MongooseProvider extends ServiceProvider {

	register() {
		this.app.singleton('Adonis/Addons/Mongoose', function (app) {
			const Config = app.use('Adonis/Src/Config');
			const mongoHost = Config.get('database.mongo.connection.host', 'localhost')
			const mongoPort = Config.get('database.mongo.connection.port', '27017')
			const mongoDb = Config.get('database.mongo.connection.db', 'adonis')
			const mongoUser = Config.get('database.mongo.connection.user', '')
			const mongoPass = Config.get('database.mongo.connection.pass', '')
			const mongoOptions = Config.get('database.mongo.connection.options', {})
			const mongoUrl = Config.get('database.mongo.connection.url', `${mongoHost}:${mongoPort}/${mongoDb}`)
			const connectionString = (mongoUser !== '' || mongoPass !== '') ? `mongodb://${mongoUser}:${mongoPass}@${mongoUrl}` : `mongodb://${mongoUrl}`

			mongoose.Promise = global.Promise;
			mongoose.set('useCreateIndex', true);
			mongoose.set('useFindAndModify', false);

			try {
				mongoose.connect(connectionString, mongoOptions).then((conn) => {
					console.log("Database connected");
				});
			} catch (error) {
				if (error.name == 'MongoNetworkError') {
					console.log("MongoNetworkError : ", connectionString);
				}
			}
			return mongoose
		})
	}
}

module.exports = MongooseProvider