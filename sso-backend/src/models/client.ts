import { DataTypes } from 'sequelize';

export default (dbInstance: any) => {
  return dbInstance.define(
    'clients',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      archivedAt: {
        type: DataTypes.DATE,
      },
      redirectUri: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      indexes: [{
        // unique: true,
        fields: ['id'],
      }],
    }
  );
};
