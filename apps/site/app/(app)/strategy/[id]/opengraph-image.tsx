import { ImageResponse } from "next/server"
import { strategies } from "@/data/strategies"

export const runtime = "edge"

export const alt = "District Finance"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image({ params }: { params: { id: string } }) {
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
            "linear-gradient(to bottom right, #FFF 25%, #EEEEEE 75%)",
          }}
        >
          <h1
          style={{
            fontSize: "100px",
            fontFamily: "SF Pro",
            fontWeight: 900,
            color: "black",
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
            "linear-gradient(to bottom right, #FFF 25%, #EEEEEE 75%)",
        }}
      >
        <h3
          style={{
            color: "#969696",
            fontSize: "42px",
            fontFamily: "SF Pro",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: "-22px",
          }}
        >
          Strategy
        </h3>
        <h1
          style={{
            fontSize: "100px",
            fontFamily: "SF Pro",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "-6px",
          }}
        >
          {strategy.name}
        </h1>
        <p
          style={{
            fontSize: "28px",
            fontFamily: "SF Pro",
            color: "#7B7B7B",
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: "50%",
          }}
        >
          {strategy.description}
        </p>
        {
          strategy.createdBy ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "22px",
            }}>
              <h4
                style={{
                  fontSize: "24px",
                  fontFamily: "SF Pro",
                  color: "black",
                  letterSpacing: "-0.02em",
                  marginBottom: "-4px",
                }}
              >
                {strategy.createdBy.name}
              </h4>
              <span style={{
                  fontSize: "20px",
                  fontFamily: "SF Pro",
                  color: "#7B7B7B",
                }}>Created By</span>
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
