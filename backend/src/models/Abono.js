module.exports = (sequelize, DataTypes) => {
  const Abono = sequelize.define('abonos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    arbol_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    voluntario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_abono: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cantidad_kg: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Abono.associate = (models) => {
    Abono.belongsTo(models.Arbol, { foreignKey: 'arbol_id' });
    Abono.belongsTo(models.Usuario, { foreignKey: 'voluntario_id' });
  };

  return Abono;
};
