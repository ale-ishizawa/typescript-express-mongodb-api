import dotenv from 'dotenv';
const result = dotenv.config()
if (result.error) {
  throw result.error
}
import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import debug from 'debug';
import helmet from 'helmet';
import { CompaniesRoutes } from './companies/companies.routes.config';
import { VacanciesRoutes } from './vacancies/vacancies.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3003;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// adding middleware to parse all incoming requests as JSON
app.use(express.json());

//adding middleware to allow cross-origin requests
app.use(cors());

app.use(helmet());

//preparing expressWinston logging middleware config to log all HTTP requests
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true}),
  )
};

//if is not debugging, log requests as one-liners
if (!process.env.DEBUG) {
  loggerOptions.meta = false; 
  if (typeof global.it === 'function') {
    loggerOptions.level = 'http';
  }
}

//initialize the logger with config
app.use(expressWinston.logger(loggerOptions));

//adding UserRoutes to our array
//sending express application object to have the routes added to our app
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
routes.push(new CompaniesRoutes(app));
routes.push(new VacanciesRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;


app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`)
  });
  console.log(runningMessage);
})


