const express = require('express');
const Sequelize = require('sequelize');


const app = express();
app.use(express.json());
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/db.sqlite'
  });

const SERVER_PORT = 8000;
const DBSOURCE = "db.sqlite"


//Check if connection to db was established.
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//Data Models:
const Model = Sequelize.Model;
class User extends Model {}
User.init({
  // attributes
  id: {
      type: Sequelize.STRING,
      primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING
    // allowNull defaults to true
  },
  roomNo: {
      type: Sequelize.STRING,
      allowNull: false
  },
  can_order: {
      type: Sequelize.BOOLEAN,
      allowNull: false
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: false
  // options
});


class Orders extends Model {}
Orders.init({
    enrol_id: {
        type: Sequelize.STRING,
        references: {
          // This is a reference to another model
          model: User,
          // This is the column name of the referenced model
          key: 'id',
        }
    },
    order_status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    shirt_count: {
        type: Sequelize.INTEGER
    },
    tshirt_count: {
        type: Sequelize.INTEGER
    },
    pajama_count: {
        type: Sequelize.INTEGER
    },
    jeans_count: {
        type: Sequelize.INTEGER
    },
    pant_count: {
        type: Sequelize.INTEGER
    },
    bedsheet_count: {
        type: Sequelize.INTEGER
    },
    towel_count: {
        type: Sequelize.INTEGER
    },
      
}, {
    sequelize,
    modelName: 'orders',
    timestamps: true
});

// Orders.belongsTo(Model.User, { foreignKey: "enrol_id" });

//Demo User Data:
User.sync({ force: true }).then(() => {
    // Now the `users` table in the database corresponds to the model definition
    return User.create({
        id: 'e19cse266',
        firstName: 'Raghav',
        lastName: 'Vashisht',
        roomNo: "D-545",
        can_order: true
    });
  });

sequelize.sync()

app.get('/', (req,res) => {
    res.json({"message":"Ok"});
});

app.post('/createOrder', (req,res) => {
    console.log(req.body.enrolment);
    const enrolment = req.body.enrolment;

    User.findOne({ where: {id: enrolment.toLowerCase()} }).then(user => {
        if (user == null) { 
            res.status(404);
            res.json({"error":"user not found"});
         } else if (user.can_order == true ) {
            Orders.create({
                enrol_id: enrolment,
                order_status: "placed"
            });
            user.update(({can_order:false}));
            res.status(201);
            res.json({"status":"success"});
         } else {
             res.status(500);
             res.json({"error":"order already pending"});
         }
    });
});


//For any other req.
app.use((req, res) => {
    res.status(404);
    res.json({"error":"404"});
});


app.listen(SERVER_PORT, () => {
    console.log("Kapde Wala Backend listening on port: "+SERVER_PORT);
});
