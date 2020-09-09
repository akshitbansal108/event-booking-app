const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use('/home', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      ticket: Float!
      date: String!
      creator: String!
    }
    type User {
      _id: ID!
      email: String!
      password: String
    }
    input EventInput {
      title: String!
      description: String!
      ticket: Float!
    }
    input UserInput {
      email: String!
      password: String!
    }
    type RootQuery {
      events: [Event!]!
      users: [User!]!
    }
    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(
        events => {
          return events.map(event => {
            return { ...event._doc, _id: event.id };
          });
        }
      ).catch(err => {
        throw err;
      });
    },
    users: () => {
      return User.find().then(
        users => {
          return users.map(user => {
            return { ...user._doc, _id: user.id };
          })
        }
      ).catch(err => {
        throw err;
      })
    },
    createEvent: async (args) => {
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          ticket: +args.eventInput.ticket,
          date: new Date(),
          creator: '5f58fdee5d5d6448be380b93'
        });
        const creator = await User.findById(event.creator);
        if (!creator) {
          throw new Error("User Not Found");
        }
        creator.createdEvents.push(event);
        creator.save();
        const newEvent = await event.save();
        return { ...newEvent._doc, _id: newEvent._doc._id.toString() };
      } catch (err) {
        throw err;
      }
    },
    createUser: async (args) => {
      try {
        const existingUser = await User.findOne({ email: args.userInput.email });
        if (existingUser) {
          throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        const newUser = await user.save();
        return { ...newUser._doc, _id: user.id, password: null };
      } catch (err) {
        throw err;
      }
    }
  },
  graphiql: true
}));

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(3000);
});
