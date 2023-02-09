import { Model } from 'sequelize';

export default (models: any) => {
  // User
  models.User.belongsTo(models.Client as Model, { as: 'clients' });

  // Client
  models.Client.hasMany(models.User as Model, { as: 'users' });
};
