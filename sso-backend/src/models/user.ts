import { DataTypes } from 'sequelize';

export default (dbInstance: any) => {
  return dbInstance.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'clients',
          key: 'id',
        },
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verifiedAt: {
        type: DataTypes.DATE,
      },
      archivedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      indexes: [{
        // unique: true,
        fields: ['id'],
      }, {
        // unique: true,
        fields: ['email'],
      }],
    }
  );
};
