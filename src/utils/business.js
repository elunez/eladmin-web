import { initData } from  '@/api/data'
import store from '@/store'
export function queryVersionNo(productId,versionNo) {
  var url = 'api/product'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (productId !== ''){
    params["productId"] = productId;
  }
  if (versionNo !== ''){
    params["versionNo"] = versionNo;
  }
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}


export function queryCustName(custType,area,custName){
  var url = 'api/customer'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (custType !== ''){
    params["custType"] = custType
  }
  if (area !== ''){
    params["area"] = area;
  }
  if (custName !== ''){
    params["custName"] = custName;
  }
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}

export function queryUser(username){
  var url = 'api/users'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (username !== ''){
    params["blurry"] = username;
  }
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}

export function queryFunction(productId,functionName){
  var url = 'api/functionInfo'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (productId !== ''){
    params["productId"] = productId;
  }
  if (functionName !== ''){
    params["functionName"] = functionName;
  }
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}
export function queryScriptNoFunc(productId,moduleType,scriptName){
  var url = 'api/scriptInfo/nofunc'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (productId !== ''){
    params["productId"] = productId;
  }
  if (moduleType !== ''){
    params["moduleType"] = moduleType;
  }
  if (scriptName !== ''){
    params["scriptName"] = scriptName;
  }
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}

export function queryFtpByPerson(sftpUseType){
  var url = '/api/ftpUser'
  const sort = 'id,desc'
  var params = { page: 0, size: 999999, sort: sort };
  if (sftpUseType !== ''){
    params["sftpUseType"] = sftpUseType;
  }
  params["username"] = store.getters.user.username;
  var  data = {};
  return new Promise((resolve,reject)=>{
    initData(url,params).then( (res)=>{
      data.option =res.content;
      data.loading = false;
      resolve(data);
    }).catch((err)=>{
      data.loading = false;
      data.option = [];
      reject(data);
    })
  });
}
