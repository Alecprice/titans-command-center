import {advancedAnalyticsRoute} from '../src/advanced-analytics-api.mjs';

export default async function handler(req,res){
  return advancedAnalyticsRoute(req,res,process.env);
}
