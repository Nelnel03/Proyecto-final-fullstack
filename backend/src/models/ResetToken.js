module.exports = (sequelize, DataTypes) => {
  const ResetToken = sequelize.define('reset_tokens', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ResetToken.associate = (models) => {
    ResetToken.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
  };

  return ResetToken;
};
