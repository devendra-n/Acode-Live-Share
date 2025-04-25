
const eve=new Event("idChange")
const setItem=(key,value)=>{
  localStorage.setItem(key,value)
  dispatchEvent(eve)
}
const getItem=(key)=>{
  return localStorage.getItem(key)
  
 
}
 module.exports={setItem,getItem}