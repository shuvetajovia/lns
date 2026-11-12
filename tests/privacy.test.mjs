import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertPrivateResponse} from './privacy-assertions.mjs';
const response=(status,body='',contentType='text/html')=>({status:()=>status,text:async()=>body,headers:()=>({'content-type':contentType})});
test('privacy checks accept denied paths and missing-file app fallbacks',async()=>{
  await assertPrivateResponse(response(403));
  await assertPrivateResponse(response(404));
  await assertPrivateResponse(response(200,'<div id="root"></div><script type="module" src="/src/main.jsx"></script>'));
});
test('privacy checks reject exposed CSV, arbitrary HTML, and server errors',async()=>{
  await assert.rejects(assertPrivateResponse(response(200,'name,phone\nprivate-customer,123','text/csv')));
  await assert.rejects(assertPrivateResponse(response(200,'<html>private-customer</html>')));
  await assert.rejects(assertPrivateResponse(response(500)));
  await assert.rejects(assertPrivateResponse(response(200,'<div id="root"></div><script src="/src/main.jsx"></script>probe-data'),'probe-data'));
});
