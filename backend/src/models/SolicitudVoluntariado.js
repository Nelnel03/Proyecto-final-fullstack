module.exports = (sequelize, DataTypes) => {
  const SolicitudVoluntariado = sequelize.define('solicitudes_voluntariado', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
      allowNull: false,
      defaultValue: 'pendiente'
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  SolicitudVoluntariado.associate = (models) => {
    SolicitudVoluntariado.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return SolicitudVoluntariado;
};
