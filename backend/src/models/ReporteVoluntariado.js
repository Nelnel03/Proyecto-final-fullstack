module.exports = (sequelize, DataTypes) => {
  const ReporteVoluntariado = sequelize.define('reportes_voluntariado', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voluntario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: true
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: true
    },
    horas: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    tareas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pruebas: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    motivoRechazo: {
      type: DataTypes.STRING(255),
      allowNull: true
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

  ReporteVoluntariado.associate = (models) => {
    ReporteVoluntariado.belongsTo(models.Usuario, { foreignKey: 'voluntario_id' });
    ReporteVoluntariado.belongsTo(models.TareaDisponible, { foreignKey: 'tarea_id' });
  };

  return ReporteVoluntariado;
};
