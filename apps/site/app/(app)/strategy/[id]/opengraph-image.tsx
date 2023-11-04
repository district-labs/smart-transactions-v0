import { ImageResponse } from "next/server"

import { siteConfig } from "@/config/site"
import { strategies } from "@/data/strategies"

export const runtime = "edge"

export const alt = "District Finance"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image({ params }: { params: { id: string, accountSharing: string } }) {
  const strategy = Object.values(strategies).find(s => s.id === params.id)

  if(!strategy) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            backgroundImage:
              "linear-gradient(to bottom right, #FFF 25%, #FFF0CA 75%)",
          }}
        >
          <h1
          style={{
            fontSize: "100px",
            fontFamily: "SF Pro",
            fontWeight: 900,
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Strategy Unavailable
        </h1>
  </div>
      ),
      {
        fonts: [
          {
            name: "SF Pro",
            data: await fetch(
              new URL(
                "@/assets/fonts/SF-Pro-Display-Medium.otf",
                import.meta.url
              )
            ).then((res) => res.arrayBuffer()),
          },
        ],
      }
    )
  }


  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(to bottom right, #FFF 25%, #FFF0CA 75%)",
        }}
      >
        <h1
          style={{
            fontSize: "100px",
            fontFamily: "SF Pro",
            fontWeight: 900,
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {strategy.name}
        </h1>
        <h3
          style={{
            fontSize: "22px",
            fontFamily: "SF Pro",
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.description}
        </h3>
        {
          params.accountSharing ? (
            <div
              style={{
                fontSize: "22px",
                fontFamily: "SF Pro",
                color: "black",
                lineHeight: "5rem",
                letterSpacing: "-0.02em",
              }}
            >
              {params.accountSharing}
            </div>
          ) : null
        }
      </div>
    ),
    {
      fonts: [
        {
          name: "SF Pro",
          data: await fetch(
            new URL(
              "@/assets/fonts/SF-Pro-Display-Medium.otf",
              import.meta.url
            )
          ).then((res) => res.arrayBuffer()),
        },
      ],
    }
  )
}
