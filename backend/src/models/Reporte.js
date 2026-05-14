module.exports = (sequelize, DataTypes) => {
  const Reporte = sequelize.define('reportes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rol_id: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    asunto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'En Proceso', 'Leído', 'Solucionado', 'En Investigación', 'Resuelto'),
      allowNull: true,
      defaultValue: 'Pendiente'
    },
    visto: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Reporte.associate = (models) => {
    Reporte.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    Reporte.belongsTo(models.Rol, { foreignKey: 'rol_id' });
  };

  return Reporte;
};
