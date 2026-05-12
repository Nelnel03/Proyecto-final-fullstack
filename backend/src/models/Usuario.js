module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuarios', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rol_id: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    fechaIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fotoPerfil: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('activo', 'baneado', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo'
    },
    motivoBan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    debeCambiarPassword: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol, { foreignKey: 'rol_id' });
    Usuario.hasMany(models.ResetToken, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Sesion, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Reporte, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.ReporteVoluntariado, { foreignKey: 'voluntario_id' });
    Usuario.hasMany(models.SolicitudVoluntariado, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Abono, { foreignKey: 'voluntario_id' });
  };

  return Usuario;
};
