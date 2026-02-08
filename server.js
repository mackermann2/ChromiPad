const express = require('express');
const { chromium } = require('playwright');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

let browser;
(async ()=>{
  browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
})();

app.get('/browse', async (req,res)=>{
  let url = req.query.url;
  if(!url) return res.send('URL manquante');
  if(!url.startsWith('http')) url='https://'+url;

  try{
    const page = await browser.newPage({ viewport:{width:1280, height:900} });
    await page.goto(url,{waitUntil:'networkidle', timeout:60000});

    // Supprimer JS lourd pour Safari 12
    await page.evaluate(()=>{ document.querySelectorAll('script').forEach(s=>s.remove()); });

    const content = await page.content();
    await page.close();
    res.send(content);
  }catch(err){
    res.send('Erreur : '+err.message);
  }
});

app.listen(PORT, ()=> console.log(`Serveur prêt sur http://localhost:${PORT}`));

