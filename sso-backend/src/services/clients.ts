import { models } from '../models';

const getOneByUuid = async (uuid: string) => {
  return models.Client.findOne({ where: { uuid } }, { raw: true });
};

export {
  getOneByUuid,
};
