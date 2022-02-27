import cors from 'cors';
import * as express from 'express';
import passport from 'passport';
import './utils/jwt.utils';
import routes from './routes';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express.default();
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Synpulse Backend Test',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development Server'
      }
    ]
  },
  apis: ['./src/routes/*.routes.ts'],
  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        schema: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: {
    bearerAuth: []
  }
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use(cors({ origin: true }));
app.use('/', routes);

export default app;
