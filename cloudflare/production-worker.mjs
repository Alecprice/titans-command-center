import worker from './worker.mjs';

const enabled=value=>/^(1|true|yes|on)$/i.test(String(value??'').trim());

export function neonWarehouseDisabled(env={}){
  return enabled(env?.NEON_WAREHOUSE_DISABLED);
}

export function productionDataEnv(env={}){
  if(!neonWarehouseDisabled(env))return env;
  return new Proxy(env,{
    get(target,property,receiver){
      if(property==='DATABASE_URL')return undefined;
      return Reflect.get(target,property,receiver);
    },
    has(target,property){
      if(property==='DATABASE_URL')return false;
      return Reflect.has(target,property);
    },
    getOwnPropertyDescriptor(target,property){
      if(property==='DATABASE_URL')return undefined;
      return Reflect.getOwnPropertyDescriptor(target,property);
    }
  });
}

export default {
  fetch(request,env,ctx){
    return worker.fetch(request,productionDataEnv(env),ctx);
  },
  scheduled(controller,env,ctx){
    return worker.scheduled(controller,productionDataEnv(env),ctx);
  }
};
