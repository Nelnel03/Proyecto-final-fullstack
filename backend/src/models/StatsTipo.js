module.exports = (sequelize, DataTypes) => {
  const StatsTipo = sequelize.define('stats_tipos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    planificados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    muertos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return StatsTipo;
};
