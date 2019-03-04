# adonis-mongoose-provider
Mongoose Provider for Adonis

### Installation

```curl
$ npm install adonis-mongoose-provider --save
```

* Update the `config/database.js` file and add below mongodb configuration

```javascript
mongo: {
  client: 'mongo',
  connection: {
    host: Env.get('MONGO_DB_HOST', 'localhost'),
    port: Env.get('MONGO_DB_PORT', '27017'),
    user: Env.get('MONGO_DB_USER', ''),
    password: Env.get('MONGO_DB_PASSWORD', ''),
    database: Env.get('MONGO_DB_DATABASE', 'adonis'),
    options: {
      useNewUrlParser: true,
      autoReconnect: true,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6    
    }
  }
}
```

* Update `start/app.js` add the mongoose service provider

```javascript

const providers = [
  ...
  'adonis-mongoose-provider/providers/MongooseProvider'
]

const aliases = {
  ...
  Mongoose: 'Adonis/Addons/Mongoose'
}

```

### Basic Usage

Add/Update your user model `app/Models/User.js`

```javascript

'use strict';
const mongoose = use('Mongoose');
const schema = new mongoose.Schema({
  name: {
      type: String,
      unique: true,
      required: true
  },
  email: {
      type: String,
      unique: true,
      required: true
  },
  password: {
      type: String,
      hide: true,
      required: true
  },
  mobile: {
      type: String,
      default: null,
  },
  gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male'
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  },
  deleted_at: {
      type: Date,
      default: null
  }
},{
  timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  },
  toJSON: {
      getters: true,
      virtuals: true
  }
});

schema.set('toJson', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Users', schema, 'users');

```

Use basic mongoose query `app/Controllers/Http/UserController.js`

```javascript

'use strict'

const User = use("App/Models/User");

class UserController {

  async index({ }) {
    return await User.find({});
  }

  async store({ params, request }) {
    var body = request.only(['name', 'email', 'mobile', 'password']);
    return await User.create(body);
  }

  async show({ params }) {
    return await User.findOne({ _id: params.id });
  }

  async update({ params, request }) {
    var body = request.only(['name', 'email', 'mobile', 'password']);
    return await User.findOneAndUpdate({ _id: params.id }, body, { upsert: true, new: true });
  }

  async destroy({ params }) {
    return await User.findOneAndDelete({ _id: params.id });
  }

}

module.exports = UserController

```
