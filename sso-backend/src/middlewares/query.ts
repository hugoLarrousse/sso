import * as Clients from '../services/clients';

import { CustomRequest, Response, NextFunction } from '../interfaces/http';

const checkQuery = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const {
      client_id: clientUuid,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope,
      state,
    } = req.query;

    if (!clientUuid) {
      throw new Error('Missing client_id');
    }
    if (!redirectUri) {
      throw new Error('Missing redirect_uri');
    }
    // if (!responseType) {
    //   throw new Error('Missing response_type');
    // }
    // if (!scope) {
    //   throw new Error('Missing scope');
    // }
    // if (!state) {
    //   throw new Error('Missing state');
    // }

    // check if client uuid exist in db
    const client = await Clients.getOneByUuid(String(clientUuid));
    if (!client) {
      throw new Error('Client not found');
    }
    if (client.redirectUri !== redirectUri) {
      throw new Error('Redirect uri does not match');
    }

    req.user = await _getUserFromToken(token);

    Users.updateLastSeen(req.user.id);

    next();
  } catch (error: any) {
    if (error.message !== 'no token provided') {
      logger.error({
        __filename,
        methodName: 'checkToken',
        message: error.message,
      });
    }
    res.status(403).send({ error: true, message: 'ERROR_CHECK_TOKEN' });
  }
};