const toast=acode.require("toast")
const handleSync=(io,partner_address,userType)=>{
    //sending editor session to partner
    if(userType=='host') {
        io.emit('session',{id:partner_address,data:editorManager.editor.session})
    }
    else{
        io.on('session',data=>{
            editorManager.editor.session.setMode(data.mode)
            editorManager.editor.setValue(data.value)
            editorManager.editor.gotoLine(data.selection.start.row,data.selection.start.column)
        })
    }
    // listening any changes on editor and emiting to server 
    editorManager.editor.session.on('change',e=>{
        io.emit('change',{id:partner_address,data:e})
    })
    // listening for any changes on partner editor
    io.on('change',e=>{
        if(e.action=='insert'){
        editorManager.editor.gotoLine(e.start.row.e.start.column)
        editorManager.editor.insert(e.lines[0] )
        }
        else{
            toast("Removed",3000)
            
        }
    })
    


  
}