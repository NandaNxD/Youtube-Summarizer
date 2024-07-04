import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import MarkdownRenderer from 'react-markdown-renderer';

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.getElementById(`subscribe-button`)!

const PlasmoInline = () => {
  const [loading, setLoading] = useState(false)

  const [summary, setSummary] = useState("")

  const [summaryPopupOpen, setSummaryPopupOpen] = useState(false);

  const markdown = '# Hi, *Pluto*!'

  useEffect(()=>{
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) =>{
        if (request.message === 'closePopup') {
          console.log(request.url) // new url is now in content scripts!
          setSummary('');
          setSummaryPopupOpen(false);
        }
    })


  },[])

  const getVideoId = () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const videoIdFromUrl = urlParams.get("v")
    return videoIdFromUrl
  }

  const loadSummary = async () => {
    if (summary) {
      setSummaryPopupOpen(true)
      return
    }
    const videoId = getVideoId()
    console.log(videoId)

    setLoading(true)

    const resp = await sendToBackground({
      name: "ping",
      body: {
        videoId
      }
    })

    setLoading(false)

    setSummary(resp?.videoSummary)
    setSummaryPopupOpen(true)

    console.log(resp)
  }

  if (loading) {
    return (
      <div
        className="summary-button"
        style={{
          borderRadius: "2rem",
          marginLeft: "1rem",
          background: "black",
          color: "white",
          display: "flex",
          gap: "4px",
          alignItems: "center",
          fontSize: "small",
          fontWeight: "bold",
          padding: "4px",
          paddingLeft: "10px",
          paddingRight: "10px",
          height: "27px",
          cursor: "pointer"
        }}>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className="summary-button"
        style={{
          borderRadius: "2rem",
          marginLeft: "1rem",
          background: "black",
          color: "white",
          display: "flex",
          gap: "4px",
          alignItems: "center",
          fontSize: "small",
          fontWeight: "bold",
          padding: "4px",
          paddingLeft: "10px",
          paddingRight: "10px",
          height: "27px",
          cursor: "pointer",
          whiteSpace:'nowrap'
        }}
        onClick={loadSummary}>
        <span>AI Summary</span>
        🌀
      </div>

      

      {summary && summaryPopupOpen && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "black",
            color: "white",
            border: "2px solid purple",
            borderRadius: "1rem",
            padding: "1rem",
            fontSize: "medium",
            top: "0px",
            left: "120%"
          }}>
          <div
            style={{
              height: "20px",
              width: "100%",
              textAlign: "end",
              cursor: "pointer",
            }}>
            <span onClick={() => setSummaryPopupOpen(false)}>❌</span>
          </div>
          <div
            style={{ overflowY: "auto", maxHeight: "300px", width: "500px" }}>
              <MarkdownRenderer markdown={summary} />
            
          </div>
        </div>
      )}
    </div>
  )
}

export default PlasmoInline
