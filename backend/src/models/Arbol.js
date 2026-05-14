module.exports = (sequelize, DataTypes) => {
  const Arbol = sequelize.define('arboles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nombreCientifico: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    progreso: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    familia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    altura: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    crecimiento: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cuidados: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    altura_min_m: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    altura_max_m: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    clima: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imagenUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('vivo', 'muerto', 'enfermo'),
      allowNull: false,
      defaultValue: 'vivo'
    },
    fechaRegistro: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    historialAbono: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Arbol.associate = (models) => {
    Arbol.hasMany(models.Abono, { foreignKey: 'arbol_id' });
  };

  return Arbol;
};
