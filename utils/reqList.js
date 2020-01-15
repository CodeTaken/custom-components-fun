// 主要列出所有页面的 api
const regeneratorRuntime = require('../lib/regenerator-runtime/runtime')
import { baseRequest } from '/reqBase.js'
 
/*
* @param data  string | obj  参数
* @param loading 是否开启加载  默认：false   
*/
const testReq = async function (data){
  let result =await baseRequest({
    url: '/api/MPInfo/GetHomeMoudles',
    data:data,
    method: 'POST',
  }) 
  console.log(result);
  return  Promise.resolve(result)
   

  /*
    期待返回数据{
      status：1,
      Data:[...],
      Message:'...'
    }
  */

}

const testReqTwo = async function (data) {
  let result = await baseRequest({
    url: '/api/MPInfo/GetTabBarModules',
    data: data,
    method: 'POST',
  })
  return Promise.resolve(result)
}





module.exports = {
  testReq, 
  testReqTwo
}