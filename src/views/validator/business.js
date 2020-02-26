
export const validDictSelect = (rule, value, callback,dict) => {
  if (!value) {
    callback(new Error('请选择!'))
  } else if (!validSelectExist(value,dict)) {
    callback(new Error('请选择字典选择中有的数据!'))
  } else {
    callback()
  }
}

function validSelectExist(value,dict) {
  var result = false;
   if(value && dict){
      dict.forEach((item)=>{
         if(item.value == value){
            result = true;
         }
      })
   }
   return result;
}
