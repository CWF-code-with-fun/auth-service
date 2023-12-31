import app from './app';

import { Config } from './Config';

const startServer = () => {
    const port = Config.PORT;

    try {
        app.listen(port, () => {});
    } catch (err) {
        process.exit(1);
    }
};

startServer();
