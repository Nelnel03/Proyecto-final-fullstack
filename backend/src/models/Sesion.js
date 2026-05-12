module.exports = (sequelize, DataTypes) => {
  const Sesion = sequelize.define('sesiones', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    activa: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Sesion.associate = (models) => {
    Sesion.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return Sesion;
};
