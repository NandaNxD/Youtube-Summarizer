import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await fetch(`http://localhost:3000/summary?videoId=${req.body.videoId}`)
  const json = await data.json()

  console.log(json)

  res.send(json)
}

export default handler
