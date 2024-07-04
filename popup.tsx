
import { useEffect, useState } from "react"

function IndexPopup() {
  const [currentUrl,setCurrentUrl]=useState('');

  const getCurrentUrl=async()=>{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    setCurrentUrl(tab.url);
  }

  useEffect(()=>{
    getCurrentUrl();
   
  },[])

  
  return (
    <span>Youtube Summarizer ⚡</span>
  )
}

export default IndexPopup
