const express = require('express');
const Sequelize = require('sequelize');


const app = express();
app.use(express.json());
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/db.sqlite'
});
const Op = Sequelize.Op;

const SERVER_PORT = 25565;
const ORDER_STATUSES = {
    PLACED: "placed",

    APPROVED: "approved",
    COMPLETED: "completed",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
}


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
        id: 'e19cse262',
        firstName: 'Sahaj',
        lastName: 'Mahla',
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
    const enrolment = req.body.enrolment.toLowerCase();

    User.findOne({ where: {id: enrolment} }).then(user => {
        if (user == null) { 
            // res.status(404);
            res.json({
                "status": "error",
                "message":"user not found"
            });
         } else if (user.can_order == true ) {
            
            const shirt = req.body.shirt;
            const tshirt = req.body.tshirt;
            const pajamas = req.body.pajamas;
            const jeans = req.body.jeans;
            const pants = req.body.pants;
            const bedsheets = req.body.bedsheets;
            const towels = req.body.towels;

            Orders.create({
                enrol_id: enrolment,
                shirt_count: shirt,
                tshirt_count: tshirt,
                pajama_count: pajamas,
                jeans_count: jeans,
                pant_count: pants,
                bedsheet_count: bedsheets,
                towel_count: towels,
                order_status: ORDER_STATUSES.PLACED
            });
            user.update(({can_order:false}));
            res.status(201);
            res.json({"status":"success"});
         } else {
            //  res.status(500);
            res.json({
                "status": "error",
                "message":"order already pending"
        });
         }
    });
});

app.post('/cancelOrder', (req,res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: {id: enrolment} }).then(user => {
        if (user == null) { 
            // res.status(404);
            res.json({
                "status": "error",
                "message":"user not found"
            });
         } else  {
            // Orders.destroy({where: {enrol_id: enrolment}, truncate: true, restartIdentity: true}).then(success => {
            //     user.update(({can_order: true}));
            //     res.json({"status":"success"});
            // });
            Orders.findOne({where:{enrol_id:enrolment, order_status:ORDER_STATUSES.PLACED}}).then(order => {
                order.update({order_status: ORDER_STATUSES.CANCELLED});
                user.update(({can_order: true}));
                res.json({"status":"success"});
            });
         }
    });
});

//Dhobi Routes

app.post('/dhobi/approveOrder', (req,res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: {id: enrolment} }).then(user => {
        if (user == null) { 
            // res.status(404);
            res.json({
                "status": "error",
                "message":"user not found"
            });
         } else {
            Orders.findOne({where:{id: enrolment, order_status:ORDER_STATUSES.PLACED}}).then(order => {
                if(order == null) {
                    res.json({
                        "status": "error",
                        "message":"order not found"
                    });
                } else {
                    order.update(({order_status: ORDER_STATUSES.APPROVED}));
                }
            });
         }
    });
});

app.post('/dhobi/rejectOrder', (req,res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: {id: enrolment} }).then(user => {
        if (user == null) { 
            // res.status(404);
            res.json({
                "status": "error",
                "message":"user not found"
            });
         } else {
            Orders.findOne({where:{id: enrolment, order_status:ORDER_STATUSES.PLACED}}).then(order => {
                if(order == null) {
                    res.json({
                    "status": "error",
                    "message": "order not found"
                });
                } else {
                    order.update(({order_status: ORDER_STATUSES.REJECTED}));
                }
            });
         }
    });
});

app.post('/dhobi/completeOrder', (req,res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: {id: enrolment} }).then(user => {
        if (user == null) { 
            // res.status(404);
            res.json({
                "status": "error",
                "message":"user not found"
            });
         } else {
            Orders.findOne({where:{id: enrolment, order_status:ORDER_STATUSES.APPROVED}}).then(order => {
                if(order == null) {
                    res.json({
                        "status": "error",
                        "message":"approved order not found"
                    });
                } else {
                    order.update(({order_status: ORDER_STATUSES.COMPLETED}));
                }
            });
         }
    });
});

app.get('/dhobi/', (req,res) => {
    Orders.findAll({where: {order_status:{[Op.or]: [ORDER_STATUSES.APPROVED, ORDER_STATUSES.PLACED]}}}).then(orders => {
        res.json({"status":"success","orders":orders});
    });
});

app.get('/dhobi/all', (req,res) => {
    Orders.findAll().then(orders => {
        res.json({"status":"success","orders":orders});
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
