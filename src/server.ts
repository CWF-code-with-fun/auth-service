import app from './app';
import logger from './Config/logger';
import { Config } from './Config';

const startServer = () => {
    const port = Config.PORT;

    try {
        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();
