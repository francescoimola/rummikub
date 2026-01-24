globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_HmHTzEsO.mjs';
import './chunks/astro/server_CW_2TarA.mjs';
import { s as sequence } from './chunks/index_UDefa0H4.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
