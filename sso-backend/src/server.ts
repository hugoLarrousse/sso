import app from './app';
import * as db from './models';
// import { initIdsForMigration } from './seed/init';

// import * as Workers from './workers';

const port = process.env.PORT || '3005';

const launchServer = async () => {
  console.log(`
  ███╗   ███╗ █████╗  ██████╗ ███╗   ███╗ █████╗
  ████╗ ████║██╔══██╗██╔════╝ ████╗ ████║██╔══██╗
  ██╔████╔██║███████║██║  ███╗██╔████╔██║███████║
  ██║╚██╔╝██║██╔══██║██║   ██║██║╚██╔╝██║██╔══██║
  ██║ ╚═╝ ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║
  ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝
`);

  if (await db.createConnection()) {
    app.listen(port, () => {
      console.log(`SSO backend ready! port: ${port}`);
    });
  } else {
    process.exit(1);
  }
};

launchServer();
