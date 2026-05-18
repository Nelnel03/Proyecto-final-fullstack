module.exports = (sequelize, DataTypes) => {
  const ReporteVoluntariado = sequelize.define('reportes_voluntariado', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    voluntario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tarea_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    voluntarioNombre: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    voluntarioEmail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    tipoTarea: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    horaInicio: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    horaFin: {
      type: DataTypes.STRING(50),
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
      allowNull: true
    },
    timestamp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado', 'solicitado', 'enviado', 'asignado', 'en_curso', 'rechazado_pre'),
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

  const dispararRecalculo = () => {
    require('../services/statsService').recalcularTodo()
      .catch(e => console.error('[stats] afterCreate/Update ReporteVoluntariado:', e));
  };

  ReporteVoluntariado.addHook('afterCreate', dispararRecalculo);
  ReporteVoluntariado.addHook('afterUpdate', (instance) => {
    if (instance.changed('estado')) dispararRecalculo();
  });

  return ReporteVoluntariado;
};
