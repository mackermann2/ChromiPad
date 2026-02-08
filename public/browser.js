const iframe = document.getElementById('content');
const urlInput = document.getElementById('url');
const tabsDiv = document.getElementById('tabs');

let historyStack = [[]];
let historyIndex = [-1];
let currentTab = 0;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

function navigate(url) {
  if(!url.startsWith('http')) url='https://'+url;
  iframe.src = `/browse?url=${encodeURIComponent(url)}`;
  historyStack[currentTab].splice(historyIndex[currentTab]+1);
  historyStack[currentTab].push(url);
  historyIndex[currentTab] = historyStack[currentTab].length-1;
  urlInput.value = url;
}

document.getElementById('go').onclick = ()=>navigate(urlInput.value);
document.getElementById('back').onclick = ()=>{
  if(historyIndex[currentTab]>0){
    historyIndex[currentTab]--;
    navigate(historyStack[currentTab][historyIndex[currentTab]]);
  }
};
document.getElementById('forward').onclick = ()=>{
  if(historyIndex[currentTab]<historyStack[currentTab].length-1){
    historyIndex[currentTab]++;
    navigate(historyStack[currentTab][historyIndex[currentTab]]);
  }
};
document.getElementById('refresh').onclick = ()=>{
  if(historyIndex[currentTab]>=0) navigate(historyStack[currentTab][historyIndex[currentTab]]);
};
document.getElementById('bookmark').onclick = ()=>{
  if(historyIndex[currentTab]>=0){
    const url = historyStack[currentTab][historyIndex[currentTab]];
    if(!bookmarks.includes(url)){
      bookmarks.push(url);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      alert('Favori ajouté !');
    }
  }
};

// Onglets
document.getElementById('newTab').onclick = ()=>{
  historyStack.push([]);
  historyIndex.push(-1);
  currentTab = historyStack.length-1;
  const btn = document.createElement('button');
  btn.innerText='Onglet '+currentTab;
  btn.onclick=()=>switchTab(currentTab);
  tabsDiv.insertBefore(btn, document.getElementById('newTab'));
  iframe.src='';
  urlInput.value='';
};

function switchTab(tabIndex){
  currentTab = tabIndex;
  const idx = historyIndex[currentTab];
  if(idx>=0) iframe.src = `/browse?url=${encodeURIComponent(historyStack[currentTab][idx])}`;
  urlInput.value = idx>=0? historyStack[currentTab][idx]:'';
}

