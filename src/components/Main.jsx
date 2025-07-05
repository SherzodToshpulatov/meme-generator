import { useState, useEffect } from "react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })
    
    const [allMemes, setAllMemes] = useState([]);


    useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        setAllMemes(data.data.memes); 
      })
      .catch((error) => {
        console.error("Error fetching memes:", error);
      });
  }, []);


    function getRandomMemeImage() {
    const randomIndex = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomIndex].url;
    setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: url
        })); // Set the image URL
    }


    function handleChange(event) {
        const {value, name} = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }


    function downloadMeme() {
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.crossOrigin = "anonymous"; // Important for CORS

        img.src = meme.imageUrl;
        img.onload = () => {
            const width = img.width;
            const height = img.height;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Draw top text
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.textAlign = "center";
            ctx.lineWidth = 4;
            ctx.font = `${Math.floor(width / 10)}px Impact`;
            ctx.textBaseline = "top";
            ctx.strokeText(meme.topText, width / 2, 10);
            ctx.fillText(meme.topText, width / 2, 10);

            // Draw bottom text
            ctx.textBaseline = "bottom";
            ctx.strokeText(meme.bottomText, width / 2, height - 10);
            ctx.fillText(meme.bottomText, width / 2, height - 10);

            // Convert canvas to image and trigger download
            const link = document.createElement("a");
            link.download = "meme.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        }


    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getRandomMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imageUrl} />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
            
            <button onClick={downloadMeme}>Download Meme ⬇️</button>

        </main>
    )
}