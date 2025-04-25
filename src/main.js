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
    this.partner_id=undefined
    try{
      this.io=io(this.SOCKET)
      
      if(this.io.id) this.isConnected=true
      this.io.on('id',e=>{
            this.id=e
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
         Alert(this.io.id?"Pairing Key":"Error",this.id?`${this.id} is your secret code to access your editor. Share it on your own risk`:"Unable to get pairing code.restart acode and check internet Connection")
          // listeningng for partner socket id
          
          
          
          
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
    ).then(e=>{
      this.io.emit('set-id',{id:this.io.id,partner_code:e})
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
