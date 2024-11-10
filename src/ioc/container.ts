'reflect-metadata';
import '../lib/reflect'; // Import reflect-metadata first
import { Container } from 'inversify';
import { registerAuthModule } from './modules/auth';
import { registerUserModule } from './modules/user';
import { TYPES } from './types';

const container = new Container({ defaultScope: 'Singleton' });

// Register modules
registerAuthModule(container);
registerUserModule(container);

export { container, TYPES };
