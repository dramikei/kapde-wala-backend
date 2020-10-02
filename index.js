const express = require('express');

const { sequelize } = require('./util/database');
const userRoutes = require('./routes/user');
const dhobiRoutes = require('./routes/dhobi');

const app = express();
app.use(express.json());

const SERVER_PORT = process.env.PORT || 3000;

//Check if connection to db was established.
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Orders.belongsTo(Model.User, { foreignKey: "enrol_id" });

//Demo User Data:
// User.sync({ force: true }).then(() => {
//     // Now the `users` table in the database corresponds to the model definition
//     return User.create({
//         id: 'e19cse262',
//         firstName: 'Sahaj',
//         lastName: 'Mahla',
//         roomNo: "D-545",
//         can_order: true
//     });
// });
sequelize.sync();

app.get('/', (req, res) => {
  res.json({ message: 'Ok' });
});

app.use('/user', userRoutes);
app.use('/dhobi', dhobiRoutes);

//For any other req.
app.use((req, res) => {
  res.status(404);
  res.json({ error: '404' });
});

app.listen(SERVER_PORT, () => {
  console.log('Kapde Wala Backend listening on port: ' + SERVER_PORT);
});
