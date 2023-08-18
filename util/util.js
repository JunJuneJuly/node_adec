function formatStr(str){
  let arr = str.split('&')
  let theRequest = {}
  for(let i = 0; i< arr.length;i++){
    let newArr = arr[i].split('=');
    
    theRequest[newArr[0]] = newArr[1]
    
  }
  return theRequest
}
module.exports = {
  formatStr
}