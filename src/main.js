import plugin from '../plugin.json';
const toast=acode.require("toast")
const Alert =acode.require('alert')
const prompt=acode.require('prompt')
const select=acode.require('select')
const {io}=require('socket.io-client')

class Plugin{
  constructor(){
    this.prod=false
    this.SOCKET=this.prod?"https://test-server-two-nu.vercel.app/":"http://127.0.0.1:3424/"
    this.isConnected=false
    try{
      this.io=io(this.SOCKET)
      
      if(this.io.id) this.isConnected=true
      this.io.on('id',e=>{
            this.pairing_code=e
            toast(`Code ${e}`,3000)
          })
      this.io.on('get-id',e=>{
            this.partner_address=e
            toast(`Client Addr: ${e}`,3000)
            handleSync(this.io,e,this.userType)
          })
    }
    catch(e){
      toast(e,3000)
    }
    
  }
 async showSelect(){
    const options=[
      [13,'Share Editor','icon',!this.isConnected],
      [12,'Access Editor','icon',!this.isConnected],
      [-1,'Disconnect','icon',this.isConnected]
      ]
      const opt={
        onCancle:()=> toast("Cancle",3000),
        hideOnSelect:true,
        textTransform:true,
        default:this.isConnected?-1:13
      }
      await select("Acode Live Share",options,opt).then(async e=>{
        if(e==13){
          //share editor
           this.isConnected=true
           //getting socket id 
         Alert(this.io.id?"Pairing Key":"Error",this.pairing_code?`${this.pairing_code} is your secret code to access your editor. Share it on your own risk`:"Unable to get pairing code.restart acode and check internet Connection")
          this.userType='host'
          
        }
        else if(e==12){
          //access editor
         await   prompt(
    'Access Code... ',
    '',
    'number',{
      required:true,
      placeholder:'Enter Access Code'
      
    }
    ).then(code=>{
      this.io.emit('set-id',code)
      this.userType='remote'
      this.isConnected=true
      
      
    })
         
        
        }
        else{
          this.isConnected=false
        }
        
      })
  
}

}





class AcodePlugin {

  async init() {
    // plugin initialisation 
    this.plugin=new Plugin()
    editorManager.editor.commands.addCommand({
      name:"Acode Live Share",
      bindKey:{win:"Ctrl-t",mac:"Command-t"},
      exec:()=>{
       this.plugin.showSelect()
      
      }
    
    })
  }

  async destroy() {
    // plugin clean up
    this.io.disconnect()
    //setItem('partner_id','')
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
