import React from "react";
import { Navbar } from "../../Components";
import "./Home.css";
import axios from "axios";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      url: ""
    };
  }

  search = () => {
    console.log(this.state);
    const instagramRegExp = new RegExp(
      /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/
    );
    const fetchInstagramPhotos = async accountUrl => {
      const response = await axios.get(accountUrl);
      const json = JSON.parse(response.data.match(instagramRegExp)[1]);
      const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
        0
      );
      const photos = edges.map(({ node }) => {
        return {
          url: `https://www.instagram.com/p/${node.shortcode}/`,
          thumbnailUrl: node.thumbnail_src,
          displayUrl: node.display_url,
          caption: node.edge_media_to_caption.edges[0].node.text
        };
      });
      return photos;
    };

    (async () => {
      try {
        const photos = await fetchInstagramPhotos(this.state.url);
        const container = document.getElementById("instagram-photos");
        photos.forEach(el => {
          const a = document.createElement("a");
          const img = document.createElement("img");

          a.setAttribute("href", el.url);
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
          a.classList.add("instagram-photo");

          img.setAttribute("src", el.thumbnailUrl);
          img.setAttribute("alt", el.caption);

          a.appendChild(img);
          container.appendChild(a);
        });
      } catch (e) {
        console.error("Fetching Instagram photos failed", e);
      }
    })();
  };
  render() {
    return (
      <div style={{ margin: 0 }}>
        <Navbar login="Login" />

        <div className="body-div">
          <h1 style={{ fontFamily: "Arial" }}>Enter Your Instagram Link</h1>
          <input
            type="text"
            placeholder="Enter Logined URL"
            onChange={e => this.setState({ url: e.target.value })}
          />
          <button onClick={() => this.search()}>Search Photo</button>

          <div id="instagram-photos" className="instagram-photos"></div>
          <p style={{ textAlign: "center" }}>Created By: Dileep44</p>
        </div>
      </div>
    );
  }
}

export default Home;
