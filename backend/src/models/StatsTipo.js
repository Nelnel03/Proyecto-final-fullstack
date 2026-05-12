module.exports = (sequelize, DataTypes) => {
  const StatsTipo = sequelize.define('stats_tipos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    periodo: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_reportes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_horas: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      defaultValue: 0
    },
    total_aprobados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_rechazados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  StatsTipo.associate = (models) => {
    StatsTipo.belongsTo(models.TareaDisponible, { foreignKey: 'tarea_id' });
  };

  return StatsTipo;
};
