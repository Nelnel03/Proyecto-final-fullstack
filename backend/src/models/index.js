const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    define: {
      underscored: false,
      freezeTableName: true,
      timestamps: true
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.Rol = require('./Rol')(sequelize, DataTypes);
db.Arbol = require('./Arbol')(sequelize, DataTypes);
db.TareaDisponible = require('./TareaDisponible')(sequelize, DataTypes);
db.Usuario = require('./Usuario')(sequelize, DataTypes);
db.ResetToken = require('./ResetToken')(sequelize, DataTypes);
db.Sesion = require('./Sesion')(sequelize, DataTypes);
db.Reporte = require('./Reporte')(sequelize, DataTypes);
db.ReporteVoluntariado = require('./ReporteVoluntariado')(sequelize, DataTypes);
db.SolicitudVoluntariado = require('./SolicitudVoluntariado')(sequelize, DataTypes);
db.Abono = require('./Abono')(sequelize, DataTypes);
db.StatsTipo = require('./StatsTipo')(sequelize, DataTypes);

// Asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
