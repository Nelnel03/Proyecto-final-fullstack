module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('roles', {
    id: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario, { foreignKey: 'rol_id' });
    Rol.hasMany(models.Reporte, { foreignKey: 'rol_id' });
  };

  return Rol;
};
