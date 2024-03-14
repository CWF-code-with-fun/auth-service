import app from './app';
import logger from './Config/logger'
import { Config } from './Config';

const startServer = () => {
    const port = Config.PORT;

    try {
        app.listen(port, () => logger.info("listening on port "+ port));
    } catch (err:unknown) {
        if(err instanceof Error){
            logger.error(err.message)
        }
        process.exit(1);
    }
};

startServer();
