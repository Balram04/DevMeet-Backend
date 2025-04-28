const express=require('express');

const app=express();

app.get('/about',(req,res) => {
    res.send('im jems');

})

app.get('/contact',(req,res) => {
    res.send('im jems from contact page');

});
app.get('/services/msg',(req,res) => {
    res.send('im jems from services page');

}   );

app.get("/" ,(req,res)=>{
    res.send('hello world');
        
});

app.listen(7474,()=>{
    console.log('server is running on port 7477');
});