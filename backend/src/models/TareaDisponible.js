module.exports = (sequelize, DataTypes) => {
  const TareaDisponible = sequelize.define('tareas_disponibles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    horas: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    dias: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    activa: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TareaDisponible.associate = (models) => {
    TareaDisponible.hasMany(models.ReporteVoluntariado, { foreignKey: 'tarea_id' });
  };

  return TareaDisponible;
};
